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
import Icon from 'react-native-vector-icons/Octicons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {ActivityIndicator} from 'react-native-paper';
import {useSelector} from 'react-redux';

const ScanItem = ({navigation, route}) => {
  const rbSheetRef = React.useRef();
  const {user, orders} = useSelector(state => state.user);
  const [quantity, setQuantity] = useState('');
  const [item, setItem] = useState();
  const [errorMain, setErrorMain] = useState(false);
  const [loading, setLoading] = useState(false);
  const items = route.params.items;

  onSuccess = scan => {
    let foundItem = items.find(item => item.item_id === scan.data);
    console.log(scan.data);
    setItem(foundItem);
    if (foundItem) {
      rbSheetRef?.current.open();
    } else {
      Alert.alert('', 'No Item Found Against this QR Code');
    }
  };

  const verifyItem = () => {
    setLoading(true);
    fetch(
      `https://mulberriestec.com/orders/${route.params.orderId}/item/${item.item_id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.token,
        },
      },
    )
      .then(async res => {
        const data = await res.json();
        if (res.status === 200) {
          rbSheetRef.current.close();
        } else {
          console.log(data);
        }
        setLoading(false);
      })
      .catch(err => console.log(err));
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <QRCodeScanner
        onRead={this.onSuccess}
        reactivate={true}
        reactivateTimeout={2000}
        cameraStyle={{backgroundColor: 'red'}}
      />
      <RBSheet
        ref={rbSheetRef}
        height={300}
        openDuration={250}
        customStyles={{
          container: {
            borderRadius: 8,
            padding: 20,
          },
        }}>
        <View style={{flex: 1}} testID="confirmSheet">
          <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 10}}>
            {item?.name}
          </Text>
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <View style={{flex: 1}}>
              <Text style={{fontWeight: 'bold'}}>ID</Text>
              <Text>{item?.item_id}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{fontWeight: 'bold'}}>SKU</Text>
              <Text>{item?.sku}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <View style={{flex: 1}}>
              <Text style={{fontWeight: 'bold'}}>Quantity</Text>
              <Text>{item?.qty_to_verify?.replace('.', '')}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{fontWeight: 'bold'}}>Verified</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name={item?.is_verified ? 'verified' : 'unverified'}
                  color={item?.is_verified ? 'green' : 'red'}
                  size={16}
                  style={{marginRight: 10}}
                />
                <Text>{item?.is_verified ? 'Yes' : 'No'}</Text>
              </View>
            </View>
          </View>
          {!item?.is_verified && (
            <TextInput
              placeholder="Verify Quantity"
              keyboardType="numeric"
              value={quantity}
              onChangeText={text => {
                setQuantity(text);
                setErrorMain(null);
              }}
              style={{
                borderColor: 'gray',
                marginBottom: 10,
                paddingLeft: 10,
                borderWidth: 1,
                borderRadius: 4,
              }}
            />
          )}
          {errorMain && (
            <Text style={{marginTop: 10, color: 'red'}}>{errorMain}</Text>
          )}

          <TouchableOpacity
            style={{
              backgroundColor: item?.is_verified ? '#00C48C' : '#4D61D6',
              padding: 15,
              position: 'absolute',
              bottom: 10,
              left: 20,
              right: 20,
            }}
            disabled={item?.is_verified}
            onPress={() => {
              quantity !== ''
                ? verifyItem()
                : setErrorMain('Item Qunatity Required!');
            }}>
            {loading ? (
              <ActivityIndicator color={'white'} />
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                {item?.is_verified ? 'Verified' : 'Verify'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  );
};

export default ScanItem;
