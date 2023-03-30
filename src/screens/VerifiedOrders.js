import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import OrderComponent from '../components/OrderComponent';
import Lottie from 'lottie-react-native';
import {useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';

const VerifiedOrders = ({navigation, route}) => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(2);
  const {user} = useSelector(state => state.user);
  const [loading, setLoading] = useState(true);

  const getVerifiedOrders = (p, pagination) => {
    const offSet = p ? p : page;
    //console.log(offSet, pagination);
    if (!pagination) {
      setLoading(true);
    }
    fetch(`https://mulberriestec.com/users/orders/verified/page/${offSet}`, {
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.data.length > 0) {
          if (!pagination) {
            setOrders(res.data);
          } else {
            setOrders([...orders, ...res.data]);
            setPage(page + 1);
          }
        }
        setLoading(false);
      })
      .catch(err => console.log(err, 'err'));
  };

  const handlePagination = () => {
    getVerifiedOrders(page, true);
  };

  useEffect(() => {
    getVerifiedOrders(1);
    setPage(2);
  }, []);

  return loading ? (
    <ActivityIndicator
      testID="loadingIndicator"
      style={{flex: 1, alignSelf: 'center'}}
      size={26}
      color={'#4D61D6'}
    />
  ) : orders.length > 0 ? (
    <FlatList
      style={styles.container}
      testID="flatlist"
      contentContainerStyle={styles.contentContainerStyle}
      data={orders}
      onEndReached={() => handlePagination()}
      onEndReachedThreshold={0.1}
      renderItem={({item}) => (
        <TouchableOpacity
          key={item.entity_id}
          style={styles.orderContainer}
          onPress={() => navigation.navigate('OrderDetails', {order: item})}>
          <OrderComponent item={item} />
        </TouchableOpacity>
      )}
    />
  ) : (
    <View style={styles.emptyContainer} testID="emptyComponent">
      <Lottie
        source={require('../../assets/empty-box')}
        autoPlay
        loop
        style={{marginBottom: 50}}
      />
      <Text style={styles.emptyText}>No verified orders found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5FF',
  },
  contentContainerStyle: {
    padding: 16,
  },
  orderContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 50,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#AAA',
  },
});

export default VerifiedOrders;
