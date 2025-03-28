import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useStateContext } from "@/context/StateContext";
import { act, useMemo } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Contact } from "@/types/types";
import ConversationItem from "../components/conversation_item";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const { activeConversations, contacts } = useStateContext();

  const conversationList = useMemo(() => {
    if (activeConversations === null || contacts === null) {
      return null;
    }
    return activeConversations.map(({ user_id }) => {
      const contact = contacts.find((c) => c.id === user_id);
      return contact;
    }).filter(Boolean) as Contact[];
  }, [activeConversations, contacts]);

  if (!isLoggedIn) {
    return (
      <View style={styles.unLoggedinMsg}>
        <Text>Please log in first to chat.</Text>
      </View>
    );
  }

  if (activeConversations === null || contacts === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (activeConversations.length === 0) {
    return (
      <View style={styles.textContainer}>
        <Text style={styles.text}>You do not have any active chat.</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={conversationList}
        renderItem={({ item }) => <ConversationItem user_id={item.id} username={item.username}></ConversationItem>}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  unLoggedinMsg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
