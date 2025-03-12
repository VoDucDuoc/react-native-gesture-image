# @duocvo/react-native-gesture-image

This library provides a highly customizable and performant image viewer component for React Native applications. It supports advanced gestures such as pinch-to-zoom, panning, and double-tap to zoom in and out, making it ideal for creating rich, interactive image viewing experiences. Built with **[react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/)** for handling advanced touch gestures like pinch and pan, and **[react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)** for providing smooth animations for zooming and panning.

IOS|ANDROID
--|--
<video src="https://github.com/user-attachments/assets/6cdb7f6e-a059-4ed1-ac75-3f0a74c75052">|<video src="https://github.com/user-attachments/assets/9fe9313f-2ed2-4aef-8c4d-408a812a6a9f">

## Prerequisites

This library relies on the following dependencies to enable gesture and animation support (you need to setup these library below)
- **[react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/)**: Handles advanced touch gestures like pinch and pan.
- **[react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)**: Provides smooth animations for zooming and panning.

## Installation
```sh
npm install @duocvo/react-native-gesture-image
#or
yarn add @duocvo/react-native-gesture-image
```

## Usage

```js
import Gallery from '@duocvo/react-native-gesture-image';

// Example usage of Gallery
export default function App() {
  const images = [
    { uri: 'https://picsum.photos/200/300' },
    { uri: 'https://picsum.photos/200/300' },
    { uri: 'https://picsum.photos/200/300' },
  ]
  return (
    <View style={styles.container}>
      <Gallery data={images} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

## Props

### Gallery

| Prop                  | Type     | Default | Description                                      | Required |
|-----------------------|----------|---------|--------------------------------------------------|----------|
| `data`                | `array`  | `[]`    | Array of image sources                           | Yes      |
| `style`               | `object` |         | Custom style for the gallery container           | No       |
| `imageStyle`          | `object` |         | Custom style for each image                      | No       |
| `containerStyle`      | `object` |         | Custom style for the gallery container           | No       |
| `contentContainerStyle` | `object` |       | Custom style for the content container           | No       |
| `backdropColor`       | `string` | `black` | Background color of the gallery                  | No       |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
