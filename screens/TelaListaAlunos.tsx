import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const alunos = [
  {
    id: 1,
    nome: "João",
    cpf: "1251252125",
    email: "joao@email.com",
    dataVenci: "12/05",
    pagamento: "Pago",
  },
  {
    id: 2,
    nome: "Maria",
    cpf: "123126845",
    email: "maria@email.com",
    dataVenci: "12/05",
    pagamento: "Pendente",
  },
  {
    id: 3,
    nome: "Ana",
    cpf: "21051275124",
    email: "ana@email.com",
    dataVenci: "12/05",
    pagamento: "Pago",
  },
];

export default function TelaListaAlunos({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar} />

      <View style={styles.pageContainer}>
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
                  <Text>{aluno.dataVenci}</Text>
                </View>

                <View style={styles.coluna}>
                  <Text>
                    {aluno.pagamento}
                  </Text>
                </View>

                <View style={styles.colButtons}>
                  <TouchableOpacity style={styles.btnEditar} onPress={() => navigation.navigate("TelaEditarAluno")}>
                    <Text style={styles.txtBtnEditar}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnExcluir}>
                    <Text style={{ color: "#fff" }}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
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
});
