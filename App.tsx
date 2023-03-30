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


function App(): JSX.Element {
  let session;


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
    <Signup />
  );
}

export default App;
