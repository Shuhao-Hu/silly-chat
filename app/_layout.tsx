import { Stack } from 'expo-router';
import GoBackButton from './components/go_back_button';
import { ConfigProvider } from '@/context/ConfigContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ApiProvider } from '@/context/ApiContext';
import Login from './auth';

export default function RootLayout() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <ApiProvider>
          <ProtectedRoutes />
        </ApiProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

function ProtectedRoutes() {
  const { isLoggedIn } = useAuth(); // Now this works inside AuthProvider

  if (!isLoggedIn) {
    return <Login />; // 🚀 Redirect to login page if user is not authenticated
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add_friend" options={{
        title: "Add Contacts",
        headerLeft: () => <GoBackButton />,
        headerTitleAlign: "center",
      }} />
    </Stack>
  );
}
