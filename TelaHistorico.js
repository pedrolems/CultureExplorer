import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { styles } from './Styles';

export default function TelaHistorico({ navigation }) {
  const [avaliacoes] = useState([
    { id: '1', nome: 'JOSÉ', estrelas: 3, comentario: 'Mais ou menos!' },
    { id: '2', nome: 'PEDRO', estrelas: 4, comentario: 'Muito bom!' },
    { id: '3', nome: 'JOÃO', estrelas: 3, comentario: 'Mais ou menos!' },
    { id: '4', nome: 'MIGUEL', estrelas: 5, comentario: 'Excelente experiência!' },
  ]);

  const renderEstrelas = (qtd) => {
    let estrelas = [];
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <Ionicons 
          key={i} 
          name="star" 
          size={16} 
          color={i <= qtd ? "#FFD700" : "#444"} 
        />
      );
    }
    return <View style={styles.rowEstrelas}>{estrelas}</View>;
  };

  return (
    <View style={styles.container_principal}>
      <StatusBar style="light" />

      {/* Botão de Voltar */}
      <TouchableOpacity 
        style={styles.botaoVoltar} 
        onPress={() => navigation?.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.containerTeatro}>
          <View style={styles.molduraImagem}>
            <MaterialCommunityIcons name="theater" size={70} color="#1e49e2" />
            <Text style={styles.textoTeatroHeader}>TEATRO MUNICIPAL</Text>
          </View>
          <Text style={styles.tituloSecao}>SUAS AVALIAÇÕES: </Text>
        </View>

        {avaliacoes.map((item) => (
          <View key={item.id} style={styles.cardHistorico}>
            <View style={styles.headerCard}>
              <Text style={styles.nomeUsuario}>{item.nome}</Text>
              {renderEstrelas(item.estrelas)}
            </View>
            
            <View style={styles.caixaComentario}>
              <Text style={styles.textoComentario}>"{item.comentario}"</Text>
            </View>
          </View>
        ))}

        <MaterialCommunityIcons 
          name="dots-horizontal" 
          size={35} 
          color="#1e49e2" 
          style={{ marginTop: 20, marginBottom: 10 }} 
        />
        
      </ScrollView>
    </View>
  );
}