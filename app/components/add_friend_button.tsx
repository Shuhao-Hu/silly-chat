import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/types';


export default function AddFriendButton() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={{paddingRight: 18}}>
      <TouchableOpacity onPress={() => navigation.navigate("add_friend")}>
        <AntDesign name="adduser" size={18} color="black" />
      </TouchableOpacity>
    </View>
  );
}