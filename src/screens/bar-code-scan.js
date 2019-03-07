import React, {Component} from 'react';

import BarcodeScannerView from 'react-native-scan-barcode';

export default class BarCodeScan extends Component<> {
  state = {
    torchMode: 'off',
    cameraType: 'back',
  };

  barcodeReceived = (e) => {
    alert('Barcode: ' + e.data);
  }

  render() {
    return (
      <BarcodeScannerView
        onBarCodeRead={this.barcodeReceived}
        style={{ flex: 1 }}
        torchMode={this.state.torchMode}
        cameraType={this.state.cameraType}
      />
    );
  }
}
