import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { useRoute } from "@react-navigation/native";
import { buscarCarro } from "../service/CarService";

export default function SpecScreen({ navigation }) {
  const route = useRoute();

  const [especificacao, setEspecificacao] = useState("");
  const [especificacoesList, setEspecificacoesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { marca, modelo, versao } = route.params;

  const addEspcList = () => {
    if (!especificacao.trim()) return;

    setEspecificacoesList((prev) => [...prev, especificacao.trim()]);
    setEspecificacao("");
  };

  const removeItem = (indexToRemove) => {
    setEspecificacoesList((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleBuscar = async () => {
    setLoading(true);

    const carro = {
      marca,
      modelo,
      versao,
      especificacoes: especificacoesList,
    };

    try {
      const resultado = await buscarCarro(carro);
      navigation.navigate("Result", { resultado });
    } catch (e) {
      console.log("erro", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        <Image
          source={require("../../assets/fordLogo.png")}
          style={styles.logo}
        />

        <View style={styles.header}>
          <Text style={styles.title}>
            {marca.toUpperCase()}
          </Text>
          <Text style={styles.subtitle}>
            {modelo.toUpperCase()} {versao.toUpperCase()}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Adicionar especificações
          </Text>

          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Ex: motor, consumo, potência..."
              placeholderTextColor="#94A3B8"
              value={especificacao}
              onChangeText={setEspecificacao}
            />

            <TouchableOpacity style={styles.buttonAdd} onPress={addEspcList}>
              <Text style={styles.buttonAddText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chipList}>
            {especificacoesList.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => removeItem(index)}
                style={styles.chip}
              >
                <Text style={styles.chipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {especificacoesList.length === 0 && (
            <Text style={styles.emptyText}>
              Nenhuma especificação adicionada
            </Text>
          )}
        </View>

        <View style={styles.flowControl}>
          <TouchableOpacity
            style={[styles.buttonPrimary, { backgroundColor: "#334155" }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBuscar}
            style={styles.buttonPrimary}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Buscar</Text>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
    paddingTop: 60,
  },

  logo: {
    width: 200,
    height: 100,
    alignSelf: "center",
    marginBottom: 15,
    resizeMode: "contain",
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 2,
  },

  subtitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 18,
  },

  sectionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    backgroundColor: "#0F172A",
    color: "#FFF",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },

  buttonAdd: {
    backgroundColor: "#22C55E",
    padding: 14,
    borderRadius: 10,
    marginLeft: 10,
  },

  buttonAddText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  chipList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 15,
  },

  chip: {
    backgroundColor: "#334155",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  chipText: {
    color: "#FFF",
    fontSize: 14,
  },

  emptyText: {
    color: "#94A3B8",
    marginTop: 10,
    textAlign: "center",
  },

  flowControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  buttonPrimary: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    width: "48%",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});