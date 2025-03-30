import { useState } from "react";
import { Text, TextInput, View, StyleSheet, Dimensions, Alert, TouchableOpacity } from "react-native";
import { useApi } from "@/context/ApiContext";
import { useAuth } from "@/context/AuthContext";
import Login from "@/app/pages/login";


export default function Index() {
  return (<Login></Login>);
}