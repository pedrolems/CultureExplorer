import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function TelaAvaliacao({ navigation, route }) {
  const local = route?.params?.local;
  const tipoLogin = route?.params?.tipoLogin || 'visitante';

  if (!local) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>
          Nenhum local selecionado.
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#38bdf8', textAlign: 'center', marginTop: 16 }}>← Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const [aspectos, setAspectos] = useState({
    estrutura: 4,
    atendimento: 5,
    acessibilidade: 3,
  });
  const [comentario, setComentario] = useState('');

  const media = (aspectos.estrutura + aspectos.atendimento + aspectos.acessibilidade) / 3;
  const mediaFinal = Math.round(media);
  const mediaLocal = local.totalAvaliacoes > 0
    ? (local.somaNotas / local.totalAvaliacoes).toFixed(1)
    : local.avaliacao || '—';

  const enviarAvaliacao = () => {
    navigation.navigate('Historico', { tipoLogin });
  };

  const renderStars = (value, onPress = null, size = 24) =>
    [1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity key={star} onPress={() => onPress && onPress(star)} disabled={!onPress}>
        <MaterialIcons name="star" size={size} color={star <= value ? '#FFC107' : '#444'} />
      </TouchableOpacity>
    ));

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <ImageBackground
        source={{ uri: local.imagem || 'https://images.unsplash.com/photo-1548518176-89ee8ea83e8a?w=640&q=80' }}
        style={styles.header}
      >
        <View style={styles.overlay}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
            <Feather name="arrow-left" size={20} color="#fff" />
            <Text style={styles.botaoVoltarTexto}>Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.titulo}>Avaliar Local</Text>
          <Text style={styles.nome}>{local.nome}</Text>
          <Text style={styles.localText}>{local.local}</Text>

          <View style={styles.media}>
            <Text style={styles.mediaTexto}>
              ⭐ {mediaLocal} • {local.totalAvaliacoes} avaliações
            </Text>
          </View>
        </View>
      </ImageBackground>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.subtitulo}>Sua avaliação</Text>

        <View style={styles.estrelas}>
          {renderStars(mediaFinal, null, 32)}
        </View>

        <Text style={styles.hint}>Baseado nos aspectos avaliados</Text>

        <Text style={styles.section}>ASPECTOS</Text>

        {['estrutura', 'atendimento', 'acessibilidade'].map((item) => (
          <View key={item} style={styles.aspectoRow}>
            <Text style={styles.aspectoTexto}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              {renderStars(aspectos[item], (val) => setAspectos({ ...aspectos, [item]: val }))}
            </View>
          </View>
        ))}

        <Text style={styles.section}>COMENTÁRIO</Text>

        <TextInput
          placeholder="Descreva sua experiência..."
          placeholderTextColor="#888"
          style={styles.input}
          multiline
          value={comentario}
          onChangeText={setComentario}
        />

        <TouchableOpacity style={styles.botao} onPress={enviarAvaliacao}>
          <Text style={styles.botaoTexto}>⭐ Enviar Avaliação</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F1A' },
  header: { height: 250, justifyContent: 'flex-end' },
  overlay: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  botaoVoltar: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  botaoVoltarTexto: { color: '#fff', marginLeft: 6, fontSize: 14 },
  titulo: { color: '#ccc', fontSize: 14, marginBottom: 5 },
  nome: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  localText: { color: '#aaa', marginTop: 5 },
  media: { marginTop: 10 },
  mediaTexto: { color: '#FFC107' },
  card: { backgroundColor: '#121826', margin: 16, borderRadius: 20, padding: 20 },
  subtitulo: { color: '#fff', fontSize: 18, marginBottom: 10 },
  estrelas: { flexDirection: 'row', marginBottom: 5 },
  hint: { color: '#888', fontSize: 12, marginBottom: 20 },
  section: { color: '#888', marginTop: 10, marginBottom: 10, fontWeight: 'bold' },
  aspectoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  aspectoTexto: { color: '#fff' },
  input: {
    backgroundColor: '#1E2638', borderRadius: 12, padding: 15,
    height: 100, color: '#fff', textAlignVertical: 'top', marginBottom: 20,
  },
  botao: { backgroundColor: '#2F6BFF', padding: 15, borderRadius: 12, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
});