import { Stack } from 'expo-router';
import GoBackButton from './components/go_back_button';
import { ConfigProvider } from '@/context/ConfigContext';
import { AuthProvider } from '@/context/AuthContext';
import { ApiProvider } from '@/context/ApiContext';

export default function RootLayout() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <ApiProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="add_friend" options={{ 
              title: "Add Contacts",
              headerBackButtonDisplayMode: "generic",
              headerLeft: () => <GoBackButton></GoBackButton>
            }} />
          </Stack>
        </ApiProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}
