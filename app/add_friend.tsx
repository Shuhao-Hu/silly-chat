import { useApi } from "@/context/ApiContext";
import { Contact } from "@/types/types";
import { useState } from "react";
import { View, Text, TextInput, Keyboard, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function AddFriend() {
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearchEmailFocus, setIsSearchEmailFocus] = useState(false);
  const { searchContactByEmail, sendFriendRequest } = useApi();
  const [contact, setContact] = useState<Contact | null>(null);
  const [notFound, setNotFound] = useState<boolean | null>(null);
  

  const searchForEmail = async () => {
    Keyboard.dismiss();
    const contact = await searchContactByEmail(searchEmail);
    if (contact === null) {
      setNotFound(true);
    } else {
      setNotFound(false);
      setContact(contact);
    }
  }

  const send = async () => {
    if (!contact) return;
    const result = await sendFriendRequest(contact.id);
    if (result) {
      Alert.alert("Friend Request", "sent successfully");
      setContact(null);
      setNotFound(null);
      setSearchEmail("");
    } else {
      Alert.alert("Friend Request", "failed, please try again later");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search by email"
          value={searchEmail}
          onChangeText={setSearchEmail}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => { setIsSearchEmailFocus(true) }}
          onBlur={() => { setIsSearchEmailFocus(false) }}
          returnKeyType="search"
          onSubmitEditing={searchForEmail}
          style={styles.searchInput}
        />
      </View>
      <View>
        {notFound === true ? (
          <View style={styles.notFoundContainer}>
            <Text style={styles.notFoundText}>No User Found</Text>
          </View>
        ) : contact !== null ? (
          <View style={styles.foundContainer}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>{contact.username}</Text>
              <Text style={styles.contactEmail}>{contact.email}</Text>
            </View>
            <TouchableOpacity 
              style={styles.requestButton}
              onPress={send}
            >
              <Text style={styles.requestButtonText}>Send friend request</Text>
            </TouchableOpacity>
          </View>
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
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
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
  foundContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 20,  // Increased padding for a more spacious look
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
    alignSelf: "center",
  },
  contactInfo: {
    marginBottom: 15,
  },
  contactText: {
    fontSize: 24, 
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  contactEmail: {
    fontSize: 14,
    color: "rgba(0,0,0,0.6)", // More opaque email color
  },
  requestButton: {
    alignSelf: "flex-end",
    backgroundColor: "#3da9fc",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  requestButtonText: {
    color: "#fffffe",
    fontWeight: "bold",
    fontSize: 14,
  },
});
