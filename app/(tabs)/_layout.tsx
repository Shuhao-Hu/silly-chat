import { Tabs } from 'expo-router';
import { AuthProvider } from '../../context/AuthContext';
import { ConfigProvider } from '@/context/ConfigContext';
import { ApiProvider } from '@/context/ApiContext';
import { Image, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AddFriendButton from '../components/add_friend_button';
import TabBadge from '../components/tab_badge';



export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#3da9fc' }}>
      <Tabs.Screen name="index" options={{
        headerTitle: 'Chats',
        tabBarLabel: 'Chats',
        tabBarIcon: ({ color }) => <Entypo size={16} name="chat" color={color} />,
      }} />
      <Tabs.Screen name="contacts" options={{
        headerTitle: 'Contacts',
        tabBarLabel: 'Contacts',
        tabBarIcon:
          ({ color }) => (
            <View style={{ position: 'relative' }}>
              <AntDesign name="contacts" size={16} color={color} />
              <TabBadge />
            </View>
          ),
        headerRight: () => <AddFriendButton></AddFriendButton>
      }} />
      <Tabs.Screen name="account" options={{
        headerTitle: 'Account',
        tabBarLabel: 'Account',
        tabBarIcon: ({ color }) => <MaterialIcons name="manage-accounts" size={24} color={color} />,
      }} />
    </Tabs>
  );
}
