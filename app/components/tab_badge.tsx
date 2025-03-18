import { useStateContext } from '@/context/StateContext';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TabBadge = () => {
  const { friendRequests } = useStateContext();

  return (
    <>
      {
        friendRequests.length !== 0 ? 
        <View style={styles.bubble}>
          <Text style={styles.text}>{friendRequests.length}</Text>
        </View> : null
      }
    </>
  );
}

const styles = StyleSheet.create({
  bubble: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    position: 'absolute',
    top: -6,
    right: -6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
});

export default TabBadge;
