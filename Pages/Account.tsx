import { ActivityIndicator, Alert, Button, SafeAreaView, Text, TextInput, View } from "react-native";
import { useEffect, useRef, useState } from "react";
// @ts-ignore
import { HOST } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Account({ navigation, setPathSaved }: any): JSX.Element {
  const [path, setPath] = useState<string>("");
  const [pathAvailable, setPathAvailable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("Please enter a path");

  const checkPathAvailable = async (path: string) => {
    if (path === "") return;
    setLoading(true);
    const pathOnHost = await fetch(HOST + "/" + path);
    setPathAvailable(pathOnHost.status === 404);
    setLoading(false);
  };


  const savePath = async (path: string) => {
    if (loading || !pathAvailable) return;

    setLoading(true);

    // TODO DELETE AFTER DEBUGGING
    if (await AsyncStorage.getItem("@user_email") === null)
      await AsyncStorage.setItem("@user_email", "emil@triest.de");
    console.log(await AsyncStorage.getItem("@user_email"));

    try {
      const response = await fetch(HOST + "/api/savepath", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          email: await AsyncStorage.getItem("@user_email"),
          path: path
        })
      });
      const json = await response.json();
      console.log(response.status);
      if (response.status === 200) {

        await AsyncStorage.setItem("@path_saved", "true");
        await AsyncStorage.setItem("@path_value", path);
        setPathSaved(true);
        navigation.navigate("Home");
      }
      Alert.alert(JSON.stringify(json));

    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  // TODO make pretty
  // TODO show user when network error
  return (
    <SafeAreaView>
      <View style={{ margin: 10, padding: 10 }}>
        <Text style={{ alignSelf: "center", margin: 10 }}>Choose your Add Me On Link</Text>

        <View style={{ flexDirection: "row" }}>
          <Text style={{ flex: 2 }}>addmeon.org/</Text>
          <TextInput
            style={{
              height: 40,
              borderWidth: 1,
              flex: 5,
              marginLeft: 15
            }}
            onChangeText={async (value) => {
              await checkPathAvailable(value);
              if (!pathAvailable) return;
              setPath(value);
            }}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        {path === "" ?
          <>
            {loading && <ActivityIndicator />}
            <Text style={{ marginTop: 10 }}>
              Please enter the path you would like to use for your Add Me On Page
            </Text>
          </>
          :
          <>
            <View style={{ flexDirection: "row", marginTop: 10 }}>

              <Text>path available:
                {loading ? <ActivityIndicator /> : JSON.stringify(pathAvailable)}
              </Text>
            </View>

            <Button title={pathAvailable ? "Continue" : "This path is taken"}
                    color={(pathAvailable && !loading) ? "blue" : "red"}
                    onPress={() => savePath(path)} />
          </>
        }
      </View>
    </SafeAreaView>
  );
}
