import { useApi } from "@/context/ApiContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import FriendRequestItem from "../components/friend_request";
import ContactsList from "../components/contact_list";
import { Contact, FriendRequest } from "@/types/types"

export default function Contacts() {
  const { isLoggedIn } = useAuth();
  const { fetchContacts, fetchFriendRequests, respondFriendRequest } = useApi();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [requestLoading, setRequestLoading] = useState(false);

  const onAccept = async (requestID: number, senderID: number) => {
    await respondFriendRequest(requestID, senderID, "accepted");
    const request = friendRequests.find((req) => req.friend_request_id === requestID);
    if (!request) return;
    setFriendRequests(prevRequests => prevRequests.filter(req => req.friend_request_id !== requestID));
    setContacts(prevContacts => [...prevContacts, { id: request.sender_id, username: request.sender_username, email: request.sender_email }]);
  };

  const onReject = async (requestID: number, senderID: number) => {
    await respondFriendRequest(requestID, senderID, "rejected");
    setFriendRequests(friendRequests.filter((request) => request.friend_request_id !== requestID));
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchData = async () => {
      try {
        setContactsLoading(true);
        const fetchedContacts = await fetchContacts();
        setContacts(fetchedContacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setContactsLoading(false);
      }
    };
    fetchData();
  }, [fetchContacts]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchRequests = async () => {
      try {
        setRequestLoading(true);
        const fetchedRequests = await fetchFriendRequests();
        setFriendRequests(fetchedRequests);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      } finally {
        setRequestLoading(false);
      }
    };
    fetchRequests();
  }, [fetchFriendRequests]);

  if (contactsLoading || requestLoading) {
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
      {friendRequests.length > 0 && (
        <View>
          {friendRequests.map((request) => (
            <FriendRequestItem
              key={request.friend_request_id}
              request={request}
              onAccept={onAccept}
              onReject={onReject}
            />
          ))}
        </View>
      )}

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
});
