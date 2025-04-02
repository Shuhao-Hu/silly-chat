import { Stack } from 'expo-router';
import GoBackButton from './components/go_back_button';
import { ConfigProvider } from '@/context/ConfigContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ApiProvider } from '@/context/ApiContext';
import Login from './auth';
import { StateProvider } from '@/context/StateContext';
import { SQLiteProvider } from 'expo-sqlite';
import { createDbIfNeeded } from '@/db/sqlite';
import { WebsocketProvider } from '@/context/WebsocketContext';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <AuthWrapper/>
      </AuthProvider>
    </ConfigProvider>
  );
}

function AuthWrapper() {
  const { userId } = useAuth(); 

  return (
    <SQLiteProvider databaseName={`silly-chat-${userId}.db`} onInit={createDbIfNeeded}>
      <ApiProvider>
        <StateProvider>
          <WebsocketProvider>
            <PaperProvider>
              <GestureHandlerRootView>
                <ProtectedRoutes />
              </GestureHandlerRootView>
            </PaperProvider>
          </WebsocketProvider>
        </StateProvider>
      </ApiProvider>
    </SQLiteProvider>
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
      <Stack.Screen name="friend_requests" options={{
        title: "Friend Requests",
        headerLeft: () => <GoBackButton />,
        headerTitleAlign: "center",
      }} />
      <Stack.Screen name="[chat]" options={{
        title: "Loading...",
        headerLeft: () => <GoBackButton />,
        headerTitleAlign: "center",
      }} />
    </Stack>
  );
}
