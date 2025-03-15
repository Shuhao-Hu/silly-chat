import React, { useState, useRef, useEffect } from "react";
import { View, Text, SectionList, TouchableOpacity, StyleSheet } from "react-native";
import { Contact } from "@/types/types";

interface ContactsListProps {
  contacts: Contact[];
}

export default function ContactsList({ contacts }: ContactsListProps) {
  const sectionListRef = useRef<SectionList>(null);
  const [sections, setSections] = useState(createSections(contacts));

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

  return (
    <View style={styles.container}>
      <SectionList
        ref={sectionListRef}
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <View style={styles.contactItem}>
              <Text>{item.username}</Text>
            </View>
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
