/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, Linking, Platform } from "react-native";


import { HCESession, NFCTagType4NDEFContentType, NFCTagType4 } from "react-native-hce";
import Signup from "./Pages/Signup";
import { getPathFromState, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmailConfirmation from "./Pages/EmailConfirmation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import Account from "./Pages/Account";
import EditAccount from "./Pages/EditAccount";
import Home from "./Pages/Home";

//@ts-ignore
import {HOST} from "@env";


function App(props: any): JSX.Element {
  let session;

  console.log(HOST);

  const Stack = createNativeStackNavigator();

  const [loading, setLoading] = useState(true);


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
    .then(res => res)
    .catch(err => console.error(err));


  // TODO: check if user logged in and if user email confirmed

  const [signedUp, setSignedUp] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [pathSaved, setPathSaved] = useState(false);

  //AsyncStorage.clear();

  const getData = async () => {

    try {
      setSignedUp(await AsyncStorage.getItem("@signed_up") === "true");
      setLoggedIn(await AsyncStorage.getItem("@email_confirmed") === "true");
      setPathSaved(await AsyncStorage.getItem("@path_saved") === "true");
      if (signedUp !== null) {
        // value previously stored
      }
    } catch (e) {
      // error reading value
    }
  };

  getData().then(() => setLoading(false));


  return (
    <>
      {
        loading ?
          <ActivityIndicator />
          :
          <NavigationContainer>
            {
              loggedIn ?
                <Stack.Navigator screenOptions={{
                  headerShown: false
                }} initialRouteName={pathSaved ? "Home" : "Account"}>
                  <Stack.Screen name="Account">
                    {(props) => <Account {...props} setPathSaved={setPathSaved} />}
                  </Stack.Screen>
                  <Stack.Screen name="Home">
                    {(props) => <Home {...props} />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="EditAccount"
                    component={EditAccount}
                  />
                </Stack.Navigator>
                :
                <Stack.Navigator screenOptions={{
                  headerShown: false
                }} initialRouteName={signedUp ? "Emailconfirmation" : "Signup"}>
                  <Stack.Screen
                    name="Signup"
                    component={Signup}
                  />
                  <Stack.Screen name="Emailconfirmation">
                    {(props) =>
                      <EmailConfirmation
                        {...props} loggedIn={loggedIn} setLoggedIn={setLoggedIn}
                      />}
                  </Stack.Screen>
                </Stack.Navigator>
            }
          </NavigationContainer>
      }
    </>

  );
}

export default App;
