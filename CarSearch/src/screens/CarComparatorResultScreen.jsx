import {
    Image,
    KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'

import { useRoute } from "@react-navigation/native";


export default function CarComparatorResultScreen({navigation}){
    const route = useRoute();

    const { marca, modelo, versao,marca2, modelo2, versao2 } = route.params;

    const carro = {
      marca,
      modelo,
      versao,
    };

    const carro2 = {
      marca2,
      modelo2,
      versao2,
    };

    return(
        <KeyboardAvoidingView
              style={styles.container}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <ScrollView>
              <Image
                source={require("../../assets/fordLogo.png")}
                style={styles.logo}
              />

                <View style={styles.header}>
                    <View style={styles.carView}>
                       <Text style={styles.title}>
                            {marca.toUpperCase()}
                          </Text>
                          <Text style={styles.subtitle}>
                            {modelo} {versao}
                          </Text> 
                    </View>
                          
                    <Text style={styles.formXtext}>X</Text>
                          
                    <View style={styles.carView}>
                        <Text style={styles.title}>
                            {marca2.toUpperCase()}
                          </Text>
                          <Text style={styles.subtitle}>
                            {modelo2} {versao2}
                          </Text>
                    </View>
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
  formXtext:{
      color: '#FFFFFF',
      fontSize: 20
  },
  logo: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10
  },

    header: {
    alignItems: "center",
    justifyContent: 'center',
    marginBottom: 25,
    flexDirection: 'row',

    gap: 40
  },

  carView:{
    justifyContent: 'center',
    alignItems: 'center'
  },

  title: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 2,
  },

  subtitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },

})