import { AppState, SafeAreaView, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";

// @ts-ignore
import { HOST } from "@env";
import { getDeviceId, getUniqueId, getUniqueIdSync } from "react-native-device-info";


function EmailConfirmation({ navigation, route }: any): JSX.Element {
  // TODO: make pretty
  const [deviceVerified, setDeviceVerified] = useState(false);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const fetchVerified = async () => {
    try {
      const response = await fetch(HOST + "/api/verified", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: route.params.email,
          deviceId: getUniqueIdSync()
        })
      });
      const json = await response.json();
      setDeviceVerified(json.verified);
    } catch (error) {
      console.error(error);
    }
  };

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


  return (
    <>
      <SafeAreaView>
        <View style={{ height: "100%" }}>
          <Text style={{ padding: 10, textAlign: "center" }}>
            Please verify your sign in at ({route.params.email})
          </Text>
          <Text>{appState.current}</Text>
          {
            deviceVerified ?
              <Text>Verified</Text>
              :
              <Text>Not yet verified</Text>
          }
        </View>
      </SafeAreaView>

    </>
  );
}

export default EmailConfirmation;
