# @duocvo/react-native-gesture-image

This library provides a highly customizable and performant image viewer component for React Native applications. It supports advanced gestures such as pinch-to-zoom, panning, and double-tap to zoom in and out, making it ideal for creating rich, interactive image viewing experiences. Built with **[react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/)** for handling advanced touch gestures like pinch and pan, and **[react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)** for providing smooth animations for zooming and panning.

IOS|ANDROID
--|--
<video src="https://github.com/user-attachments/assets/6cdb7f6e-a059-4ed1-ac75-3f0a74c75052">|<video src="https://github.com/user-attachments/assets/9fe9313f-2ed2-4aef-8c4d-408a812a6a9f">

## Prerequisites

This library relies on the following dependencies to enable gesture and animation support:
- **[react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/)**: Handles advanced touch gestures like pinch and pan.
- **[react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)**: Provides smooth animations for zooming and panning.

Install these prerequisites along with the library:

```sh
npm install react-native-gesture-handler react-native-reanimated
# or
yarn add react-native-gesture-handler react-native-reanimated
```

## Installation
```sh
npm install @duocvo/react-native-gesture-image
#or
yarn add @duocvo/react-native-gesture-image
```

## Usage

First, wrap your app with `GestureHandlerRootView` component:

```js
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView>
      <ActualApp />
    </GestureHandlerRootView>
  );
}
```

Then, use the components provided by the library:

```js
import Gallery from '@duocvo/react-native-gesture-image';

// Example usage of Gallery
const images = [
  { uri: 'https://example.com/image1.jpg' },
  { uri: 'https://example.com/image2.jpg' },
  { uri: 'https://example.com/image3.jpg' },
];

<Gallery data={images} />
```
**Note:** Gallery is built on top of FlatList for rendering multiple images efficiently. If you don’t want to use FlatList and prefer a single image viewer, use ImageViewer instead. See the example below:
```js
import { ImageViewer } from '@duocvo/react-native-gesture-image';

// Example usage of ImageViewer
const imageSource = { uri: 'https://example.com/image.jpg' };

<ImageViewer source={imageSource} />
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


### ImageViewer

| Prop              | Type     | Default | Description                                      | Required |
|-------------------|----------|---------|--------------------------------------------------|----------|
| `source`          | `object` |         | Source for the image                             | Yes      |
| `imageStyle`      | `object` |         | Custom style for the image                       | No       |


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
