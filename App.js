import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Criando a Tela Inicial
function TelaInicial({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Esta é a Tela Inicial 🏠</Text>
      {/* O botão usa a prop 'navigation' para empilhar a próxima tela */}
      <Button
        title="Ir para Detalhes"
        onPress={() => navigation.navigate('Detalhes')}
      />
    </View>
  );
}

// 2. Criando a Tela de Detalhes
function TelaDetalhes({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Esta é a Tela de Detalhes 📄</Text>
      {/* O botão usa 'goBack' para tirar essa tela do topo da pilha */}
      <Button 
        title="Voltar" 
        onPress={() => navigation.goBack()} 
      />
    </View>
  );
}

// 3. Configurando o Navegador (O "Baralho")
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicial">
        {/* Registrando as telas no nosso Stack */}
        <Stack.Screen name="Inicial" component={TelaInicial} options={{ title: 'Início' }} />
        <Stack.Screen name="Detalhes" component={TelaDetalhes} options={{ title: 'Mais Informações' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  texto: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  }
});