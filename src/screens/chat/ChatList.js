import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatList() {
  return (
    <View style={styles.container}>
      <Text>Chat List Ekranı</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});