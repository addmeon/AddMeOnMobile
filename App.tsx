/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import { Platform } from "react-native";


import { HCESession, NFCTagType4NDEFContentType, NFCTagType4 } from "react-native-hce";
import Signup from "./Pages/Signup";
import { NavigationContainer } from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EmailConfirmation from "./Pages/EmailConfirmation";


function App(): JSX.Element {
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
    .then(res => console.log(res))
    .catch(err => console.error(err));

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
