import { useApi } from "@/context/ApiContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";

export default function AuthScreen() {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation Errors
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Context
  const { login } = useAuth();
  const { userLogin, userSignup } = useApi();

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [isSignup])

  const handleSubmit = async () => {
    let valid = true;

    if (isSignup && !username.trim()) {
      setUsernameError("Username is required");
      valid = false;
    } else {
      setUsernameError("");
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (isSignup && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!valid) return;

    try {
      console.log(isSignup ? "Signing up..." : "Logging in...");

      let response;
      if (isSignup) {
        response = await userSignup({ username, email, password });
        console.log(response);
        if ("error" in response) {
          setEmailError(response.error || "An error occurred during signup.");
        } else {
          alert("Signup successful! Please log in.");
          setIsSignup(false);
        }
      } else {
        response = await userLogin({ email, password });
        if ("error" in response) {
          setPasswordError(response.error || "Invalid credentials.");
        } else {
          await login(response.id, response.username, response.access_token, response.refresh_token);
        }
      }
    } catch (error) {
      console.error("Error occurred during authentication:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignup ? "Create an Account" : "Welcome to Silly Chat!"}</Text>

      {isSignup && (
        <>
          <TextInput
            label="Username"
            mode="outlined"
            value={username}
            onChangeText={setUsername}
            error={!!usernameError}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            style={styles.input}
          />
          {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
        </>
      )}

      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        error={!!emailError}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        keyboardType="email-address"
        style={styles.input}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        secureTextEntry={!showPassword}
        onChangeText={setPassword}
        right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
        error={!!passwordError}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        style={styles.input}
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      {isSignup && (
        <>
          <TextInput
            label="Confirm Password"
            mode="outlined"
            value={confirmPassword}
            secureTextEntry={!showConfirmPassword}
            onChangeText={setConfirmPassword}
            right={<TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
            error={!!confirmPasswordError}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            style={styles.input}
          />
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
        </>
      )}

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        {isSignup ? "Sign Up" : "Login"}
      </Button>

      <View style={styles.switchRow}>
        <Text>{isSignup ? "Already have an account?" : "No account yet?"}</Text>
        <Button
          mode="text"
          onPress={() => setIsSignup(!isSignup)}
          contentStyle={{ paddingHorizontal: 0 }}
          labelStyle={{ textDecorationLine: "underline", minWidth: 0 }}
          rippleColor="transparent"
        >
          {isSignup ? "Login" : "Signup"}
        </Button>
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  input: {
    marginBottom: 20,
    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  switchRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  }
});
