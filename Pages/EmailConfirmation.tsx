import { SafeAreaView, Text, View } from "react-native";
import React from "react";


function EmailConfirmation({navigation, route} : any): JSX.Element {
  // TODO: make pretty

  return (
    <>
      <SafeAreaView>
        <View style={{ height: "100%" }}>
          <Text style={{ padding: 10, textAlign: "center" }}>
            Please confirm your email address ({route.params.email})
          </Text>

        </View>
      </SafeAreaView>

    </>
  );
}

export default EmailConfirmation;
