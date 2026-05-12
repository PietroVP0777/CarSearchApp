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

import { compararVeiculos } from '../service/CarService';
import CarInfosComponent from '../components/CarInfosComponent';

export default function CarComparatorScreen({ navigation }) {
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [versao, setVersao] = useState('')
  const [marca2, setMarca2] = useState('')
  const [modelo2, setModelo2] = useState('')
  const [versao2, setVersao2] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleComparar() {
    if (!marca || !modelo || !versao || !marca2 || !modelo2 || !versao2) {
      alert("Preencha todos os campos")
      return
    }

    setLoading(true)

    try {
      const carros = {
        marca,
        modelo,
        versao,
        marca2,
        modelo2,
        versao2
      }

      const resultado = await compararVeiculos(carros)

      navigation.navigate('ComparatorResult', {
        carros,
        resultado
      })

      setMarca('')
      setModelo('')
      setVersao('')
      setMarca2('')
      setModelo2('')
      setVersao2('')

    } catch (error) {
      console.log(error)
      alert("Erro ao comparar veículos")
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
          Compare veículos
        </Text>

        <View style={styles.form}>
          <CarInfosComponent
            marca={marca}
            modelo={modelo}
            versao={versao}
            setMarca={setMarca}
            setModelo={setModelo}
            setVersao={setVersao}
          />

          <Text style={styles.formXtext}>X</Text>

          <CarInfosComponent
            marca={marca2}
            modelo={modelo2}
            versao={versao2}
            setMarca={setMarca2}
            setModelo={setModelo2}
            setVersao={setVersao2}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleComparar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Comparar</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
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
    gap: 8,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  formXtext:{
      color: '#FFFFFF',
      fontSize: 12
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