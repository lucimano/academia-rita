import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import axios from 'axios';

export default function TelaCadastrarAluno({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataCadastro, setDataCadastro] = useState("");
  const [statusPago, setStatusPago] = useState(false);

  const handleCpfChange = (text) => {
    const numericValue = text.replace(/\D/g, "");
    const truncatedValue = numericValue.substring(0, 11);
    let formattedValue = truncatedValue;
    formattedValue = formattedValue.replace(/(\d{3})(\d)/, "$1.$2");
    formattedValue = formattedValue.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    formattedValue = formattedValue.replace(
      /(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/,
      "$1.$2.$3-$4"
    );
    setCpf(formattedValue);
  };

  // Função para máscara de data (DD/MM/AAAA)
  const handleDataChange = (text) => {
    // Remove tudo que não é número
    const numericValue = text.replace(/\D/g, "");
    // Limita a 8 dígitos
    const truncatedValue = numericValue.substring(0, 8);

    // Aplica a máscara (DD/MM/AAAA)
    let formattedValue = truncatedValue;
    // Adiciona a primeira barra
    formattedValue = formattedValue.replace(/(\d{2})(\d)/, "$1/$2");
    // Adiciona a segunda barra
    formattedValue = formattedValue.replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");

    setDataCadastro(formattedValue);
  };

  const handleCadastrar = async () => {
    if (!nome || !email || !cpf) {
      alert("Preencha Nome, Email e CPF!");
      return;
    }

    try {
      const apiUrl = "https://academia-back.onrender.com/alunos";

      await axios.post(apiUrl, {
        nome: nome,
        email: email,
        cpf: cpf,
        data_cadastro: dataCadastro,
        status: statusPago, // Envia true ou false direto
      });

      // 3. Se o código chegou aqui, é porque DEU CERTO (200 OK)
      // O Axios joga erro automaticamente se der errado, então não precisa de "if (response.ok)"
      alert("Aluno cadastrado com sucesso!");
      navigation.goBack();

    } catch (error) {
      // 4. Tratamento de Erros Inteligente
      if (error.response) {
        // O servidor respondeu, mas com erro (ex: CPF duplicado)
        console.log(error.response.data);
        alert("Erro no cadastro: Verifique os dados ou se o CPF já existe.");
      } else if (error.request) {
        // A requisição saiu, mas não teve resposta (Servidor fora do ar)
        alert("Erro de conexão: O servidor parece estar desligado.");
      } else {
        // Outro tipo de erro
        alert("Ocorreu um erro inesperado.");
      }
    }
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

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
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
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          value={dataCadastro}
          onChangeText={handleDataChange} // Usa a máscara de data
          keyboardType="numeric"
          maxLength={10}
        />

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
          onPress={handleCadastrar}
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