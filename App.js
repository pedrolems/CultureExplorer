import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaLogin from './src/pages/TelaLogin';
import TelaCadastro from './src/pages/TelaCadastro';
import TelaFeedPrincipal from './src/pages/TelaFeedPrincipal';
import TelaPerfilAdmin from './src/pages/TelaPerfilAdmin';
import TelaPerfilVisit from './src/pages/TelaPerfilVisit';
import TelaCadastrarLocal from './src/pages/TelaCadastrarLocal';
import TelaAvaliacao from './src/pages/TelaAvaliacao';
import TelaHistorico from './src/pages/TelaHistorico';
import TelaConfigPerfil from './src/pages/TelaConfigPerfil';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {/* Autenticação */}
        <Stack.Screen name="Login" component={TelaLogin} />
        <Stack.Screen name="Cadastro" component={TelaCadastro} />

        {/* Feed principal */}
        <Stack.Screen name="FeedPrincipal" component={TelaFeedPrincipal} />

        {/* Perfis (visitante ou admin, conforme tipoLogin passado por params) */}
        <Stack.Screen name="PerfilVisitante" component={TelaPerfilVisit} />
        <Stack.Screen name="PerfilAdmin" component={TelaPerfilAdmin} />

        {/* Cadastro de local (só admin) */}
        <Stack.Screen name="CadastrarLocal" component={TelaCadastrarLocal} />

        {/* Avaliação de local */}
        <Stack.Screen name="Avaliacao" component={TelaAvaliacao} />

        {/* Histórico (visitante: próprias avaliações / admin: avaliações dos seus locais) */}
        <Stack.Screen name="Historico" component={TelaHistorico} />

        {/* Configuração de perfil */}
        <Stack.Screen name="ConfigPerfil" component={TelaConfigPerfil} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}