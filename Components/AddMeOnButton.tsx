import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";

export default function AddMeOnButton({ title, addMeOn, saveChanges }: any): JSX.Element {

  const [loading, setLoading] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>(addMeOn.link);
  const [instaUserExists, setInstaUserExists] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);

  useEffect(() => {

  });

  console.log(addMeOn);

  // TODO: fill from database and save to database

  return (
    <>

      {
        !opened ?
          <>
            <TouchableOpacity onPress={() => setOpened(!opened)}>
              <View style={{
                flexDirection: "row",
                borderBottomWidth: 1,
                justifyContent: "space-between"
              }}
              >
                <Text style={{
                  fontSize: 18,
                  paddingVertical: 10
                }}>
                  {title}:
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{
                    fontSize: 18,
                    paddingVertical: 10,
                    color: addMeOn.link ? "green" : "red"
                  }}>
                    {addMeOn.link ? addMeOn.link : "unset"}
                  </Text>
                  <Text style={{ fontSize: 18, paddingVertical: 10 }}>{"  "}✍️</Text>
                </View>
              </View>
            </TouchableOpacity>
          </>
          :
          <>
            <View style={{ borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={() => setOpened(!opened)}>
                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}>
                  <Text style={{ fontSize: 18, paddingVertical: 10 }}>{title}</Text>
                  <Text style={{ fontSize: 18, paddingVertical: 10 }}>❌</Text>
                </View>
              </TouchableOpacity>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  style={{
                    height: 30,
                    borderWidth: 1,
                    flex: 1
                  }}
                  value={userInput}
                  onChangeText={async (value) => {
                    setUserInput(value);
                    setLoading(true);
                    setLoading(false);
                  }}
                  autoCorrect={false}
                  autoCapitalize="none"
                />

              </View>

              <View style={{
                flexDirection: "row",
                borderBottomWidth: 1,
                justifyContent: "space-between"
              }}
              >
                <Text style={{ paddingVertical: 10 }}>
                  {
                    title === "mobile" ? "Please enter your mobile number" :
                      "Please enter your " + title + " username"
                  }
                </Text>
                {
                  userInput !== "" &&
                  <Text style={{ paddingVertical: 10, color: "blue" }} onPress={() => {
                    setOpened(false);
                    saveChanges(userInput, title);
                  }
                  }>Save changes</Text>
                }
              </View>
            </View>
          </>
      }


    </>
  );

}
