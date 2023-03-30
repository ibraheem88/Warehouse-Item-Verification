import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import OrderComponent from '../components/OrderComponent';
import Lottie from 'lottie-react-native';
import {useSelector} from 'react-redux';

const VerifiedOrders = ({navigation, route}) => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(2);
  const [refreshing, setRefreshing] = useState(false);
  const {user} = useSelector(state => state.user);
  const [loadingPagination, setLoadingPagination] = useState(false);
  const [loadMore, setLoadMore] = useState(true);
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
            if (res.data.length < 10) {
              setLoadMore(false);
            }
          }
        }
        setLoadingPagination(false);
        setRefreshing(false);
        setLoading(false);
      })
      .catch(err => console.log(err, 'err'));
  };

  const handlePagination = () => {
    if (loadMore) {
      setLoadingPagination(true);
      getVerifiedOrders(page, true);
    }
  };

  const EmptyComponent = (
    <View style={styles.emptyContainer} testID="emptyComponent">
      <Lottie
        source={require('../../assets/empty-box')}
        autoPlay
        loop
        style={{height: 200}}
      />
      <Text style={styles.emptyText}>No verified orders found</Text>
    </View>
  );

  const onRefresh = () => {
    setRefreshing(true);
    setOrders([]);
    setLoadMore(true);
    getVerifiedOrders(1);
    setPage(2);
  };

  useEffect(() => {
    getVerifiedOrders(1);
    setPage(2);
  }, []);

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <ActivityIndicator
          testID="loadingIndicator"
          style={{flex: 1, alignContent: 'center', backgroundColor: '#F0F5FF'}}
          size={26}
          color={'#4D61D6'}
        />
      ) : (
        <FlatList
          testID="flatlist"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          refreshControl={
            <RefreshControl
              enabled={true}
              colors={['#4D61D6']}
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
          data={orders}
          ListEmptyComponent={EmptyComponent}
          onEndReached={() => handlePagination()}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() =>
            loadingPagination && (
              <ActivityIndicator
                testID="loadingPaginationIndicator"
                style={{flex: 1, alignSelf: 'center'}}
                size={26}
                color={'#4D61D6'}
              />
            )
          }
          renderItem={({item}) => (
            <OrderComponent item={item} navigation={navigation} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    backgroundColor: '#F0F5FF',
    flexGrow: 1,
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
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default VerifiedOrders;
