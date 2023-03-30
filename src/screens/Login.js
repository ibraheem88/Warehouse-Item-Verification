import React, {useState, useEffect} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {setTokenAndId} from '../state/actions/userActions';
import Icon from 'react-native-vector-icons/AntDesign';

function Login(props) {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const {user} = useSelector(state => state.user);
  const {token} = user;

  useEffect(() => {
    if (token) {
      props.navigation.replace('Home');
    }
  }, [token]);

  const login = () => {
    const form = new FormData();
    form.append('userId', userId);
    form.append('password', password);
    fetch('https://mulberriestec.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: form,
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 200) {
          dispatch(
            setTokenAndId({token: res.data.token, userId: res.data.userId}),
          );
        } else {
          setError(res.message); //Check this later by changing to res.res( Found by unit test :) )
        }
      })
      .catch(err => console.log('Error: ', err));
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://wallup.net/wp-content/uploads/2017/11/22/318267-New_York_City-street.jpg',
      }}
      onError={e => {
        console.log(e.nativeEvent.error);
      }}
      resizeMode="cover"
      testID="loginComponent"
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      <View
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: 10,
          paddingVertical: 10,
          margin: 10,
        }}>
        <View style={{alignSelf: 'center'}}>
          <Icon name="login" size={65} color={'white'} />
          <Text style={{color: 'white', fontSize: 40}}>Login</Text>
        </View>
        {error && (
          <Text
            testID="error"
            style={{
              textAlign: 'center',
              color: 'red',
              marginTop: 20,
              fontWeight: 'bold',
            }}>
            {error}
          </Text>
        )}
        <View style={styles.row}>
          <TextInput
            testID="userIdInput"
            onTouchStart={() => setError(null)}
            style={styles.input}
            value={userId}
            onChangeText={id => setUserId(id)}
          />
          <TextInput
            testID="passwordInput"
            onTouchStart={() => setError(null)}
            style={styles.input}
            value={password}
            onChangeText={password => setPassword(password)}
            secureTextEntry={true}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => login()}
            testID="loginButton">
            <Text style={styles.btnText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: 20,
  },
  input: {
    borderRadius: 12,
    borderColor: 'white',
    color: 'white',
    fontSize: 15,
    borderWidth: 1,
    margin: 5,
    padding: 10,
  },
  button: {
    backgroundColor: 'white',
    marginTop: 20,
    borderRadius: 12,
    fontSize: 20,
    borderWidth: 1,
    margin: 5,
    padding: 10,
    shadowColor: 'white',
  },
  btnText: {
    color: 'black',
    textAlign: 'center',
  },
});

export default Login;
