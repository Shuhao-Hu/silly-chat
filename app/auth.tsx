import { useState } from "react";
import { Text, TextInput, View, StyleSheet, Dimensions, Alert, TouchableOpacity } from "react-native";
import Button from "./components/button";
import { useApi } from "@/context/ApiContext";
import { useAuth } from "@/context/AuthContext";


export default function Index() {
  const { userLogin, userSignup } = useApi();
  const { login } = useAuth();

  const [inLogin, setInLogin] = useState(true);

  // Login Hooks
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPwFocused, setIsPwFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submitLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }

    const response = await userLogin({ email, password });
    if ("error" in response) {
      Alert.alert("Error", response.error);
    } else {
      const { id, username, access_token, refresh_token } = response;
      login(id, username, access_token, refresh_token);
    }
  }

  // Signup Hooks
  const [username, setUsername] = useState("");
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPwFocused, setIsConfirmPwFocused] = useState(false);

  const submitSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Two Passwords do not match");
      return;
    }
    const response = await userSignup({ email, password, username });
    if ("error" in response) {
      Alert.alert("Error", response.error);
    } else {
      Alert.alert("Success", "Account created successfully");
      setUsername("");
      setConfirmPassword("");
      setPassword("");
      setEmail("");
      setInLogin(true);
    }
  }

  // Switch Pages
  const switchPages = () => {
    setInLogin(!inLogin);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsEmailFocused(false);
    setIsPwFocused(false);
    setIsConfirmPwFocused(false);
    setIsUsernameFocused(false);
  }

  const loginHtml = () => {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeRow}>
          <Text style={styles.titleText}>Welcome to Silly Chat</Text>
        </View>
        <View style={styles.formRow}>
          <View style={styles.form}>
            <TextInput style={[styles.inputField, isEmailFocused && styles.inputFocused]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
            />
            <TextInput style={[styles.inputField, isPwFocused && styles.inputFocused]}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setPassword}
              onFocus={() => setIsPwFocused(true)}
              onBlur={() => setIsPwFocused(false)}
            />
            <Button
              buttonText="Log in"
              onPressHandler={submitLogin}
              buttonStyle={styles.loginButton}
            />
          </View>
        </View>

        <View style={styles.signupRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>No account yet? </Text>
            <TouchableOpacity onPress={switchPages}>
              <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const singupHtml = () => {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeRow}>
          <Text style={styles.titleText}>Welcome to Silly Chat</Text>
        </View>
        <View style={styles.formRow}>
          <View style={styles.form}>
            <TextInput style={[styles.inputField, isUsernameFocused && styles.inputFocused]}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setIsUsernameFocused(true)}
              onBlur={() => setIsUsernameFocused(false)}
            />
            <TextInput style={[styles.inputField, isEmailFocused && styles.inputFocused]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
            />
            <TextInput style={[styles.inputField, isPwFocused && styles.inputFocused]}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setIsPwFocused(true)}
              onBlur={() => setIsPwFocused(false)}
            />
            <TextInput style={[styles.inputField, isConfirmPwFocused && styles.inputFocused]}
              placeholder="Confirm Your Password"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setIsConfirmPwFocused(true)}
              onBlur={() => setIsConfirmPwFocused(false)}
            />
            <Button
              buttonText="Sign up"
              onPressHandler={submitSignup}
              buttonStyle={styles.loginButton}
            />
          </View>
        </View>

        <View style={styles.signupRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>Already has an account? </Text>
            <TouchableOpacity onPress={switchPages}>
              <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (inLogin) {
    return loginHtml();
  }
  return singupHtml();
}



const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formRow: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    gap: 24,
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputField: {
    height: 50,
    width: "80%",
    borderWidth: 2,
    borderColor: "rgb(220, 225, 230)",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  welcomeRow: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 30,
  },
  signupRow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputFocused: {
    borderColor: "#3498db",
    backgroundColor: "#eaf7ff",
    color: "#007bff",
  },
  loginButton: {
    width: "80%",
    height: 30,
    backgroundColor: "#3da9fc",
    borderRadius: 15,
  },
});
