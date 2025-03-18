import { useStateContext } from "@/context/StateContext";
import { Contact } from "@/types/types";
import { View, Text, StyleSheet } from "react-native";
import FriendRequestItem from "./components/friend_request";
import { useApi } from "@/context/ApiContext";

interface FriendRequetsPageProps {
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}

export default function FriendRequetsPage({setContacts }: FriendRequetsPageProps) {
  const { friendRequests, setFriendRequests } = useStateContext();
  const { respondFriendRequest } = useApi();

  const onAccept = async (requestID: number, senderID: number) => {
    await respondFriendRequest(requestID, senderID, "accepted");
    const request = friendRequests.find((req) => req.friend_request_id === requestID);
    if (!request) return;
    setFriendRequests(prevRequests => prevRequests.filter(req => req.friend_request_id !== requestID));
    setContacts(prevContacts => [...prevContacts, { id: request.sender_id, username: request.sender_username, email: request.sender_email }]);
  };

  const onReject = async (requestID: number, senderID: number) => {
    await respondFriendRequest(requestID, senderID, "rejected");
    setFriendRequests(prevRequests => prevRequests.filter(req => req.friend_request_id !== requestID));
  };
  return (
    <>
      {
        friendRequests.length > 0 ? (
          <View style={styles.container}>
            {friendRequests.map((request) => (
              <FriendRequestItem
                key={request.friend_request_id}
                request={request}
                onAccept={onAccept}
                onReject={onReject}
              />
            ))}
          </View>
        ) : (
          <View style={styles.textContainer}>
            <Text style={styles.text}>You don't have any friend reqeust.</Text>
          </View>
        )
      }
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  textContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#094067",
  }, 
});