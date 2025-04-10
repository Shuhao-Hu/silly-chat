import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useAuth} from "@/context/AuthContext";
import {useStateContext} from "@/context/StateContext";
import {useMemo} from "react";
import {FlatList} from "react-native-gesture-handler";
import {Contact} from "@/types/types";
import {Avatar, Badge, Card, Divider} from "react-native-paper";
import {getInitials} from "@/utils/helper";
import {useRouter} from "expo-router";
import { markMessagesRead, selectAllMessages } from "@/db/sqlite";
import { useSQLiteContext } from "expo-sqlite";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const { activeConversations, setActiveConversations, contacts } = useStateContext();
  const router = useRouter();
  const db = useSQLiteContext();
  
  const conversationList = useMemo(() => {
    if (activeConversations === null || contacts === null) {
      return null;
    }
    
    return activeConversations.map((conversation) => {
      const contact = contacts.find((c) => c.id === conversation.chatting_user_id);
      if (!contact) return null;
      
      return {
        ...contact,
        last_unread_message: conversation.last_unread_message,
        unread_count: conversation.unread_count
      };
    }).filter(Boolean) as (Contact & { 
      last_unread_message: string | null;
      unread_count: number;
    })[];
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
  const renderConversation = ({ item }: { item: Contact & { 
    last_unread_message: string | null;
    unread_count: number;
  }}) => (
    <View style={styles.chat}>
      <Avatar.Text size={50} label={getInitials(item.username)} />
      <TouchableOpacity 
        style={styles.content} 
        onPress={() => {
          selectAllMessages(db).then(console.log);
          markMessagesRead(db, item.id);
          setActiveConversations(prev =>
            prev
              ? prev.map(c =>
                  c.chatting_user_id === item.id
                    ? { ...c, unread_count: 0 }
                    : c
                )
              : [])
          router.push(`/${item.id}?username=${item.username}`);
        }}
      >
        <View style={styles.content}>
          <Card.Title 
            title={item.username} 
            titleVariant="titleLarge"
            subtitle={item.last_unread_message === null ? "" : item.last_unread_message}
            subtitleVariant="labelMedium" 
          />
          {item.unread_count > 0 && (
            <Badge style={styles.badge}>{item.unread_count}</Badge>
          )}
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
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
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
