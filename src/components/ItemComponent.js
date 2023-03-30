import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {setOrders} from '../state/actions/userActions';
import {useSelector, useDispatch} from 'react-redux';

const ItemComponent = props => {
  const rbSheetRef = React.useRef();
  const dispatch = useDispatch();
  const {user, orders} = useSelector(state => state.user);
  const [item, setItem] = useState(props.item);
  const [quantity, setQuantity] = useState('');
  const [errorMain, setErrorMain] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateOrder = () => {
    const order = props.order;
    let newItems = order.item.map(elem => {
      if (elem.item_id === item.item_id) {
        return {...elem, is_verified: true, verified_by: user.userId};
      } else {
        return elem;
      }
    });
    const newOrder = {...order, item: newItems};
    props.setOrder(newOrder);
    rbSheetRef.current.close();
  };

  useEffect(() => {
    setItem(props.item);
  }, [props.item]);

  const verifyItem = () => {
    setLoading(true);
    fetch(
      `https://mulberriestec.com/orders/${props.order.entity_id}/item/${item.item_id}`,
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
          updateOrder();
        } else {
          console.log(data);
        }
        setLoading(false);
      })
      .catch(err => console.log(err));
  };

  return (
    <Pressable
      testID={'orderComponent'}
      style={{
        height: 75,
        width: '100%',
        backgroundColor: 'white',
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      onPress={() => rbSheetRef.current.open()}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon2
          name="package-variant-closed"
          color="#4D61D6"
          size={20}
          style={{marginRight: 10}}
        />
        <View>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            #{item?.item_id}
          </Text>
          <Text style={{fontSize: 14}}>{item.name}</Text>
          <Text style={{fontSize: 12, color: '#6B7280'}}>
            Quantity: {item.qty_to_verify.replace('.', '')}
          </Text>
        </View>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{fontWeight: 'bold', marginRight: 10}}>
          ${item.unit_price.split('.')[0]}
        </Text>
        <Icon
          name={item.is_verified == 0 ? 'unverified' : 'verified'}
          color={item.is_verified == 0 ? '#EF4444' : '#10B981'}
          size={20}
        />
      </View>
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
              testID="inputQuantity"
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
            <Text testID="error" style={{marginTop: 10, color: 'red'}}>
              {errorMain}
            </Text>
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
            testID="verifyButton"
            disabled={item?.is_verified}
            onPress={() => {
              quantity.length < 1
                ? setErrorMain('Item Qunatity Required!')
                : parseInt(quantity) > parseInt(item.qty_to_verify)
                ? setErrorMain('Qunaity can not exceed alloted quantity!')
                : verifyItem();
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
    </Pressable>
  );
};

export default ItemComponent;
