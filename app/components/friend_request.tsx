import { View, Text, StyleSheet } from "react-native";
import { FriendRequest } from "@/types/types";
import Check from "./check";
import Close from "./close";


interface FriendRequestItemProps {
  request: FriendRequest;
  onAccept: (id: number, senderID: number) => void;
  onReject: (id: number, senderID: number) => void;
}

export default function FriendRequestItem({ request, onAccept, onReject }: FriendRequestItemProps) {
  return (
    <View style={styles.requestItem}>
      <Text style={styles.username}>{request.sender_username}</Text>
      <Check style={styles.button} onPressHandler={() => onAccept(request.friend_request_id, request.sender_id)} />
      <Close style={styles.button} onPressHandler={() => onReject(request.friend_request_id, request.sender_id)} />
    </View>
  );
}

const styles = StyleSheet.create({
  requestItem: {
    padding: 10,
    marginVertical: 5,
    borderBottomWidth: 1.5,
    borderBottomColor: "#094067",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  username: {
    flex: 5,
  },
  button: {
    flex: 1,
    alignItems: "flex-end",
  },
});
