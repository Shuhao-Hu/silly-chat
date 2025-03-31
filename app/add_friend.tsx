import { useApi } from "@/context/ApiContext";
import { useAuth } from "@/context/AuthContext";
import { Contact } from "@/types/types";
import { getInitials } from "@/utils/helper";
import { useEffect, useState } from "react";
import { View, Text, Keyboard, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Avatar, Button, Card, HelperText, Searchbar } from "react-native-paper";

export default function AddFriend() {
  const [searchEmail, setSearchEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const { getEmail, logout } = useAuth();
  const { searchContactByEmail, sendFriendRequest } = useApi();
  const [contact, setContact] = useState<Contact | null>(null);
  const [notFound, setNotFound] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEmail()
      .then((email) => {
        setUserEmail(email);
      })
      .catch(() => logout());
  }, []);

  const searchForEmail = async () => {
    if (!searchEmail.trim()) return;
    if (searchSelf()) return;

    setLoading(true);
    setContact(null);
    setNotFound(null);
    Keyboard.dismiss();

    try {
      const result = await searchContactByEmail(searchEmail);
      if (result) {
        setContact(result);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!contact) return;
    const result = await sendFriendRequest(contact.id);
    if (result) {
      Alert.alert("Friend Request", "Sent successfully");
      setContact(null);
      setNotFound(null);
      setSearchEmail("");
    } else {
      Alert.alert("Friend Request", "Failed, please try again later");
    }
  };

  const searchSelf = () => {
    return searchEmail.toLowerCase() === userEmail.toLowerCase();
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by email"
          onChangeText={setSearchEmail}
          value={searchEmail}
          returnKeyType="search"
          onSubmitEditing={searchForEmail}
          autoCapitalize="none"
          autoCorrect={false}
          inputMode="email"
          style={styles.searchInput}
        />
        <HelperText type="error" visible={searchSelf()}>
          You cannot search for yourself
        </HelperText>
      </View>
      <View>
        {loading ? (
          <ActivityIndicator size="large" color="#3da9fc" style={{ marginTop: 20 }} />
        ) : notFound === true ? (
          <View style={styles.notFoundContainer}>
            <Text style={styles.notFoundText}>No User Found</Text>
          </View>
        ) : contact !== null ? (
          <Card mode="contained">
            <Card.Title
              title={contact.username}
              titleVariant="titleLarge"
              subtitle={contact.email}
              subtitleVariant="titleSmall"
              left={(props) => <Avatar.Text {...props} label={getInitials(contact.username)} />}
            />
            <Card.Actions>
              <Button mode="contained" onPress={send} style={styles.button}>Send friend request</Button>
            </Card.Actions>
          </Card>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    width: "100%",
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#fff",
  },
  notFoundContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#094067",
  },
  button: {
    marginBottom: 5,
    marginRight: 5,
  }
});
