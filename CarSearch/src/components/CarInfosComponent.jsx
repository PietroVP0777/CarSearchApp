import { TextInput, View, Text, StyleSheet } from "react-native";

export default function CarInfosComponent({ marca, modelo, versao, setMarca, setModelo, setVersao }) {
  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Marca"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        value={marca}
        onChangeText={setMarca}
      />

      <TextInput
        placeholder="Modelo"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        value={modelo}
        onChangeText={setModelo}
      />

      <TextInput
        placeholder="Versão"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        value={versao}
        onChangeText={setVersao}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
    marginTop: 20,
  },
  input: {
    backgroundColor: "#1E293B",
    color: "#FFF",
    padding: 10,
    borderRadius: 10,
  }
});