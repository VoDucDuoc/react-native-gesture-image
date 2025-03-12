import { StyleSheet, View } from 'react-native';
import React from 'react';
import Gallery from '@duocvo/react-native-gesture-image';

const image1 = require('../assets/image1.jpeg');
const image2 = require('../assets/image2.jpeg');
const image3 = require('../assets/image3.jpeg');

export default function App() {
  return (
    <View style={styles.container}>
      <Gallery data={[image1, image2, image3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
