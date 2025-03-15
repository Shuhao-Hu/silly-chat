import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useNavigation } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

export default function GoBackButton() {
  const naviagtion = useNavigation();

  return (
    <View>
      <TouchableOpacity onPress={() => naviagtion.goBack()}>
        <SimpleLineIcons name="arrow-left" size={16} color="black" />
      </TouchableOpacity>
    </View>
  );
}