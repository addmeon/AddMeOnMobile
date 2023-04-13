import QRCode from "react-native-qrcode-svg";
import { ActivityIndicator, Button, SafeAreaView, Text, View } from "react-native";

// @ts-ignore
import { HOST } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";

export default function Home({ navigation }: any): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState<string>("");

  const getPath = async () => {
    try {
      setPath(await AsyncStorage.getItem("@path_value") || "");
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };


  useEffect(() => {
    getPath();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ?
        <ActivityIndicator />
        :
        <View>
          <View style={{ alignItems: "flex-end", justifyContent: "flex-start" }}>
            <Button title="Edit your Add Me On page" onPress={() => navigation.navigate("EditAccount")}></Button>
          </View>
          <View style={{ padding: 10, alignItems: "center" }}>
            <Text style={{fontSize: 30}}>addmeon.org/{path}</Text>
          </View>
          <View style={{
            alignItems: "center", justifyContent: "center"
          }}>
            <QRCode
              value={HOST + "/" + path}
              size={210}
              color={"black"}
              backgroundColor={"transparent"}
            />
          </View>
        </View>
      }

    </SafeAreaView>
  );
}
