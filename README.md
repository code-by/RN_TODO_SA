This is simple TODO app build with [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start
```

## Step 2: Build and run app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, need to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time un the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.


# Techical information
## 1. Description of the Code and Technologies Used

This project is a mobile ToDo application designed to help users manage their tasks efficiently. Users can add, view, update the status of (e.g., in progress, completed, canceled), and delete tasks. Tasks can also be sorted by creation date or status.

The application is built using the following core technologies:

*   **React Native:** A JavaScript framework for building native mobile applications for iOS and Android from a single codebase.
*   **TypeScript:** A superset of JavaScript that adds static typing, improving code quality and maintainability.
*   **React Hooks:** Used for state management and side effects within functional components (e.g., `useState`, `useEffect`, `useCallback`, `useMemo`).
*   **AsyncStorage:** For persisting task data locally on the user's device.
*   **React Native Swipe List View:** To implement swipeable list items for quick actions like marking tasks as complete or deleting them.
*   **React Native Vector Icons (MaterialIcons):** For iconography throughout the application.
*   **React Native Date Picker:** To provide a native date and time selection interface.
*   **Core React Native Components:** For building the user interface (View, Text, TouchableOpacity, Modal, FlatList, etc.).

## 2. Explanation of Technology Stack and Reasoning Behind Choices

*   **React Native:** Chosen for its ability to develop cross-platform (iOS and Android) applications from a single JavaScript/TypeScript codebase, significantly reducing development time and effort compared to writing separate native apps. Its large community and rich ecosystem of libraries are also major advantages.
*   **AsyncStorage:** A simple and effective solution for client-side storage in React Native, suitable for storing user-generated content like ToDo tasks without requiring a backend server for this particular application's scope.
*   **React Native Swipe List View, Vector Icons, Date Picker:** These libraries were chosen to provide a good user experience with common mobile patterns (swipe actions, clear iconography, native date selection) without needing to build these complex components from scratch.



# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.


