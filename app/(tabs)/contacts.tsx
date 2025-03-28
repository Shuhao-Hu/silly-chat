import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import ContactsList from "../components/contact_list";
import { RootStackParamList } from "@/types/types"
import { useStateContext } from "@/context/StateContext";
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

export default function Contacts() {
  const { isLoggedIn } = useAuth();

  const { contacts, setContacts, refreshFriendRequests } = useStateContext();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!isLoggedIn) return;
    console.log(contacts);
    refreshFriendRequests();
  }, [isLoggedIn]);

  if (contacts === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading contacts...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Text>Not Logged in</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("friend_requests")}>
        <View style={styles.friendRequestContainer}>
          <Text style={styles.friendRequestText}>Friend Requests</Text>
          <Entypo style={styles.chevronIcon} name="chevron-thin-right" size={20} color="black" />
        </View>
      </TouchableOpacity>
      {contacts.length > 0 ? (
        <ContactsList contacts={contacts}></ContactsList>
      ) : (
        <Text>No friends available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  friendRequestContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "#094067",
  },
  friendRequestText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  chevronIcon: {
    marginLeft: 10,
  },
});
