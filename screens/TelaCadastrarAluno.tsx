import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function TelaCadastrarAluno({ navigation }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataCadastro, setDataCadastro] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [statusPago, setStatusPago] = useState(false);

  const onChangeData = (event, selectedDate) => {
    // 1. Sempre feche o seletor, não importa o que aconteça.
    setShowDatePicker(false);

    // 2. Verifique se o usuário selecionou uma data (em vez de cancelar)
    // O 'event.type === "set"' confirma que o usuário apertou "OK" no Android
    if (event.type === "set" && selectedDate) {
      // 3. Atualize o estado apenas se houver uma nova data
      setDataCadastro(selectedDate);
    }
    // Se o usuário 'cancelou' (dismissed), o seletor fecha
    // e a data antiga (new Date()) é mantida.
  };

  const handleCpfChange = (text) => {
    // Remove tudo que não é número
    const numericValue = text.replace(/\D/g, "");

    // Limita a 11 dígitos
    const truncatedValue = numericValue.substring(0, 11);

    // Aplica a máscara (xxx.xxx.xxx-xx)
    let formattedValue = truncatedValue;
    // Adiciona o primeiro ponto
    formattedValue = formattedValue.replace(/(\d{3})(\d)/, "$1.$2");
    // Adiciona o segundo ponto
    formattedValue = formattedValue.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    // Adiciona o traço
    formattedValue = formattedValue.replace(
      /(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/,
      "$1.$2.$3-$4"
    );

    setCpf(formattedValue);
  };

  return (
    <View style={styles.pageContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Nome do Aluno:</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Telefone/email:</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
        />
        
        <Text style={styles.label}>CPF:</Text>
        <TextInput
          style={styles.input}
          value={cpf}
          onChangeText={handleCpfChange}
          keyboardType="numeric"
          maxLength={14}
        />

        <Text style={styles.label}>Data de cadastro:</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.input}
        >
          <Text>{dataCadastro.toLocaleDateString("pt-BR")}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dataCadastro}
            mode={"date"}
            display="default"
            onChange={onChangeData}
          />
        )}

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Status:</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ marginRight: 10, fontSize: 16 }}>
              {statusPago ? "Pago" : "Pendente"}
            </Text>
            <Switch
              trackColor={{ false: "#e0e0e0", true: "#003b5c" }}
              thumbColor={"#f4f3f4"}
              onValueChange={() => setStatusPago(!statusPago)}
              value={statusPago}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.btnCadastrar}
          onPress={() => navigation.navigate("TelaListaAlunos")}
        >
          <Text style={{ color: "#fff" }}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#003b5c",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#fdf5e6",
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
    justifyContent: "center",
  },
  btnCadastrar: {
    backgroundColor: "#003b5c",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});