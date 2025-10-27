import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TelaListaAlunos from "./screens/TelaListaAlunos";
import TelaCadastrarAluno from "./screens/TelaCadastrarAluno";
import TelaEditarAluno from "./screens/TelaEditarAluno";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TelaListaAlunos" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TelaListaAlunos" component={TelaListaAlunos}>
        </Stack.Screen>
        <Stack.Screen name="TelaCadastrarAluno" component={TelaCadastrarAluno}>
        </Stack.Screen>
        <Stack.Screen name="TelaEditarAluno" component={TelaEditarAluno}>
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
