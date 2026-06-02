import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Discover() {
  return (
    <View style={styles.container}>
      <Text>Discover Ekranı</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});