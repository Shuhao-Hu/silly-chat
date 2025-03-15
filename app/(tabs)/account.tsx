import { View, Text } from "react-native";
import { useAuth } from "@/context/AuthContext";
import Login from "../pages/auth";
import Button from "../components/button";
import { useEffect, useState } from "react";

export default function Account() {
  const { isLoggedIn, logout, getUser } = useAuth();

  const [user, setUser] = useState<{
    id: number | null;
    username: string | null;
  } | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    fetchUser();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <View>
        <Text>You are not logged in!</Text>
      </View>
    );
  }

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>Hello {user.username}, { user.id }</Text>
      <Button buttonText="Logout" onPressHandler={logout} />
    </View>
  );
}
