const { View, Text, Image } = require('react-native');

const NOOP = () => {};
const ID = (t) => t;

const AnimationBuilder = {
  duration: function () {
    return this;
  },
  delay: function () {
    return this;
  },
  springify: function () {
    return this;
  },
  damping: function () {
    return this;
  },
  stiffness: function () {
    return this;
  },
  mass: function () {
    return this;
  },
  randomDelay: function () {
    return this;
  },
  withCallback: function () {
    return this;
  },
  withInitialValues: function () {
    return this;
  },
  easing: function () {
    return this;
  },
  build: () => NOOP,
};

const createAnimation = () => Object.create(AnimationBuilder);

module.exports = {
  __esModule: true,
  default: {
    View,
    Text,
    Image,
    ScrollView: View,
    FlatList: View,
    createAnimatedComponent: (component) => component,
  },
  View,
  Text,
  Image,
  Animated: {
    View,
    Text,
    Image,
    ScrollView: View,
    FlatList: View,
    createAnimatedComponent: (component) => component,
  },
  FadeIn: createAnimation(),
  FadeOut: createAnimation(),
  FadeInUp: createAnimation(),
  FadeInDown: createAnimation(),
  FadeOutUp: createAnimation(),
  FadeOutDown: createAnimation(),
  SlideInRight: createAnimation(),
  SlideInLeft: createAnimation(),
  SlideOutRight: createAnimation(),
  SlideOutLeft: createAnimation(),
  ZoomIn: createAnimation(),
  ZoomOut: createAnimation(),
  LinearTransition: createAnimation(),
  Layout: createAnimation(),
  useSharedValue: (value) => ({ value }),
  useAnimatedStyle: (_fn) => ({}),
  useAnimatedRef: () => ({ current: null }),
  useDerivedValue: (fn) => ({ value: fn() }),
  useAnimatedScrollHandler: NOOP,
  useAnimatedGestureHandler: NOOP,
  useEvent: () => NOOP,
  setGestureState: NOOP,
  withTiming: (value, _, callback) => {
    if (callback) callback(true);
    return value;
  },
  withSpring: (value, _, callback) => {
    if (callback) callback(true);
    return value;
  },
  withDelay: (_, animation) => animation,
  withSequence: (...animations) => animations[animations.length - 1],
  withRepeat: (animation) => animation,
  cancelAnimation: NOOP,
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
  interpolate: (_value, _inputRange, outputRange) => outputRange[0],
  interpolateColor: (_value, _inputRange, outputRange) => outputRange[0],
  Easing: {
    bezier: () => ID,
    linear: ID,
    ease: ID,
    in: ID,
    out: ID,
    inOut: ID,
  },
  Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
  createAnimatedComponent: (component) => component,
  setUpTests: NOOP,
};
