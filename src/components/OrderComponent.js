import {Pressable, StyleSheet, Text, View} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Octicons';

const OrderComponent = ({item, navigation}) => {
  return (
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
        <Text style={styles.amountText}>${parseInt(item?.total_invoiced)}</Text>
        <Text style={styles.quantityText}>
          {parseInt(item?.total_qty_ordered)} pcs
        </Text>
        <View style={styles.iconContainer}>
          <Icon
            name={item?.is_verified == 0 ? 'unverified' : 'verified'}
            color={item?.is_verified == 0 ? '#FF4F4F' : '#00C48C'}
            size={20}
          />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    margin: 8,
  },
  infoContainer: {
    alignItems: 'center',
  },
  idText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateText: {
    color: '#666',
    fontSize: 14,
  },
  amountText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantityText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default OrderComponent;
