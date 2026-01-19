import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../context/ThemeContext';
import { fetchProducts } from '../api/productsApi';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const HomeScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // Fetch products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts(15);
      setProducts(data.products);
      setLastDoc(data.lastDoc);
      setHasMore(data.products.length === 15);

      // If no products, add sample data
      if (data.products.length === 0) {
        console.log('No products found, adding sample data...');
        await addSampleDataIfEmpty();
      }
    } catch (error) {
      console.log('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load more products
  const loadMoreProducts = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const data = await fetchProducts(15, lastDoc);
      // Add a 0.5 second delay before showing new items
      setTimeout(() => {
        setProducts(prev => [...prev, ...data.products]);
        setLastDoc(data.lastDoc);
        setHasMore(data.products.length === 15);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.log('Error fetching more products:', error);
      setLoading(false);
    }
  };

  // Render single product
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { product: item })}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>₹ {item.price}</Text>
    </TouchableOpacity>
  );

  // Load products
  useEffect(() => {
    loadProducts();
  }, []);

  // Reload when category changes
  useEffect(() => {
    if (selectedCategory !== 'All') {
      loadProducts();
    }
  }, [selectedCategory]);

  // Add sample data if collection is empty
  const addSampleDataIfEmpty = async () => {
    try {
      const sampleProducts = [
        {
          id: 1,
          title: 'iPhone 15 Pro',
          price: 999,
          thumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
          description: 'Latest iPhone with advanced features',
          category: 'Smartphones'
        },
        {
          id: 2,
          title: 'MacBook Air M3',
          price: 1099,
          thumbnail: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
          description: 'Powerful laptop for professionals',
          category: 'laptops'
        },
        {
          id: 3,
          title: 'AirPods Pro',
          price: 8000,
          thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/AirPods_Pro_%282nd_generation%29.jpg',
          description: 'Wireless earbuds with noise cancellation',
          category: 'mobile accessories'
        }
      ];

      console.log('Adding sample products...');
      for (const product of sampleProducts) {
        await addDoc(collection(db, 'products'), product);
        console.log(`Added product: ${product.title}`);
      }
      console.log('Sample products added successfully!');

      // Reload products after adding
      loadProducts();
    } catch (error) {
      console.error('Error adding sample products:', error);
    }
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    if (sortBy === 'asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [products, sortBy, selectedCategory]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    }, 
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    headerButtons: {
      flexDirection: 'row',
    },
    iconButton: {
      padding: 10,
      marginLeft: 10,
    },
    toggleButton: {
      padding: 10,
      backgroundColor: theme.colors.primary,
      borderRadius: 5,
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    filterSection: {
      flex: 1,
      marginHorizontal: 5,
    },
    filterLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginTop: 10,
      marginBottom: 5,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    checkboxText: {
      marginLeft: 10,
      color: theme.colors.text,
      fontSize: 14,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 10,
      padding: 10,
      marginBottom: 15,
      elevation: 2,
    },
    image: {
      width: '100%',
      height: 180,
      borderRadius: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      marginTop: 8,
      color: theme.colors.text,
    },
    price: {
      fontSize: 14,
      color: theme.colors.primary,
      marginTop: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderRadius: 10,
      padding: 20,
      width: '90%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    closeButton: {
      backgroundColor: theme.colors.primary,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
    },
    closeButtonText: {
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    loadingContainer: {
      padding: 20,
      alignItems: 'center',
    },
    loadingText: {
      color: theme.colors.text,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} >Products</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="filter" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
            <Ionicons name={theme.dark ? 'sunny' : 'moon'} size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.docId}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <View style={styles.loadingContainer}><Text style={styles.loadingText}>Loading...</Text></View> : null}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filters</Text>
            <View style={styles.filterContainer}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Category:</Text>
                {['All', 'Smartphones', 'laptops', 'mobile accessories', 'home appliances'].map(category => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    style={styles.checkboxContainer}
                  >
                    <Ionicons
                      name={selectedCategory === category ? 'checkmark-circle' : 'radio-button-off'}
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.checkboxText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Sort by Price:</Text>
                {[
                  { label: 'None', value: null },
                  { label: 'Low to High', value: 'asc' },
                  { label: 'High to Low', value: 'desc' }
                ].map(item => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => setSortBy(item.value)}
                    style={styles.checkboxContainer}
                  >
                    <Ionicons
                      name={sortBy === item.value ? 'checkmark-circle' : 'radio-button-off'}
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.checkboxText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
