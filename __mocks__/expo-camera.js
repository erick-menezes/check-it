const React = require('react');
const { View } = require('react-native');

const GRANTED_PERMISSION = {
  status: 'granted',
  granted: true,
  canAskAgain: true,
  expires: 'never',
};

let mockPermission = GRANTED_PERMISSION;
const requestPermission = jest.fn(async () => mockPermission);

function __setCameraPermission(permission) {
  mockPermission = permission;
}

function __resetCameraPermission() {
  mockPermission = GRANTED_PERMISSION;
  requestPermission.mockClear();
}

function useCameraPermissions() {
  return [mockPermission, requestPermission];
}

class CameraView extends React.Component {
  componentDidMount() {
    this.props.onCameraReady?.();
  }
  async takePictureAsync() {
    return { uri: 'file:///mock/receipt.jpg', width: 1, height: 1 };
  }
  render() {
    return React.createElement(View, { testID: this.props.testID });
  }
}

module.exports = {
  CameraView,
  useCameraPermissions,
  requestPermission,
  __setCameraPermission,
  __resetCameraPermission,
};
