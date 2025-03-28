import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { View, Text } from 'react-native';

export default function Chat() {
  const { chat } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: chat,
    });
  }, []);

  return (
    <View>
      <Text>This is chat {chat}</Text>
    </View>
  );
}