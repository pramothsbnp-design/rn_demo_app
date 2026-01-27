module.exports = {
  requireOptionalNativeModule: jest.fn(),
  requireNativeModule: jest.fn(),
  EventEmitter: class EventEmitter {},
  NativeModule: class NativeModule {},
};
