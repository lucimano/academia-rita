import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Switch,
    Alert,
} from "react-native";
import axios from 'axios';

export default function TelaEditarAluno({ navigation, route }) {
    const { alunoId } = route.params; // Recebe o ID do aluno da tela anterior

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [dataMensalidade, setDataMensalidade] = useState("");
    const [atividade, setAtividade] = useState(false);
    const [statusPago, setStatusPago] = useState(false);

    // Busca os dados do aluno ao carregar a tela
    useEffect(() => {
        const fetchAluno = async () => {
            try {
                // Tenta buscar o aluno específico pelo ID (se a API suportar)
                // Se a API não tiver endpoint /alunos/:id, teremos que buscar todos e filtrar
                // Assumindo que tem /alunos/:id ou vamos filtrar da lista geral se falhar

                // Opção 1: Tentar buscar direto pelo ID (Ideal)
                // const response = await axios.get(`https://academia-back.onrender.com/alunos/${alunoId}`);

                // Opção 2: Buscar todos e encontrar o certo (Mais garantido se não soubermos a API exata)
                const response = await axios.get(`https://academia-back.onrender.com/alunos`);
                const alunoEncontrado = response.data.find(a => a.id === alunoId);

                if (alunoEncontrado) {
                    setNome(alunoEncontrado.nome);
                    setEmail(alunoEncontrado.email);
                    setCpf(alunoEncontrado.cpf);
                    setDataMensalidade(alunoEncontrado.data_cadastro || ""); // Ajuste conforme o nome do campo na API
                    setAtividade(alunoEncontrado.status); // Ajuste conforme o nome do campo na API (status vs atividade)
                    setStatusPago(alunoEncontrado.pagamento);
                } else {
                    Alert.alert("Erro", "Aluno não encontrado.");
                    navigation.goBack();
                }

            } catch (error) {
                console.error("Erro ao buscar dados do aluno:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados do aluno.");
                navigation.goBack();
            }
        };

        fetchAluno();
    }, [alunoId]);

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

    const handleSalvar = async () => {
        if (!nome || !email || !cpf) {
            Alert.alert("Atenção", "Preencha Nome, Email e CPF!");
            return;
        }

        try {
            const apiUrl = `https://academia-back.onrender.com/alunos/${alunoId}`;

            await axios.put(apiUrl, {
                nome: nome,
                email: email,
                cpf: cpf,
                data_cadastro: dataMensalidade,
                status: atividade,
                pagamento: statusPago,
            });

            Alert.alert("Sucesso", "Dados do aluno atualizados!");
            navigation.goBack();

        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                Alert.alert("Erro ao salvar", "Verifique os dados e tente novamente.");
            } else if (error.request) {
                Alert.alert("Erro de conexão", "O servidor parece estar desligado.");
            } else {
                Alert.alert("Erro", "Ocorreu um erro inesperado.");
            }
        }
    };

    return (
        <View style={styles.pageContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
                    <Text style={styles.txtBtnVoltar}>{"< Voltar"}</Text>
                </TouchableOpacity>
            </View>
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

                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Status:</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ marginRight: 10, fontSize: 16 }}>
                            {atividade ? "Ativo" : "Inativo"}
                        </Text>
                        <Switch
                            trackColor={{ false: "#e0e0e0", true: "#003b5c" }}
                            thumbColor={"#f4f3f4"}
                            onValueChange={() => setAtividade(!atividade)}
                            value={atividade}
                        />
                    </View>
                </View>

                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Pagamento:</Text>
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
                    onPress={handleSalvar}
                >
                    <Text style={{ color: "#fff" }}>Salvar Alterações</Text>
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
    header: {
        width: "100%",
        position: "absolute",
        top: 40,
        left: 20,
        zIndex: 1,
    },
    btnVoltar: {
        padding: 10,
    },
    txtBtnVoltar: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    container: {
        width: "100%",
        maxWidth: 500,
        backgroundColor: "#fdf5e6",
        padding: 20,
        borderRadius: 10,
        marginTop: 60, // Space for header
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