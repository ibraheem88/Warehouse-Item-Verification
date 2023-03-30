import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import moment from 'moment';
import QRCodeScanner from 'react-native-qrcode-scanner';

const ScanQrCode = ({navigation}) => {
  const {user, orders} = useSelector(state => state.user);

  const recheckOrder = id => {
    const order = fetch(`https://mulberriestec.com/users/orders/${id}`, {
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    })
      .then(res => res.json())
      .then(order => {
        return order.data;
      })
      .catch(err => console.log(err));
    return order;
  };

  onSuccess = scan => {
    const order = orders.find(item => item.entity_id === scan.data);
    if (order) {
      navigation.pop();
      navigation.navigate('Order Detail', {
        orderId: order.entity_id,
        scanDate: JSON.stringify(moment(new Date())),
      });
    } else {
      const orderAssigned = recheckOrder(scan.data);
      console.log(orderAssigned);
      Alert.alert('', 'No Order Found Against this QR Code');
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <QRCodeScanner
        onRead={this.onSuccess}
        reactivate={true}
        reactivateTimeout={2000}
        //flashMode={RNCamera.Constants.FlashMode.torch}
        cameraStyle={{backgroundColor: 'red'}}
        // bottomContent={
        //   <TouchableOpacity style={{padding: 2, marginTop: 10}}>
        //     <Text style={{fontSize: 21, color: 'rgb(0,122,255)'}}>
        //       OK. Got it!
        //     </Text>
        //   </TouchableOpacity>
        // }
      />
    </View>
  );
};

export default ScanQrCode;
