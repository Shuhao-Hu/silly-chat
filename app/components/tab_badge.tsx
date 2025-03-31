import { useStateContext } from '@/context/StateContext';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Badge } from 'react-native-paper';

const TabBadge = () => {
  const { friendRequests } = useStateContext();

  return (
    <>
      {
        friendRequests.length !== 0 ? 
          <Badge style={styles.bubble} size={15}>
            {friendRequests.length > 99 ? "99+" : friendRequests.length}
          </Badge> : 
          null
      }
    </>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
});

export default TabBadge;
