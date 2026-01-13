import { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  useWindowDimensions,
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
  pagamento: boolean;
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

  // Detecta o tamanho da tela para responsividade
  const { width } = useWindowDimensions();
  const isMobile = width < 768; // Definição de mobile/tablet vertical

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

  const renderMobileCard = (aluno: Aluno) => (
    <View key={aluno.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{aluno.nome}</Text>
        <Text style={[styles.cardStatus, { color: aluno.status ? '#2e7d32' : '#c62828' }]}>
          {aluno.status ? "Ativo" : "Inativo"}
        </Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardText}><Text style={styles.cardLabel}>CPF:</Text> {aluno.cpf}</Text>
        <Text style={styles.cardText}><Text style={styles.cardLabel}>Email:</Text> {aluno.email}</Text>
        <Text style={styles.cardText}><Text style={styles.cardLabel}>Vencimento:</Text> {calculateDueDate(aluno.data_inicio)}</Text>
        <Text style={styles.cardText}>
          <Text style={styles.cardLabel}>Pagamento:</Text>
          <Text style={{ color: aluno.pagamento ? 'green' : '#d9534f', fontWeight: 'bold' }}>
            {aluno.pagamento ? " Pago" : " Pendente"}
          </Text>
        </Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.btnEditarMobile}
          onPress={() => navigation.navigate("TelaEditarAluno", { aluno: aluno })}
        >
          <Text style={styles.txtBtnEditar}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnExcluirMobile}
          onPress={() => handleExcluir(aluno.id)}
        >
          <Text style={{ color: "#fff" }}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDesktopTable = () => (
    <View style={styles.listWrapper}>
      <View style={[styles.cabecalho, styles.linha]}>
        <View style={styles.coluna}><Text style={styles.txtCabecalho}>Nome</Text></View>
        <View style={styles.coluna}><Text style={styles.txtCabecalho}>CPF</Text></View>
        <View style={styles.coluna}><Text style={styles.txtCabecalho}>Email</Text></View>
        <View style={styles.coluna}><Text style={styles.txtCabecalho}>Status</Text></View>
        <View style={styles.coluna}><Text style={styles.txtCabecalho}>Vencimento</Text></View>
        <View style={styles.coluna}><Text style={styles.txtCabecalho}>Pagamento</Text></View>
        <View style={styles.colButtons}></View>
      </View>

      <ScrollView>
        {alunos.map((aluno) => (
          <View key={aluno.id} style={styles.linha}>
            <View style={styles.coluna}><Text>{aluno.nome}</Text></View>
            <View style={styles.coluna}><Text>{aluno.cpf}</Text></View>
            <View style={styles.coluna}><Text>{aluno.email}</Text></View>
            <View style={styles.coluna}><Text>{aluno.status ? "Ativo" : "Inativo"}</Text></View>
            <View style={styles.coluna}><Text>{calculateDueDate(aluno.data_inicio)}</Text></View>
            <View style={styles.coluna}>
              <Text style={{ color: aluno.pagamento ? 'green' : '#d9534f', fontWeight: 'bold' }}>
                {aluno.pagamento ? "Pago" : "Pendente"}
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
      </ScrollView>
    </View>
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

        {/* Renderização Condicional: Table vs Cards */}
        {isMobile ? (
          <ScrollView style={{ flex: 1 }}>
            {alunos.map(renderMobileCard)}
            {alunos.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text>Nenhum aluno encontrado.</Text>
              </View>
            )}
          </ScrollView>
        ) : (
          renderDesktopTable()
        )}

        {/* Botão flutuante ou fixo para cadastrar */}
        <TouchableOpacity style={styles.btnCadastrar} onPress={() => navigation.navigate("TelaCadastrarAluno")}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>+ Cadastrar Aluno</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnCadastrar, { backgroundColor: "#2e7d32", marginTop: 10 }]} onPress={() => navigation.navigate("TelaConciliacao")}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>$ Conciliação Bancária</Text>
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
    paddingVertical: 20, // Reduzi um pouco
  },
  pageContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Cor de fundo mais suave
    padding: 10,
  },
  searchContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  labelSearch: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#444",
  },
  inputSearch: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  listWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cabecalho: {
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 12, // Mais espaço
  },
  coluna: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  colButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  txtCabecalho: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#555",
  },
  btnEditar: {
    backgroundColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  txtBtnEditar: {
    color: "#333",
    fontSize: 12,
  },
  btnExcluir: {
    backgroundColor: "#ff5252",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnCadastrar: {
    backgroundColor: "#003b5c",
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
  },
  // ESTILOS DE CARDS (MOBILE)
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0"
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cardBody: {
    marginBottom: 15,
  },
  cardText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  cardLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  btnEditarMobile: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  btnExcluirMobile: {
    backgroundColor: "#ffebee",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
});
