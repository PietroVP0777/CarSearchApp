import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

import { useRoute } from "@react-navigation/native";
import { buscarImagem } from "../service/CarService";

export default function ResultScreen({navigation}) {
  const route = useRoute();
  const resultado = route.params?.resultado;
  const [imagemUrl, setImagemUrl] = React.useState(null);

  const dados = {
    marca: resultado.marca,
    modelo: resultado.modelo,
    versao: resultado.versao
  }

  useEffect(() => {
    pesquisarImagem();
  }, []);

  const pesquisarImagem = async () => {
    try {
      const resultadoImagem = await buscarImagem(dados);
      setImagemUrl(resultadoImagem);
    } catch (error) {
      console.error("Erro ao pesquisar imagem:", error);
    }
  };

  if (!resultado) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#FFF" }}>Erro ao carregar dados</Text>
      </View>
    );
  }

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
            {resultado.marca.toUpperCase()}
          </Text>
          <Text style={styles.subtitle}>
            {resultado.modelo.toUpperCase()} {resultado.versao.toUpperCase()}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Especificações</Text>

          {resultado.especificacoes?.map((item, index) => (
            <View key={index} style={styles.specItem}>
              <Text style={styles.specName}>
                {item.nome.toUpperCase()}
              </Text>
              <Text style={styles.specValue}>
                {item.valor}
              </Text>
            </View>
          ))}
        </View>
        {imagemUrl &&(
          <Image
            source={{ uri: imagemUrl }}
            
            style={{ width: "100%", height: 200, marginTop: 20, borderRadius: 10, justifyContent: "center", alignItems: "center" }}
          />
        )}
          <View style={styles.flowControl}>
                    <TouchableOpacity
                      style={[styles.buttonPrimary, { backgroundColor: "#334155" }]}
                      onPress={() => navigation.goBack()}
                    >
                      <Text style={styles.buttonText}>Voltar</Text>
                    </TouchableOpacity>
          
                    <TouchableOpacity
                      style={styles.buttonPrimary}
                      onPress={() => navigation.popToTop()}
                    >
                      <Text style={styles.buttonText}>Nova Busca</Text>
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
  },

  logo: {
    width: 200,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
    resizeMode: "contain",
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    color: "#3B82F6",
    fontSize: 18,
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
    padding: 20,
  },

  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    alignSelf: "center",
  },

  specItem: {
    backgroundColor: "#334155",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  specName: {
    color: "#94A3B8",
    fontSize: 12,
    textTransform: "uppercase",
  },

  specValue: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 3,
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