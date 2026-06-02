import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CommunityList() {
  return (
    <View style={styles.container}>
      <Text>Community List Ekranı</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});