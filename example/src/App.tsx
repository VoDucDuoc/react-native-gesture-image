import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Gallery, { type GalleryRef } from '../../src';

export default function App() {
  const galleryRef = useRef<GalleryRef>(null);

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { uri: 'https://picsum.photos/200/300' },
        { uri: 'https://picsum.photos/200/300' },
        { uri: 'https://picsum.photos/200/300' },
      ]);
    }, 1000);
  }, []);

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
