import { View, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/auth';

export default function Account() {
  const { isLoggedIn, login, logout } = useAuth();
  logout();

  if (!isLoggedIn) {
    return <Login />
  }
  return <View><Text>Hello Account</Text></View>;
}
