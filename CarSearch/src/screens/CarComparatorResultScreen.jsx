import React from "react";
import {
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRoute } from "@react-navigation/native";

export default function CarComparatorResultScreen({navigation}) {
  const route = useRoute();

  const { carros, resultado } = route.params || {};

  const [lista, setLista] = React.useState([]);

  React.useEffect(() => {
    if (resultado && typeof resultado === "object") {
      const listaFormatada = Object.values(resultado).map(
        (value) => `${value}`,
      );

      setLista(listaFormatada);
    } else {
      setLista([]);
    }
  }, [resultado]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image
          source={require("../../assets/fordLogo.png")}
          style={styles.logo}
        />

        <View style={styles.header}>
          <View style={styles.carView}>
            <Text style={styles.brand}>{carros?.marca?.toUpperCase()}</Text>
            <Text style={styles.model}>
              {carros?.modelo?.toUpperCase()} {carros?.versao?.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.vs}>X</Text>

          <View style={styles.carView}>
            <Text style={styles.brand}>{carros?.marca2?.toUpperCase()}</Text>
            <Text style={styles.model}>
              {carros?.modelo2?.toUpperCase()} {carros?.versao2?.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resultados da comparação</Text>

          {lista.map((item, index) => (
            <View style={styles.obsCard} key={index}>
              <View style={styles.obsBadge}>
                <Text style={styles.obsBadgeText}>{index + 1}</Text>
              </View>

              <View style={styles.obsItem}>
                <Text style={styles.obsItemText}>{item}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.buttonText}>Nova Busca</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  scroll: {
    padding: 24,
    alignItems: "center",
  },

  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
  },

  carView: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#1E293B",
  },

  brand: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  model: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },

  vs: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginHorizontal: 10,
  },

  card: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 18,
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },

  cardTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  cardText: {
    color: "#94A3B8",
    fontSize: 14,
  },

  obsCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },

  obsBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    flexShrink: 0,
  },

  obsItem: {
    flex: 1,
    padding: 12,
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderRadius: 10,
    backgroundColor: "#0F172A",
  },

  obsItemText: {
    color: "#FFF",
    fontSize: 14,
    lineHeight: 20,
  },

  obsBadgeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonPrimary: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
