import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Card, Text, Button, TextInput } from "react-native-paper";
import { useAuth } from "@/context/AuthContext"; // Replace with your actual auth context

export default function UserAccountScreen() {
  const { getUser, logout } = useAuth(); // Fetch user & actions from context
  const [user, setUser] = useState<{ id: number | null; username: string | null }>({ id: null, username: null });
  const [newUsername, setNewUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser(); // Fetch user data
      if (userData) {
        setUser(userData);
        setNewUsername(userData.username!);
      }
    };

    fetchUser();
  }, []);

  const handleSave = () => {
    // Assume updateUsername is implemented in the auth context
    setUser((prev) => ({ ...prev, username: newUsername }));
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {/* User Info Card */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Avatar.Text size={60} label={user.username?.charAt(0).toUpperCase() || "U"} />
          <View style={styles.textContainer}>
            {isEditing ? (
              <TextInput
                mode="outlined"
                value={newUsername}
                onChangeText={setNewUsername}
                autoCapitalize="none"
                style={styles.input}
              />
            ) : (
              <Text variant="titleLarge">{user.username || "Loading..."}</Text>
            )}
            <Text variant="bodyMedium">{user.id ? `User ID: ${user.id}` : "Loading..."}</Text>
          </View>
        </Card.Content>
        {/* Edit / Save Button */}
        <Card.Actions>
          {isEditing ? (
            <Button onPress={handleSave}>Save</Button>
          ) : (
            <Button onPress={() => setIsEditing(true)}>Edit</Button>
          )}
        </Card.Actions>
      </Card>

      {/* Logout Button */}
      <Button mode="contained" style={styles.logoutButton} onPress={logout}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 15,
  },
  input: {
    width: 200,
    backgroundColor: "white",
  },
  logoutButton: {
    marginTop: 20,
  },
});
