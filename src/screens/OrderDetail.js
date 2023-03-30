import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, FlatList, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon4 from 'react-native-vector-icons/Ionicons';
import RBSheet from 'react-native-raw-bottom-sheet';
import Lottie from 'lottie-react-native';
import {useSelector} from 'react-redux';
import SignatureScreen from 'react-native-signature-canvas';
import ItemComponent from '../components/ItemComponent';
import moment from 'moment';
import {ActivityIndicator} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';

const OrderDetail = ({navigation, route}) => {
  const {user} = useSelector(state => state.user);
  const orderId = route.params.orderId;
  const scanDate = route.params.scanDate
    ? JSON.parse(route.params.scanDate)
    : undefined;
  const [orderVerified, setOrderVerified] = useState(true);
  const [order, setOrder] = useState();
  const [searchItems, setSearchItems] = useState();
  const rbSheetRef = React.useRef();
  const rbSheetRef2 = React.useRef();
  const signatureRef = React.useRef();
  const [loading, setLoading] = useState(true);
  const [mainLoading, setMainLoading] = useState(true);
  const [error, setError] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [errorVerify, setErrorVerify] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [signature, setSignature] = useState();
  const isFocus = useIsFocused();

  const handleOK = signature => {
    if (signature.length > 0) {
      setSignature(signature);
      setErrorVerify(null);
      rbSheetRef.current.close();
      rbSheetRef2.current.open();
      verifyOrder();
    } else {
      setError(true);
    }
  };

  const updateOrder = () => {
    const newOrder = {...order, is_verified: true};
    setOrder(newOrder);
  };

  const orderDetail = () => {
    fetch(`https://mulberriestec.com/orders/detail/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.token,
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 200) {
          setOrder(res.data);
        } else {
          console.log(res.data);
        }
        setMainLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const verifyOrder = () => {
    setLoading(true);
    fetch(`https://mulberriestec.com/orders/verify/${order.entity_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.token,
      },
      body: JSON.stringify({
        trail: {
          userId: user.userId,
          scanDate: scanDate ? scanDate : 'NaN',
          lastLogin: user.lastLogin,
        },
      }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 200) {
          updateOrder();
        } else {
          console.log(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
        setErrorVerify('Order Verification Failed');
      });
  };

  useEffect(() => {
    if (isFocus) {
      orderDetail();
    }
  });

  useEffect(() => {
    //const newItems = [...order?.item];
    const searchRegex = new RegExp(searchText, 'i');
    const searchItems = order?.item.filter(item =>
      searchRegex.test(item.item_id),
    );
    setSearchItems(searchItems);
  }, [searchText]);

  useEffect(() => {
    setOrderVerified(true);
    temp = 0;
    const dumorder = {...order};
    dumorder?.item?.filter(item => {
      if (item.is_verified === '0' || item.is_verified === false) {
        setOrderVerified(false);
        temp += 1;
      }
    });
    setRemaining(temp);
  }, [order]);

  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {
    setError(true);
  };

  const handleStart = () => {
    setError(null);
  };

  // Called after end of stroke
  const handleEnd = () => {
    setError(null);
    signatureRef.current.readSignature();
  };

  return mainLoading ? (
    <ActivityIndicator
      testID="loadingIndicator"
      style={{flex: 1, alignSelf: 'center'}}
      size={26}
      color={'#4D61D6'}
    />
  ) : (
    <View
      style={{
        flex: 1,
        padding: 20,
        paddingBottom: 10,
        backgroundColor: '#F0F5FF',
      }}>
      <View style={{backgroundColor: '#FFFFFF', marginBottom: 15}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Icon4 name="search" size={20} color="black" />
          <TextInput
            placeholder="Search"
            onChangeText={text => setSearchText(text)}
            //onBlur={() => setSearchText('')}
            value={searchText}
            style={{
              flex: 1,
              marginLeft: 10,
              color: 'black',
              fontSize: 16,
              borderRadius: 4,
              paddingVertical: 10,
              paddingHorizontal: 10,
            }}
          />
          <Icon3
            name="qrcode-scan"
            size={20}
            color="black"
            onPress={() =>
              navigation.navigate('Scan Item', {
                items: order.item,
                orderId: order.entity_id,
              })
            }
          />
        </View>
      </View>
      {!orderVerified && searchText.length == 0 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
          }}>
          <Text
            style={{
              backgroundColor: '#4D61D6',
              borderRadius: 5,
              color: 'white',
              padding: 10,
            }}>
            Items Verified: {order.item.length - remaining}
          </Text>
          <Text
            style={{
              backgroundColor: '#4D61D6',
              borderRadius: 5,
              color: 'white',
              padding: 10,
            }}>
            Items Remaining: {temp}
          </Text>
        </View>
      )}
      {!order?.is_verified && orderVerified && searchText.length == 0 && (
        <TouchableOpacity
          testID="verifyButton"
          onPress={() => rbSheetRef.current.open()}
          style={{
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#4D61D6',
            marginBottom: 30,
            borderRadius: 3,
          }}>
          <Text
            style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>
            Verify Order
          </Text>
          <Icon
            style={{marginLeft: 10}}
            name={'verified'}
            color={'white'}
            size={16}
          />
        </TouchableOpacity>
      )}
      <FlatList
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        contentContainerStyle={{paddingBottom: 20}}
        data={searchText.length > 0 ? searchItems : order?.item}
        renderItem={({item}) => (
          <ItemComponent
            key={item.item_id}
            item={item}
            order={order}
            setOrder={setOrder}
          />
        )}
      />
      <RBSheet
        ref={rbSheetRef}
        height={500}
        openDuration={250}
        customStyles={{
          container: {
            borderRadius: 8,
            padding: 20,
          },
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
          }}>
          <Icon
            name="chevron-left"
            color="black"
            onPress={() => {
              rbSheetRef.current.close();
            }}
            size={20}
            style={{alignSelf: 'flex-start'}}
          />
        </View>
        <Text style={{fontWeight: 'bold', marginBottom: 10}}>
          Verifier Signature:
        </Text>
        <View testID="signatureCanvas" style={{flex: 1}}>
          <SignatureScreen
            ref={signatureRef}
            onBegin={handleStart}
            onEnd={handleEnd}
            onOK={handleOK}
            onEmpty={handleEmpty}
            autoClear={false}
            descriptionText={'text'}
          />
        </View>
        {error && (
          <Text
            testID="errorEmptySignature"
            style={{color: 'red', textAlign: 'center'}}>
            Signature cannot be empty!
          </Text>
        )}
      </RBSheet>
      <RBSheet
        ref={rbSheetRef2}
        height={350}
        openDuration={250}
        customStyles={{
          container: {
            borderRadius: 8,
            padding: 20,
          },
        }}>
        <View testID="orderConfirmation" style={{flex: 1}}>
          <Icon2
            onPress={() => rbSheetRef2.current.close()}
            name="close"
            color="black"
            size={18}
            style={{alignSelf: 'flex-end', padding: 5}}
          />
          <Text style={{fontWeight: 'bold', marginBottom: 10}}>
            #{order?.entity_id}
          </Text>
          <Text style={{fontWeight: 'bold', marginBottom: 10}}>
            Total Invoiced: {order?.total_invoiced?.replace('.', '')}
          </Text>
          {loading ? (
            <ActivityIndicator
              color="black"
              style={{alignSelf: 'center', flex: 1}}
            />
          ) : errorVerify ? (
            <>
              <Lottie
                source={require('../../assets/failed')}
                autoPlay
                loop={false}
                style={{height: 200, alignSelf: 'center'}}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                {errorVerify}
              </Text>
            </>
          ) : (
            <>
              <Lottie
                source={require('../../assets/done')}
                testID="verifiedAnimation"
                autoPlay
                loop
                style={{height: 200, alignSelf: 'center'}}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                Order Verified
              </Text>
            </>
          )}
        </View>
      </RBSheet>
    </View>
  );
};

export default OrderDetail;
