import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useStateContext } from "@/context/StateContext";
import { useMemo } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Contact } from "@/types/types";
import { Card, Avatar } from "react-native-paper"; // Import the necessary components
import { getInitials } from "@/utils/helper";

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
    );
  }

  if (activeConversations.length === 0) {
    return (
      <View style={styles.textContainer}>
        <Text style={styles.text}>You do not have any active chat.</Text>
      </View>
    );
  }

  // Function to render each conversation item
  const renderConversation = ({ item }: { item: Contact }) => (
    <Card mode="outlined" style={styles.card}>
      <Card.Title
        title={item.username}
        subtitle={item.email}
        left={(props) => <Avatar.Text {...props} label={getInitials(item.username)} />}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={conversationList}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
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
  card: {
    marginBottom: 10,
  },
});
