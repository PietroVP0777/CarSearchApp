import { TextInput, View, Text, StyleSheet } from "react-native";

export default function CarInfosComponent({ marca, modelo, versao, setMarca, setModelo, setVersao }) {
  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Marca (ex: Ford)"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        value={marca}
        onChangeText={setMarca}
        maxLength={25}
      />

      <TextInput
        placeholder="Modelo (ex: Ranger)"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        value={modelo}
        onChangeText={setModelo}
        maxLength={35}
      />

      <TextInput
        placeholder="Versão (ex: Raptor)"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        value={versao}
        onChangeText={setVersao}
        maxLength={50}
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