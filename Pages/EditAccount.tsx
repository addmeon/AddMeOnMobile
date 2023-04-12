import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, Text, TextInput, View } from "react-native";
import { WebView } from "react-native-webview";
import AddMeOnButton from "../Components/AddMeOnButton";

//@ts-ignore
import { HOST } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUniqueIdSync } from "react-native-device-info";

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
    console.log(json)
    setLoading(false);
  }

  const fetchAddMeOns = async () => {
    const response = await fetch(HOST + "/api/users/addmeons/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: await AsyncStorage.getItem("@user_email"),
        deviceID: getUniqueIdSync()
      })
    });
    const json = await response.json();
    const arrAddMeOnButtons: any = [];
    console.log(json.addMeOns);
    await setAddMeOns(await json.addMeOns);
    console.log("state: "+ JSON.stringify(addMeOns));

    json.addMeOns ?
      //TODO figure out
      Object.keys(json.addMeOns).forEach((key, index) => {
        console.log("key: " + key);
        arrAddMeOnButtons.push(<AddMeOnButton key={index}
                                              title={key}
                                              addMeOn={json.addMeOns[key]}
                                              saveChanges={saveChanges}
        />);
      })
      :
      Object.keys(addMeOnsStatic).forEach((key, index) => {
        arrAddMeOnButtons.push(<AddMeOnButton key={index}
                                              title={key}
                                              addMeOn={addMeOnsStatic[key]}
                                              saveChanges={saveChanges}
        />);
      });
    setAddMeOnButtons(arrAddMeOnButtons)
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
    </SafeAreaView>
  );
}
