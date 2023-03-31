/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from "react";
import { AppState, Linking, Platform } from "react-native";


import { HCESession, NFCTagType4NDEFContentType, NFCTagType4 } from "react-native-hce";
import Signup from "./Pages/Signup";
import { getPathFromState, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmailConfirmation from "./Pages/EmailConfirmation";
import AsyncStorage from '@react-native-async-storage/async-storage';


function App(props: any): JSX.Element {
  let session;

  const Stack = createNativeStackNavigator();


  const startSession = async () => {
    if (Platform.OS != "android") return;
    const tag = new NFCTagType4({
      type: NFCTagType4NDEFContentType.URL,
      content: "https://emil.triest.de/contact?private=true",
      writable: false
    });

    session = await HCESession.getInstance();
    session.setApplication(tag);
    await session.setEnabled(true);
  };


  startSession()
    .then(res => console.log("test: " +res))
    .catch(err => console.error(err));


  // TODO: check if user logged in and if user email confirmed
  const storeData = async (value: string) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@storage_Key', jsonValue)
    } catch (e) {
      // saving error
    }
  }
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      if(value !== null) {
        // value previously stored
      }
    } catch(e) {
      // error reading value
    }
  }


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen
          name="Signup"
          component={Signup}
        />
        <Stack.Screen name="Emailconfirmation" component={EmailConfirmation} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

export default App;
