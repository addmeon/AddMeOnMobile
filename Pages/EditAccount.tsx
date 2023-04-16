import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { WebView } from "react-native-webview";
import AddMeOnButton from "../Components/AddMeOnButton";

//@ts-ignore
import { HOST } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUniqueIdSync } from "react-native-device-info";

// TODO upload profile picture

export default function EditAccount({ navigation }: any): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [addMeOns, setAddMeOns] = useState({});
  const [addMeOnButtons, setAddMeOnButtons] = useState([]);

  const saveChanges = async (newValue: string, key: string) => {
    setLoading(true);
    const response = await fetch(HOST + "/api/users/addmeons/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: await AsyncStorage.getItem("@user_email"),
        deviceID: getUniqueIdSync(),
        key: key,
        value: newValue
      })
    });
    const json = await response.json();
    console.log(json);
    await fetchAddMeOns();
    setLoading(false);
  };

  const fetchAddMeOns = async () => {
    const userMail = await AsyncStorage.getItem("@user_email");
    const response = await fetch(HOST + "/api/users/addmeons/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: userMail,
        deviceID: getUniqueIdSync()
      })
    });
    const json = await response.json();
    const arrAddMeOnButtons: any = [];
    console.log(json.addMeOns);
    await setAddMeOns(json.addMeOns);
    console.log("state: " + JSON.stringify(addMeOns));

    //TODO figure out
    if(Object.keys(json.addMeOns).length>0)
    Object.keys(json.addMeOns).forEach((key, index) => {
      console.log("key: " + key);
      arrAddMeOnButtons.push(<AddMeOnButton key={key}
                                            title={key}
                                            addMeOn={json.addMeOns[key]}
                                            saveChanges={saveChanges}
      />);
    });

    Object.keys(addMeOnsStatic).forEach((key, index) => {
      if (json.addMeOns) if (Object.keys(json.addMeOns).includes(key)) return;
      arrAddMeOnButtons.push(<AddMeOnButton key={key}
                                            title={key}
                                            addMeOn={addMeOnsStatic[key]}
                                            saveChanges={saveChanges}
      />);
    });
    setAddMeOnButtons(arrAddMeOnButtons);
    setLoading(false);
  };


  useEffect(() => {
    fetchAddMeOns();
  }, []);

  // TODO

  const addMeOnsStatic: any = {
    mobile: { link: "" },
    instagram: { link: "" },
    snapchat: { link: "" },
    linkedin: { link: "" },
    bereal: { link: "" },
    paypal: { link: "" },
    tiktok: { link: "" },
    discord: { link: "" },
    facebook: { link: "" },
    twitter: { link: "" }
  };


  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ alignSelf: "flex-start", paddingHorizontal: 10 }}>
          <Button title="&#8249; Return to home" onPress={() => navigation.navigate("Home")} />
        </View>
        <View style={{ margin: 10, padding: 10 }}>
          <>

            <Text style={{ marginBottom: 20, fontSize: 30 }}>
              What would you like to edit on your Add Me On page?
            </Text>
            {loading ?
              <ActivityIndicator />
              :
              <>
                {addMeOnButtons}
              </>
            }
          </>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
