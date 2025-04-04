import { useApi } from "@/context/ApiContext";
import { useAuth } from "@/context/AuthContext";
import { useStateContext } from "@/context/StateContext";
import { getChatHistory, insertMessage } from "@/db/sqlite";
import { Message } from "@/types/types";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, FlatList, Text, Alert } from "react-native";
import { IconButton } from "react-native-paper";

export default function Chat() {
  const [message, setMessage] = useState("");
  const { currentChatUserId, messages, setMessages } = useStateContext();
  const route = useRoute();
  const { chat, username } = route.params as { chat: string, username: string };
  const navigation = useNavigation();
  const db = useSQLiteContext();
  const { userId, logout } = useAuth();
  const { sendMessage } = useApi();

  useEffect(() => {
    if (userId === null) {
      logout();
      return;
    }
    currentChatUserId.current = (Number(chat));
    navigation.setOptions({
      title: username,
    });
    setMessages([]);
    getChatHistory(db, Number(chat), userId).then((m) => {
      setMessages(m);
    });
    return () => {
      currentChatUserId.current = -1;
    };
  }, []);

  useEffect(() => {
    console.log("currentChatUserId updated:", currentChatUserId);
  }, [currentChatUserId]);

  const send = () => {
    if (userId === null) {
      logout();
      return;
    }

    if (message.trim()) {
      sendMessage(Number(chat), message).then(() => {
        const newMessage: Message = {
          id: 0,
          sender_id: userId,
          recipient_id: Number(chat),
          timestamp: new Date().toISOString(),
          content: message,
          read: true,  
        };
        insertMessage(db, userId, Number(chat), message, newMessage.timestamp, true);
        setMessages(prevMessages => [newMessage, ...prevMessages]);
        setMessage("");
      }).catch(() => {
        Alert.alert("Something went wrong, failed to send message");
      });
    }
  };


  const renderItem = ({ item }: { item: Message }) => {
    const isSentByUser = item.sender_id === userId;
  
    return (
      <View style={[styles.messageContainer, isSentByUser ? styles.sentMessage : styles.receivedMessage]}>
        <Text style={isSentByUser ? styles.messageContent : styles.receivedText}>{item.content}</Text>
      </View>
    );
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.timestamp}
        inverted // Inverts the list so the latest message is at the bottom
        contentContainerStyle={styles.messagesList}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <IconButton icon="send" size={24} onPress={send} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f0f0f0",
  },
  messagesList: {
    paddingBottom: 80,
  },
  messageContainer: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 5,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    borderTopRightRadius: 0,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
    borderTopLeftRadius: 0,
  },
  messageContent: {
    fontSize: 16,
    color: "#fff",
  },
  receivedText: {
    color: "#000",
    fontSize: 16,
  },
});
