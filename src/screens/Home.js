import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {setUserInfo, setOrders} from '../state/actions/userActions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';
import OrderComponent from '../components/OrderComponent';
import {TextInput} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(2);
  const [searchOrders, setSearchOrders] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(true);
  const [loadingPagination, setLoadingPagination] = useState(false);
  const isFocus = useIsFocused();

  const getOrders = (p, pagination) => {
    const offSet = p ? p : page;
    // console.log(offSet, pagination);
    if (!pagination) {
      setLoading(true);
    } else {
      setLoadingPagination(true);
    }
    fetch(
      `https://mulberriestec.com/users/orders/page/${offSet}/search/${searchText}`,
      {
        headers: {
          Authorization: 'Bearer ' + user.token,
        },
      },
    )
      .then(res => res.json())
      .then(res => {
        if (res.data.length > 0) {
          if (!pagination) {
            setOrders(res.data);
          } else {
            setOrders([...orders, ...res.data]);
            setPage(page + 1);
            setLoadingPagination(false);
            if (res.data.length < 10) {
              setLoadMore(false);
            }
          }
        }
        setLoading(false);
        setLoadingPagination(false);
      })
      .catch(err => console.log(err, 'err'));
  };

  const SearchOrders = page => {
    fetch(
      `https://mulberriestec.com/users/orders/page/${page}/search/${searchText}`,
      {
        headers: {
          Authorization: 'Bearer ' + user.token,
        },
      },
    )
      .then(res => res.json())
      .then(orders => {
        setLoadingPagination(false);
        setSearchOrders(orders.data);
      })
      .catch(err => console.log(err, 'err'));
  };

  const getUser = async () => {
    fetch(`https://mulberriestec.com/users/detail/${user.userId}`, {
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    })
      .then(res => res.json())
      .then(user => {
        dispatch(setUserInfo(user.data));
      })
      .catch(err => console.log(err));
  };

  const handlePagination = () => {
    if (loadMore) {
      getOrders(page, true);
    }
  };

  ListEmptyComponent = () =>
    // loadingPagination ? (
    //   <ActivityIndicator
    //     style={{flex: 1, alignSelf: 'center'}}
    //     size={26}
    //     color={'#4D61D6'}
    //   />
    // ) :
    searchText.length > 2 &&
    !loadingPagination && (
      <View
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        testID="emptyComponent">
        <Lottie
          source={require('../../assets/empty-box')}
          style={{height: 200}}
          autoPlay
          loop={true}
        />
        <Text style={{fontWeight: 'bold', fontSize: 14}}>
          No Orders Assigned
        </Text>
      </View>
    );

  useEffect(() => {
    if (isFocus) {
      setLoadMore(true);
      getOrders(1);
      setPage(2);
    }
  }, [isFocus]);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (searchText.length > 2) {
      setLoadingPagination(true);
      SearchOrders(1);
    }
  }, [searchText]);

  return (
    <View testID="mainComponent" style={{flex: 1}}>
      {loading ? (
        <ActivityIndicator
          testID="loadingIndicator"
          style={{flex: 1, alignSelf: 'center'}}
          size={26}
          color={'#4D61D6'}
        />
      ) : (
        <View
          testID="test"
          style={{
            flex: 1,
            padding: 20,
            paddingBottom: 0,
            backgroundColor: '#F0F5FF',
          }}>
          {orders.length > 0 && (
            <View style={{backgroundColor: '#FFFFFF', marginBottom: 15}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                }}>
                <Icon2 name="search" size={20} color="black" />
                <TextInput
                  placeholder="Search"
                  onChangeText={text => setSearchText(text)}
                  onBlur={() => setSearchText('')}
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
                <TouchableOpacity
                  testID="qrCodeButton"
                  onPress={() => navigation.navigate('Scan Order')}>
                  <Icon name="qrcode-scan" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {/* {orders.length > 0 && searchText.length == 0 && (
            <TouchableOpacity
              testID="qrCodeButton"
              onPress={() => navigation.navigate('Scan Order')}
              style={{
                alignSelf: 'center',
                padding: 20,
                backgroundColor: '#4D61D6',
                marginBottom: 30,
                borderRadius: 3,
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                Scan Order QR Code
              </Text>
            </TouchableOpacity>
          )} */}
          <FlatList
            data={searchText.length > 0 ? searchOrders : orders}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1, paddingBottom: 10}}
            ListEmptyComponent={ListEmptyComponent}
            onEndReachedThreshold={0.1}
            onEndReached={() => handlePagination()}
            ListFooterComponent={() =>
              loadingPagination &&
              searchText.length < 1 && (
                <ActivityIndicator
                  testID="loadingPaginationIndicator"
                  style={{flex: 1, alignSelf: 'center'}}
                  size={26}
                  color={'#4D61D6'}
                />
              )
            }
            renderItem={({item}) =>
              !item.is_verified && (
                <OrderComponent
                  key={item.entity_id}
                  item={item}
                  navigation={navigation}
                />
              )
            }
          />
        </View>
      )}
    </View>
  );
};

export default Home;
