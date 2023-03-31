import LoginScreen, { emailValidator, SocialButton } from "react-native-login-screen";
import { ActivityIndicator, Linking, Platform, SafeAreaView, Text, View } from "react-native";
import React, { useState } from "react";
import { GoogleSignin, statusCodes, User } from "@react-native-google-signin/google-signin";
import appleAuth from "@invertase/react-native-apple-authentication";
// @ts-ignore
import {HOST} from "@env";
import { getDeviceId, getUniqueId, getUniqueIdSync } from "react-native-device-info";


function Signup({ navigation }: any): JSX.Element {
  let email: string;
  let googleUserInfo: User;
  const [loading, setLoading] = useState<boolean>(false);

  const continueWithMail = async (email: string) => {
    setLoading(true);
    await fetch(HOST + "/api/users/signup", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        deviceId: getUniqueIdSync()
      })
    }).then(res => res.json()).then(data => console.log(data));
    navigation.navigate("Emailconfirmation", { email: email });
  };

  const handleSignup = () => {
    if (!emailValidator(email)) return;
    console.log("Email signup: " + email); // TODO: send to api and send email
    continueWithMail(email).catch(err => console.error(err));
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    GoogleSignin.configure();
    try {
      await GoogleSignin.hasPlayServices();
      googleUserInfo = await GoogleSignin.signIn();
      navigation.navigate("Emailconfirmation", { email: googleUserInfo.user.email });
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const handleAppleSignup = async () => {
    // TODO: see link below after paying for apple developer program
    //  https://github.com/invertase/react-native-apple-authentication/blob/main/docs/INITIAL_SETUP.md
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // Note: it appears putting FULL_NAME first is important, see issue #293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL]
      });

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        if (appleAuthRequestResponse.email !== null)
          continueWithMail(appleAuthRequestResponse.email);
      }

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <SafeAreaView>
        <View style={{ height: "100%" }}>
          {
            loading ?
              <ActivityIndicator />
              :
              <>
                <LoginScreen
                  style={{ height: "100%", backgroundColor: "white" }}
                  logoImageSource={require("../assets/logos/addmeon.jpeg")}
                  onLoginPress={() => handleSignup()}
                  onSignupPress={() => {
                    return;
                  }}
                  onEmailChange={(value: string) => {
                    email = value;
                    console.log("email: ", email);
                  }}
                  loginButtonText={"Start using Add Me On"}
                  loginButtonStyle={{ backgroundColor: "hsl(265, 100%, 65%)" }}
                  disableSignup
                  disablePasswordInput
                  onPasswordChange={() => {
                    return;
                  }}
                  customSocialLoginButtons={
                    <>
                      <SocialButton
                        style={{
                          marginBottom: 10,
                          backgroundColor: "white",
                          borderColor: "grey", borderWidth: 0.5
                        }}
                        imageSource={require("../assets/logos/google.png")}
                        iconImageStyle={{
                          borderRadius: 50,
                          width: 30, height: 30,
                          backgroundColor: "white"
                        }}
                        text={"Continue with Google"}
                        textStyle={{ color: "grey", marginLeft: 4 }}
                        onPress={() => handleGoogleSignup()}
                      />
                      {
                        false &&
                        <SocialButton
                          style={{ marginBottom: 10, backgroundColor: "black" }}
                          imageSource={require("../assets/logos/apple.png")}
                          iconImageStyle={{ borderRadius: 50, width: 40, height: 40, marginLeft: -6 }}
                          text={"Continue with Apple ID"}
                          textStyle={{ color: "white" }}
                          onPress={() => handleAppleSignup()}
                        />
                      }
                    </>
                  }
                />
                <Text onPress={() => Linking.openURL("https://example.org")}
                      style={{ padding: 10, textAlign: "center", color: "grey", fontSize: 10, marginBottom: 10 }}>
                  By signing up, you acknowledge that you have read and accept the following {""}
                  <Text style={{ textDecorationLine: "underline" }}>
                    Terms & Conditions
                  </Text>
                </Text>
              </>
          }


        </View>
      </SafeAreaView>

    </>
  );
};

export default Signup;
