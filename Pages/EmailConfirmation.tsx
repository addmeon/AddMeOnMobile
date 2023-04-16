import { Image, AppState, SafeAreaView, Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useRef, useState } from "react";

// @ts-ignore
import { HOST } from "@env";
import { getDeviceId, getUniqueId, getUniqueIdSync } from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";


function EmailConfirmation({ navigation, route, setLoggedIn, loggedIn }: any): JSX.Element {
  // TODO: make pretty
  const [deviceVerified, setDeviceVerified] = useState(false);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  const fetchVerified = async () => {
    if(loggedIn) return;
    try {
      let emailFromStorage;
      if(email==="") {
        emailFromStorage = await AsyncStorage.getItem("@user_email");
        await setEmail(emailFromStorage as string);
        console.log(email);
      }
      const response = await fetch(HOST + "/api/verified", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          deviceId: getUniqueIdSync()
        })
      });
      console.log(response);

      const json = await response.json();
      if(json.verified === "true"){
        await AsyncStorage.setItem("@email_confirmed", "true");
        setLoggedIn(true);
      }

      // TODO: store deviceverified in asyncstorage
      console.log('jsoN: ' + JSON.stringify(json));
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => fetchVerified(), 1000);
  };

  if(!loggedIn)fetchVerified();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        fetchVerified().catch(err => console.error(err));
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const getData = async () => {
    try {
      const emailFromStorage = await AsyncStorage.getItem("@user_email");
      if (emailFromStorage !== null) setEmail(emailFromStorage);
    } catch (e) {
      // error reading value
    }
  };

  getData().then(() => setLoading(false));


  return (
    <>

      <SafeAreaView>
        {
          loading ?
            <ActivityIndicator />
            :
            <View style={{ height: "100%" }}>
              {
                deviceVerified ?
                  <Text>Verified</Text>
                  :
                  <>
                    <Image
                      source={require("../assets/password.gif")}
                      style={{alignSelf: "center", margin: 10}}
                    />
                    <Text style={{ padding: 10, textAlign: "center" }}>
                      Please verify your sign in at ({email})
                    </Text>
                  </>
              }
            </View>
        }
      </SafeAreaView>

    </>
  );
}

export default EmailConfirmation;
