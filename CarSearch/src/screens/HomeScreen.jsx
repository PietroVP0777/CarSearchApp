import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  ScrollView
} from 'react-native'

import { uploadImagem } from '../service/CarService'
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen({ navigation }) {
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [versao, setVersao] = useState('')
  const [loading, setLoading] = useState(false)
  const [imagem, setImagem] = useState(null)

  function handleAvancar() {
    if (!marca || !modelo || !versao) {
      alert("Preencha todos os campos")
      return
    }

    navigation.navigate('Step2', {
      marca,
      modelo,
      versao
    })

    setMarca('')
    setModelo('')
    setVersao('')
    setImagem(null)
  }

  async function selecionarImagem() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: true,
    })

    if (!result.canceled) {
      const asset = result.assets[0]

      console.log("ASSET:", asset)

      setImagem(asset.uri)
      handleUploadImagem(asset)
    }
  }

  async function handleUploadImagem(file) {
    try {
      setLoading(true)

      const response = await uploadImagem(file)
      setMarca(response.marca)
      setModelo(response.modelo)
      setVersao(response.versao)

    } catch (error) {
      console.log(error)
      setImagem(null)
      alert("Erro ao analisar imagem")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView>
      <Image
        source={require("../../assets/fordLogo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>CarSearch</Text>
      <Text style={styles.subtitle}>
        Encontre veículos da concorrência com precisão
      </Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={selecionarImagem}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Enviar imagem</Text>
        )}
      </TouchableOpacity>

      {imagem && (
        loading ? (
          <Image
          source={{ uri: imagem }}
          style={styles.previewLoading}
        />
        ) : (
        <Image
          source={{ uri: imagem }}
          style={styles.preview}
        />
      ) )}

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Marca (ex: Ford)"
          placeholderTextColor="#94A3B8"
          value={marca}
          onChangeText={setMarca}
        />

        <TextInput
          style={styles.input}
          placeholder="Modelo (ex: Ranger)"
          placeholderTextColor="#94A3B8"
          value={modelo}
          onChangeText={setModelo}
        />

        <TextInput
          style={styles.input}
          placeholder="Versão (ex: Raptor)"
          placeholderTextColor="#94A3B8"
          value={versao}
          onChangeText={setVersao}
        />

        <TouchableOpacity style={styles.button} onPress={handleAvancar}>
          <Text style={styles.buttonText}>Avançar</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    padding: 24
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20
  },
  form: {
    gap: 12,
    marginTop: 20
  },
  input: {
    backgroundColor: '#1E293B',
    color: '#FFF',
    padding: 14,
    borderRadius: 10
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16
  },
  logo: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: 15,
  },
  previewLoading: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: 15,
    filter: 'blur(5px)'
  }
})