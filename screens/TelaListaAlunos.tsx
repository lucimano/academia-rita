import { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

interface Aluno {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  data_vencimento?: string;
  status: boolean;
}

export default function TelaListaAlunos({ navigation }) {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [searchText, setSearchText] = useState("");

  const fetchAlunos = async (query = "") => {
    try {
      const url = query
        ? `https://academia-back.onrender.com/alunos?search=${query}`
        : "https://academia-back.onrender.com/alunos";

      const response = await axios.get(url);
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de alunos.");
    }
  };

  // Busca inicial e quando o texto de pesquisa muda
  useEffect(() => {
    fetchAlunos(searchText);
  }, [searchText]);

  // Atualiza a lista sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchAlunos(searchText);
    }, [searchText])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar} />

      <View style={styles.pageContainer}>
        <View style={styles.searchContainer}>
          <Text style={styles.labelSearch}>Pesquisar Aluno:</Text>
          <TextInput
            style={styles.inputSearch}
            placeholder="Digite o nome, CPF ou email..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.listWrapper}>
          <View style={[styles.cabecalho, styles.linha]}>
            <View style={styles.coluna}>
              <Text style={styles.txtCabecalho}>Nome</Text>
            </View>
            <View style={styles.coluna}>
              <Text style={styles.txtCabecalho}>CPF</Text>
            </View>
            <View style={styles.coluna}>
              <Text style={styles.txtCabecalho}>Email</Text>
            </View>
            <View style={styles.coluna}>
              <Text style={styles.txtCabecalho}>Data Vencimento</Text>
            </View>
            <View style={styles.coluna}>
              <Text style={styles.txtCabecalho}>Pagamento</Text>
            </View>
            <View style={styles.colButtons}></View>
          </View>

          <ScrollView>
            {alunos.map((aluno) => (
              <View key={aluno.id} style={styles.linha}>
                <View style={styles.coluna}>
                  <Text>{aluno.nome}</Text>
                </View>
                <View style={styles.coluna}>
                  <Text>{aluno.cpf}</Text>
                </View>
                <View style={styles.coluna}>
                  <Text>{aluno.email}</Text>
                </View>
                <View style={styles.coluna}>
                  <Text>{aluno.data_vencimento || "-"}</Text>
                </View>

                <View style={styles.coluna}>
                  <Text>
                    {aluno.status ? "Pago" : "Pendente"}
                  </Text>
                </View>

                <View style={styles.colButtons}>
                  <TouchableOpacity
                    style={styles.btnEditar}
                    onPress={() => navigation.navigate("TelaEditarAluno", { alunoId: aluno.id })}
                  >
                    <Text style={styles.txtBtnEditar}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnExcluir}>
                    <Text style={{ color: "#fff" }}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            {alunos.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text>Nenhum aluno encontrado.</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.btnCadastrar} onPress={() => navigation.navigate("TelaCadastrarAluno")}>
          <Text style={{ color: "#fff" }}>Cadastrar aluno</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerBar: {
    backgroundColor: "#003b5c",
    paddingVertical: 40,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: "#ddd",
    padding: 10,
  },
  searchContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  labelSearch: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  inputSearch: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
  },
  listWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
  },
  cabecalho: {
    backgroundColor: "#f1f1f1",
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
  },
  coluna: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  colButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  txtCabecalho: {
    fontWeight: "bold",
    fontSize: 12,
  },
  btnEditar: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  txtBtnEditar: {
    color: "#333",
  },
  btnExcluir: {
    backgroundColor: "#d9534f",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  btnCadastrar: {
    backgroundColor: "#003b5c",
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  }
});
