import { Text, View, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <View style={styles.unLoggedinMsg}>
        <Text>Please log in first to chat.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Home Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  unLoggedinMsg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
