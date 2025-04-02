import React, { useState, useRef, useEffect } from "react";
import { View, Text, SectionList, TouchableOpacity, StyleSheet } from "react-native";
import { ActiveConversation, Contact } from "@/types/types";
import { useRouter } from "expo-router";
import { useStateContext } from "@/context/StateContext";
import { useSQLiteContext } from "expo-sqlite";
import { useAuth } from "@/context/AuthContext";
import { insertConversation } from "@/db/sqlite";

interface ContactsListProps {
  contacts: Contact[];
}

export default function ContactsList({ contacts }: ContactsListProps) {
  const sectionListRef = useRef<SectionList>(null);
  const [sections, setSections] = useState(createSections(contacts));
  const { activeConversations, setActiveConversations } = useStateContext();
  const { getUser } = useAuth();
  const db = useSQLiteContext();
  const router = useRouter()

  useEffect(() => {
    setSections(createSections(contacts));
  }, [contacts]);

  function createSections(contacts: Contact[]) {
    const groupedContacts: { [key: string]: Contact[] } = {};

    contacts.forEach((contact) => {
      const firstLetter = contact.username[0].toUpperCase();
      if (!groupedContacts[firstLetter]) {
        groupedContacts[firstLetter] = [];
      }
      groupedContacts[firstLetter].push(contact);
    });

    return Object.keys(groupedContacts)
      .sort()
      .map((letter) => ({
        title: letter,
        data: groupedContacts[letter].sort((a, b) => a.username.localeCompare(b.username)),
      }));
  }

  const scrollToSection = (letter: string) => {
    const sectionIndex = sections.findIndex((section) => section.title === letter);
    if (sectionIndex !== -1) {
      sectionListRef.current?.scrollToLocation({ sectionIndex, itemIndex: 0, animated: true });
    }
  };

  const appendToActiveConversations = async (chattingID: number) => {
    const { id } = await getUser();
    if (id === null) {
      return;
    }

    // Check if the conversation already exists
    const exists = activeConversations?.some(
      (conv) => conv.user_id === id && conv.chatting_user_id === chattingID
    );

    if (exists) {
      return; // Do nothing if the conversation already exists
    }

    await insertConversation(db, id, chattingID);
    setActiveConversations(prevActiveConversations => [
      ...(prevActiveConversations ?? []),
      {
        user_id: id,
        chatting_user_id: chattingID,
        last_updated: new Date(),
      }
    ]);
  };


  return (
    <View style={styles.container}>
      <SectionList
        ref={sectionListRef}
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.contactItem}
              onPress={
                () => {
                  appendToActiveConversations(item.id).catch(console.error);
                  router.push(`/${item.id}?username=${item.username}`);
                }
              }
            >
              <Text>{item.username}</Text>
            </TouchableOpacity>
          );
        }}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
      />

      <View style={styles.quickNav}>
        {sections.map(({ title }) => (
          <TouchableOpacity key={title} onPress={() => scrollToSection(title)}>
            <Text style={styles.quickNavText}>{title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  sectionHeader: {
    backgroundColor: "#f4f4f4",
    padding: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quickNav: {
    position: "absolute",
    right: 10,
    top: 20,
    alignItems: "center",
  },
  quickNavText: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 2,
    color: "#007AFF",
  },
});
