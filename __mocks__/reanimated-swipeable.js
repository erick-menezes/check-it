const React = require('react');
const { View } = require('react-native');

const PROGRESS = { value: 0 };
const TRANSLATION = { value: 0 };
const METHODS = {
  close: () => {},
  reset: () => {},
  openLeft: () => {},
  openRight: () => {},
};

function ReanimatedSwipeable({ children, renderRightActions }) {
  return React.createElement(
    View,
    null,
    renderRightActions
      ? renderRightActions(PROGRESS, TRANSLATION, METHODS)
      : null,
    children,
  );
}

module.exports = { __esModule: true, default: ReanimatedSwipeable };
