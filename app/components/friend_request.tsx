import { View, Text, StyleSheet } from "react-native";
import { FriendRequest } from "@/types/types";
import Check from "./check";
import Close from "./close";


interface FriendRequestItemProps {
  request: FriendRequest;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}

export default function FriendRequestItem({ request, onAccept, onReject }: FriendRequestItemProps) {
  return (
    <View style={styles.requestItem}>
      <Text style={styles.username}>{request.sender_username}</Text>
      <Check style={styles.button} onPressHandler={() => onAccept(request.friend_request_id)} />
      <Close style={styles.button} onPressHandler={() => onReject(request.friend_request_id)} />
    </View>
  );
}

const styles = StyleSheet.create({
  requestItem: {
    padding: 10,
    marginVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#094067",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  username: {
    flex: 4,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
});
