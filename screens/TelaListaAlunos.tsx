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
  data_inicio?: string;
  status: boolean;
  statusPagamento: boolean;
}

export default function TelaListaAlunos({ navigation }) {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [searchText, setSearchText] = useState("");

  const calculateDueDate = (dataInicio: string | undefined) => {
    if (!dataInicio) return "-";
    const date = new Date(dataInicio);
    if (isNaN(date.getTime())) return "-";

    // Add 30 days
    date.setDate(date.getDate() + 30);

    // Format to DD/MM/YYYY
    return date.toLocaleDateString("pt-BR");
  };

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

  const handleExcluir = (id: number) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este aluno?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`https://academia-back.onrender.com/alunos/${id}`);
              Alert.alert("Sucesso", "Aluno excluído com sucesso!");
              fetchAlunos(searchText); // Atualiza a lista
            } catch (error) {
              console.error("Erro ao excluir aluno:", error);
              Alert.alert("Erro", "Não foi possível excluir o aluno.");
            }
          },
        },
      ]
    );
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
              <Text style={styles.txtCabecalho}>Status</Text>
            </View>
            <View style={styles.coluna}>
              <Text style={styles.txtCabecalho}>Data de Vencimento</Text>
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
                  <Text>
                    {aluno.status ? "Ativo" : "Inativo"}
                  </Text>
                </View>
                <View style={styles.coluna}>
                  <Text>
                    {calculateDueDate(aluno.data_inicio)}
                  </Text>
                </View>
                <View style={styles.coluna}>
                  <Text>
                    {aluno.statusPagamento ? "Pago" : "Pendente"}
                  </Text>
                </View>
                <View style={styles.colButtons}>
                  <TouchableOpacity
                    style={styles.btnEditar}
                    onPress={() => navigation.navigate("TelaEditarAluno", { aluno: aluno })}
                  >
                    <Text style={styles.txtBtnEditar}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnExcluir}
                    onPress={() => handleExcluir(aluno.id)}
                  >
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
