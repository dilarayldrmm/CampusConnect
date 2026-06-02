import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MarketHome() {
  return (
    <View style={styles.container}>
      <Text>Market Home Ekranı</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});