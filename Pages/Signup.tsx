import LoginScreen, { emailValidator, SocialButton } from "react-native-login-screen";
import { Linking, Platform, SafeAreaView, Text, View } from "react-native";
import React from "react";


function Signup({navigation}: any): JSX.Element {
  let email: string;

  const handleSignup = () => {
    if(!emailValidator(email)) return;
    console.log("Email signup: " + email); // TODO: send to api and send email
    navigation.navigate('Emailconfirmation', {email: email});
  }

  return (
    <>
      <SafeAreaView>
        <View style={{ height: "100%" }}>

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
            onPasswordChange={() => {return;}}
            customSocialLoginButtons={
              <>
                <SocialButton style={{
                  marginBottom: 10,
                  backgroundColor: "white",
                  borderColor: "grey", borderWidth: 0.5
                }}
                              imageSource={require("../assets/logos/google.png")}
                              iconImageStyle={{ borderRadius: 50, width: 30, height: 30, backgroundColor: "white" }}
                              text={"Continue with Google"}
                              textStyle={{ color: "grey", marginLeft: 4 }}
                              onPress={() => {
                                console.log("test");
                              }}
                />
                {
                  Platform.OS === "ios" &&
                  <SocialButton
                    style={{ marginBottom: 10, backgroundColor: "black" }}
                    imageSource={require("../assets/logos/apple.png")}
                    iconImageStyle={{ borderRadius: 50, width: 40, height: 40, marginLeft: -6 }}
                    text={"Continue with Apple ID"}
                    textStyle={{ color: "white" }}
                    onPress={() => {
                      console.log("test");
                    }} />
                }
              </>
            }
          />
          <Text style={{padding: 10,textAlign: "center", color: "grey", fontSize: 10, marginBottom: 10}}>
            By signing up, you acknowledge that you have read and accept the following {""}
            <Text style={{textDecorationLine: "underline"}}
                  onPress={() => Linking.openURL('https://google.com')}>
              Terms & Conditions
            </Text>
          </Text>

        </View>
      </SafeAreaView>

    </>
  );
}

export default Signup;
