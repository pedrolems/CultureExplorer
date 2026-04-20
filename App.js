import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// IMPORTANDO SUAS TELAS
import TelaCadastro from './TelaCadastro';
import TelaCadastrarLocal from './TelaCadastrarLocal';

// Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Cadastro">

        {/* Tela inicial */}
        <Stack.Screen
          name="Cadastro"
          component={TelaCadastro}
          options={{ headerShown: false }}
        />

        {/* Tela de cadastrar local */}
        <Stack.Screen
          name="CadastrarLocal"
          component={TelaCadastrarLocal}
          options={{ title: 'Novo Local' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}