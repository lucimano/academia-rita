import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Switch,
    Alert, // Importante para mensagens nativas
} from "react-native";
import axios from 'axios';

// Recebemos { route, navigation } para pegar os dados passados pela tela anterior
export default function TelaEditarAluno({ route, navigation }) {

    // 1. Pegamos o aluno que foi passado pela navegação
    // Se não vier nada, usamos um objeto vazio {} para não quebrar
    const { aluno } = route.params || {};

    // 2. Inicializamos os estados COM OS DADOS DO ALUNO
    const [nome, setNome] = useState(aluno?.nome || "");
    const [email, setEmail] = useState(aluno?.email || "");
    const [cpf, setCpf] = useState(aluno?.cpf || "");

    // Supondo que seu banco tenha essas colunas. Se vier null, assume false.
    const [atividade, setAtividade] = useState(aluno?.ativo || false);
    const [statusPago, setStatusPago] = useState(aluno?.status || false);

    // Função de máscara de CPF (igual à de cadastro)
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
        if (!nome || !cpf) {
            Alert.alert("Atenção", "Nome e CPF são obrigatórios.");
            return;
        }

        try {
            // ATENÇÃO: Precisa do ID na URL para saber quem atualizar
            const apiUrl = `https://academia-back.onrender.com/alunos/${aluno.id}`;

            // Usamos PUT para atualizar
            await axios.put(apiUrl, {
                nome: nome,
                email: email,
                cpf: cpf,
                ativo: atividade, // Verifica se no banco chama 'ativo' ou 'status'
                status: statusPago,
            });

            Alert.alert("Sucesso", "Dados atualizados!");
            navigation.goBack(); // Volta para a lista atualizada

        } catch (error) {
            console.log(error);
            if (error.response) {
                Alert.alert("Erro ao salvar", "Verifique os dados.");
            } else {
                Alert.alert("Erro de conexão", "Não foi possível conectar ao servidor.");
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
                // CPF geralmente não se edita, talvez seja bom colocar editable={false}
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

// Mantenha os seus estilos (styles) aqui embaixo igual estava...
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
        marginTop: 60,
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