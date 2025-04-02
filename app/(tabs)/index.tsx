import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useStateContext } from "@/context/StateContext";
import { useMemo } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Contact } from "@/types/types";
import { Card, Avatar, Divider } from "react-native-paper";
import { getInitials } from "@/utils/helper";
import { useRouter } from "expo-router";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const { activeConversations, contacts } = useStateContext();
  const router = useRouter();

  const conversationList = useMemo(() => {
    if (activeConversations === null || contacts === null) {
      return null;
    }
    return activeConversations.map(({ chatting_user_id }) => {
      const contact = contacts.find((c) => c.id === chatting_user_id);
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
    <View style={styles.chat}>
      <Avatar.Text size={50} label={getInitials(item.username)} />
      <TouchableOpacity style={styles.content} 
        onPress={() => 
          router.push(`/${item.id}?username=${item.username}`)
        }
      >
        <View style={styles.content}>
          <Card.Title 
            title={item.username} 
            titleVariant="titleLarge"
            subtitle={"last message"}
            subtitleVariant="labelMedium" 
          />
          <Divider /> 
        </View>
      </TouchableOpacity>
    </View>
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
  chat: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingLeft: 10,
  },
  content: {
    flex: 1,
  }
});
