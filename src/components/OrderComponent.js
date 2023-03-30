import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import moment from 'moment';

const OrderComponent = ({item, navigation}) => (
  <Pressable
    testID="orderComponent"
    style={styles.container}
    onPress={() =>
      navigation.navigate('Order Detail', {orderId: item.entity_id})
    }>
    <View style={styles.infoContainer}>
      <Text style={styles.idText}>#{item?.entity_id}</Text>
      <Text style={styles.dateText}>
        Due Date: {moment(item?.due_date).format('hh:mm D MMM YY')}
      </Text>
    </View>
    <View style={styles.infoContainer}>
      <Text style={styles.amountText}>${item?.total_invoiced}</Text>
      <Text style={styles.quantityText}>{item?.total_qty_ordered} pcs</Text>
      <Icon
        style={styles.verifiedIcon}
        name={item?.is_verified == 0 ? 'unverified' : 'verified'}
        color={item?.is_verified == 0 ? '#FF4F4F' : '#00C48C'}
        size={20}
      />
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: '100%',
    backgroundColor: '#FFF',
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  idText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  dateText: {
    color: '#AAA',
    fontSize: 12,
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#00C48C',
    marginBottom: 8,
  },
  quantityText: {
    color: '#AAA',
    fontSize: 12,
    marginBottom: 8,
  },
  verifiedIcon: {
    marginLeft: 16,
  },
});

export default OrderComponent;
