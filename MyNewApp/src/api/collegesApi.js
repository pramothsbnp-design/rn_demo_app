import { collection, getDocs, query, orderBy, limit, startAfter, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

/**
 * Fetches colleges from Firestore with optional pagination and type filtering
 * @param {number} limitNum - Number of colleges to fetch (default: 15)
 * @param {Object} lastDoc - Last document reference for pagination
 * @param {string} type - College type filter ('All' for no filter, 'GOVT', 'PRIVATE')
 * @returns {Promise<Object>} Object containing colleges array and lastDoc reference
 */
export const fetchColleges = async (limitNum = null, lastDoc = null, type = 'All') => {
  try {
    // Reference to colleges collection
    const collegesRef = collection(db, 'colleges');
    let q;

    // When no type filter is applied we can order by `name` on the server.
    // When a `type` filter is applied, Firestore requires a composite index
    // for the combination of `where('type', ...)` and `orderBy('name')`.
    // To avoid forcing an index here, fetch the filtered set and sort client-side.
    if (type === 'All') {
      q = query(collegesRef, orderBy('name'));

      // Apply pagination when ordering by name (server-side)
      if (lastDoc) {
        q = query(q, startAfter(lastDoc), limit(limitNum || 15));
      } else {
        q = query(q, limit(limitNum || 15));
      }
    } else {
      // Filter by type without server-side ordering to avoid composite-index requirement
      // For filtered queries we fetch a single page (limit) and sort client-side.
      q = query(collegesRef, where('type', '==', type), limit(limitNum || 50));
    }
    
    const querySnapshot = await getDocs(q);

    // Map documents to college objects with docId
    let colleges = querySnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));

    // If we fetched a filtered (type !== 'All') result, sort client-side and do not return lastDoc
    if (type !== 'All') {
      colleges = colleges.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      return { colleges, lastDoc: null };
    }

    // Get last document for next pagination (only meaningful when type === 'All')
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { colleges, lastDoc: lastVisible };
  } catch (error) {
    console.error('Firebase error:', error);
    // Return empty array instead of throwing to prevent crashes
    return { colleges: [], lastDoc: null };
  }
};

/**
 * Sets up real-time listener for colleges collection
 * Triggers callback when new colleges are added
 * @param {Function} onNewCollege - Callback function when new college is added
 * @returns {Function} Unsubscribe function to stop listening
 */
export const subscribeToNewColleges = (onNewCollege) => {
  try {
    const collegesRef = collection(db, 'colleges');
    const q = query(collegesRef, orderBy('name'));
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        // Trigger callback only for newly added documents
        if (change.type === 'added') {
          const newCollege = {
            docId: change.doc.id,
            ...change.doc.data()
          };
          onNewCollege(newCollege);
        }
      });
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up real-time listener:', error);
    return () => {}; // Return no-op unsubscribe
  }
};

/**
 * Fetches the current user's profile data from Firestore
 * @returns {Promise<Object|null>} User profile data or null if not found
 */
export const fetchUserProfile = async () => {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.log('No authenticated user found');
      return null;
    }

    const docRef = doc(db, 'userProfiles', currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * Filters colleges based on user profile (expected score range and category)
 * @param {Array} colleges - Array of college objects to filter
 * @param {Object} userProfile - User profile with expectedScoreFrom, expectedScoreTo, and category
 * @returns {Array} Filtered array of eligible colleges
 */
export const filterCollegesByProfile = (colleges, userProfile) => {
  if (!colleges || !Array.isArray(colleges) || !userProfile) {
    return colleges || [];
  }

  const { expectedScoreFrom, expectedScoreTo, category } = userProfile;
  
  // If no score range or category is set, return all colleges
  if (!expectedScoreFrom && !expectedScoreTo && !category) {
    return colleges;
  }

  return colleges.filter(college => {
    // If no cutoff data, include the college
    if (!college.cutoff || typeof college.cutoff !== 'object') {
      return true;
    }

    // Get the cutoff score for the user's category
    const categoryKey = category ? category.toLowerCase() : 'general';
    const cutoffScore = college.cutoff[categoryKey] || college.cutoff.general;

    // If no cutoff score found, include the college
    if (!cutoffScore) {
      return true;
    }

    const scoreFrom = parseInt(expectedScoreFrom, 10);
    const scoreTo = parseInt(expectedScoreTo, 10);
    const cutoff = parseInt(cutoffScore, 10);

    // Check if user's score range covers the college's cutoff
    // Include college if: scoreFrom <= cutoff <= scoreTo
    if (!isNaN(scoreFrom) && !isNaN(scoreTo) && !isNaN(cutoff)) {
      return scoreFrom <= cutoff && cutoff <= scoreTo;
    }

    // If score conversion fails, include the college
    return true;
  });
};
