import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { styles } from '../Styles';

const avaliacoesVisitante = [
  { id: '1', nome: 'JOSÉ', estrelas: 3, comentario: 'Mais ou menos!' },
  { id: '2', nome: 'PEDRO', estrelas: 4, comentario: 'Muito bom!' },
  { id: '3', nome: 'JOÃO', estrelas: 3, comentario: 'Mais ou menos!' },
  { id: '4', nome: 'MIGUEL', estrelas: 5, comentario: 'Excelente experiência!' },
];

const avaliacoesAdmin = [
  { id: '1', nome: 'ANA', estrelas: 5, comentario: 'Adorei o teatro! Perfeito.' },
  { id: '2', nome: 'CARLOS', estrelas: 4, comentario: 'Ótimo espaço, recomendo.' },
  { id: '3', nome: 'LUCIA', estrelas: 3, comentario: 'Bom, mas poderia melhorar.' },
  { id: '4', nome: 'MARCOS', estrelas: 5, comentario: 'Experiência incrível!' },
];

export default function TelaHistorico({ navigation, route }) {
  const tipoLogin = route?.params?.tipoLogin || 'visitante';
  const avaliacoes = tipoLogin === 'admin' ? avaliacoesAdmin : avaliacoesVisitante;
  const titulo = tipoLogin === 'admin'
    ? 'AVALIAÇÕES DO SEU LOCAL'
    : 'SUAS AVALIAÇÕES!';

  const renderEstrelas = (qtd) => {
    let estrelas = [];
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <Ionicons key={i} name="star" size={14} color={i <= qtd ? '#FFD700' : '#555'} />
      );
    }
    return <View style={styles.rowEstrelas}>{estrelas}</View>;
  };

  return (
    <View style={styles.container_principal}>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation?.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 30, paddingBottom: 50, width: '100%' }}>

        <View style={styles.containerTeatro}>
          <View style={styles.molduraImagem}>
            <MaterialCommunityIcons name="theater" size={60} color="#1e49e2" />
            <Text style={styles.textoTeatroHeader}>
              {tipoLogin === 'admin' ? 'TEATRO MUNICIPAL' : 'MEUS LOCAIS'}
            </Text>
          </View>
          <Text style={styles.tituloSecao}>{titulo}</Text>
        </View>

        {avaliacoes.map((item) => (
          <View key={item.id} style={styles.cardHistorico}>
            <View style={styles.headerCard}>
              <Text style={styles.nomeUsuario}>{item.nome}</Text>
              {renderEstrelas(item.estrelas)}
            </View>
            <View style={styles.caixaComentario}>
              <Text style={styles.textoComentario}>{item.comentario}</Text>
            </View>
          </View>
        ))}

        <MaterialCommunityIcons name="dots-horizontal" size={30} color="#1e49e2" style={{ marginTop: 10, marginBottom: 30 }} />

      </ScrollView>
    </View>
  );
}