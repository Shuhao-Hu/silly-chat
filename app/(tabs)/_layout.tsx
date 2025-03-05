import { Tabs } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function TabLayout() {
  return (
    <AuthProvider>
      <Tabs>
        <Tabs.Screen name="index" options={{ headerTitle: 'Chats', tabBarLabel: 'Chats' }} />
        <Tabs.Screen name="contacts" options={{ headerTitle: 'Contacts', tabBarLabel: 'Contacts' }} />
        <Tabs.Screen name="account" options={{ headerTitle: 'Account', tabBarLabel: 'Account' }} />
      </Tabs>
    </AuthProvider>
  );
}

