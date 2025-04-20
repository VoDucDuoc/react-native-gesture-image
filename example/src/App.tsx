import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef } from 'react';
import Gallery, { GalleryRef } from '@duocvo/react-native-gesture-image';

const image1 = require('../assets/image1.jpeg');
const image2 = require('../assets/image2.jpeg');
const image3 = require('../assets/image3.jpeg');

export default function App() {
  const galleryRef = useRef<GalleryRef>(null);
  const data = [image1, image2, image3];

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => galleryRef.current?.show(index)}>
            <View>
              <Image source={item} style={{ width: 300, height: 300 }} />
            </View>
          </TouchableOpacity>
        )}
        horizontal
        style={{ flex: 1 }}
        ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
        contentContainerStyle={styles.flatList}
      />

      <Gallery
        ref={galleryRef}
        data={data}
        renderHeader={() => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              marginTop: 70,
            }}
          >
            <TouchableOpacity onPress={() => galleryRef.current?.hide()}>
              <Text style={{ color: 'white' }}>close button</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={{ color: 'white' }}>setting button</Text>
            </TouchableOpacity>
          </View>
        )}
        renderFooter={() => (
          <View style={{ marginBottom: 70, paddingHorizontal: 16 }}>
            <Text style={{ color: 'white' }}>image caption</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
