
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

export default function TelaConciliacao({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [resumo, setResumo] = useState<{ totalLido: number, totalAtualizado: number } | null>(null);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // Aceita qualquer tipo, backend filtra/tenta processar
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                return;
            }

            const file = result.assets[0];
            uploadFile(file);

        } catch (err) {
            console.error("Erro ao selecionar arquivo:", err);
            Alert.alert("Erro", "Falha ao selecionar o arquivo.");
        }
    };

    const uploadFile = async (file: DocumentPicker.DocumentPickerAsset) => {
        setLoading(true);
        setLogs([]);
        setResumo(null);

        const formData = new FormData();

        // Conversão necessária para o React Native entender como arquivo
        const fileToUpload = {
            uri: file.uri,
            name: file.name,
            type: file.mimeType || 'text/csv', // Fallback se não detectar
        };

        // @ts-ignore: FormData no React Native aceita objeto como arquivo
        formData.append('file', fileToUpload);

        try {
            const response = await axios.post('https://academia-back.onrender.com/conciliacao', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = response.data;
            setResumo({
                totalLido: data.totalLido,
                totalAtualizado: data.totalAtualizado
            });
            setLogs(data.logs || []);

            Alert.alert("Sucesso", `Processamento concluído!\nAtualizados: ${data.totalAtualizado}`);

        } catch (error) {
            console.error("Erro no upload:", error);
            Alert.alert("Erro", "Falha ao enviar o arquivo para o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Conciliação Bancária</Text>
                <Text style={styles.subtitle}>Envie o extrato para confirmar pagamentos</Text>
            </View>

            <View style={styles.content}>
                <TouchableOpacity style={styles.btnUpload} onPress={pickDocument} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.btnText}>Selecionar Extrato Bancário</Text>
                    )}
                </TouchableOpacity>

                {resumo && (
                    <View style={styles.resumoContainer}>
                        <Text style={styles.resumoTitle}>Resumo do Processamento:</Text>
                        <Text style={styles.resumoText}>Linhas Lidas: {resumo.totalLido}</Text>
                        <Text style={styles.resumoText}>Pagamentos Confirmados: {resumo.totalAtualizado}</Text>
                    </View>
                )}

                <View style={styles.logsContainer}>
                    <Text style={styles.logsTitle}>Logs:</Text>
                    <ScrollView style={styles.logsScroll}>
                        {logs.length === 0 ? (
                            <Text style={styles.noLogs}>Nenhum pagamento identificado neste envio.</Text>
                        ) : (
                            logs.map((log, index) => (
                                <Text key={index} style={styles.logItem}>{log}</Text>
                            ))
                        )}
                    </ScrollView>
                </View>

                <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
                    <Text style={styles.btnVoltarText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#003b5c',
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        color: '#ccc',
        marginTop: 5,
        fontSize: 14,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    btnUpload: {
        backgroundColor: '#003b5c',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resumoContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 5,
        borderLeftColor: '#2e7d32', // Verde
        elevation: 2,
    },
    resumoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    resumoText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    logsContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        elevation: 2,
    },
    logsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    logsScroll: {
        flex: 1,
    },
    logItem: {
        fontSize: 13,
        color: '#2e7d32',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 4,
    },
    noLogs: {
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    },
    btnVoltar: {
        marginTop: 20,
        alignItems: 'center',
        padding: 10,
    },
    btnVoltarText: {
        color: '#555',
        fontWeight: 'bold',
    }
});
