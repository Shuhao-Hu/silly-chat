import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

export default function ConversationItem({ user_id, username }: { user_id: number, username: string }) {
  return (
    <View>
      {/* <TouchableOpacity style={styles.chatItem}>
        <Text style={styles.chatUsername}>{username}</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  chatUsername: {
    fontSize: 16,
    fontWeight: "bold",
  },
});