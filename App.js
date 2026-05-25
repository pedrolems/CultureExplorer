import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaLogin from './TelaLogin';
import TelaCadastro from './TelaCadastro';
import TelaFeedPrincipal from './TelaFeedPrincipal';
import TelaPerfilAdmin from './TelaPerfilAdmin';
import TelaPerfilVisit from './TelaPerfilVisit';
import TelaCadastrarLocal from './TelaCadastrarLocal';
import TelaAvaliacao from './TelaAvaliacao';
import TelaHistorico from './TelaHistorico';
import TelaConfigPerfil from './TelaConfigPerfil';
import TelaBusca from './TelaBusca';
import TelaRedefSenha from './TelaRedefSenha';
import TelaReviewsLocal from './TelaReviewsLocal';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={TelaLogin} />
        <Stack.Screen name="Cadastro" component={TelaCadastro} />
        <Stack.Screen name="RedefSenha" component={TelaRedefSenha} />
        <Stack.Screen name="FeedPrincipal" component={TelaFeedPrincipal} />
        <Stack.Screen name="Busca" component={TelaBusca} />
        <Stack.Screen name="PerfilVisitante" component={TelaPerfilVisit} />
        <Stack.Screen name="PerfilAdmin" component={TelaPerfilAdmin} />
        <Stack.Screen name="CadastrarLocal" component={TelaCadastrarLocal} />
        <Stack.Screen name="Avaliacao" component={TelaAvaliacao} />
        <Stack.Screen name="Historico" component={TelaHistorico} />
        <Stack.Screen name="ConfigPerfil" component={TelaConfigPerfil} />
        <Stack.Screen name="ReviewsLocal" component={TelaReviewsLocal} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}