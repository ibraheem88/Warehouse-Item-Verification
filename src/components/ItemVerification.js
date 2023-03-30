import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  TextInput,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import orderRes from '../../SalesOrderSample.json';
import Icon from 'react-native-vector-icons/Octicons';
import SignatureScreen from 'react-native-signature-canvas';
import QRCodeScanner from 'react-native-qrcode-scanner';

const ItemVerification = ({item}) => {
  return (
    <View
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}></View>
  );
};

export default ItemVerification;
