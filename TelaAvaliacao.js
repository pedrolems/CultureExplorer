import React, { useState } from 'react';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  View, Text, TouchableOpacity, TextInput,
  ImageBackground, ScrollView, SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { styles, C } from './Styles';
import {
  getCurrentUser, getDocument, setDocument,
} from './FirebaseConfig';

export default function TelaAvaliacao({ navigation, route }) {
  const local = route?.params?.local;
  const tipoLogin = route?.params?.tipoLogin || 'visitante';

  const [aspectos, setAspectos] = useState({
    estrutura: 4,
    atendimento: 5,
    acessibilidade: 3,
  });
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!local) {
    return (
      <SafeAreaView style={styles.avalContainer}>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>
          Nenhum local selecionado.
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: C.accent, textAlign: 'center', marginTop: 16 }}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const media = (aspectos.estrutura + aspectos.atendimento + aspectos.acessibilidade) / 3;
  const mediaFinal = Math.round(media);
  const mediaLocal =
    local.totalAvaliacoes > 0
      ? (local.somaNotas / local.totalAvaliacoes).toFixed(1)
      : local.avaliacao || '—';

  const enviarAvaliacao = async () => {
    const user = getCurrentUser();
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para avaliar.');
      return;
    }

    setEnviando(true);
    try {
      const localId = local.id;

      if (String(localId).startsWith('estatico-')) {
        Alert.alert(
          'Aviso',
          'Este é um local de exemplo e não pode ser avaliado. Avalie um local cadastrado por um admin!'
        );
        setEnviando(false);
        return;
      }

      const localAtual = await getDocument('locais', localId);
      if (!localAtual) {
        Alert.alert('Erro', 'Local não encontrado no banco de dados.');
        setEnviando(false);
        return;
      }

      const somaAntiga = Number(localAtual?.somaNotas || 0);
      const totalAntigo = Number(localAtual?.totalAvaliacoes || 0);
      const minhaAvaliacao = await getDocument(`usuarios/${user.uid}/avaliacoes`, localId);

      let novaSoma, novoTotal;
      if (minhaAvaliacao) {
        const notaAntiga = Number(minhaAvaliacao.nota || 0);
        novaSoma = somaAntiga - notaAntiga + mediaFinal;
        novoTotal = totalAntigo;
      } else {
        novaSoma = somaAntiga + mediaFinal;
        novoTotal = totalAntigo + 1;
      }

      // Atualiza soma/total do local
      await setDocument('locais', localId, {
        ...localAtual,
        somaNotas: novaSoma,
        totalAvaliacoes: novoTotal,
      });

      const dadosAvaliacao = {
        localId,
        localNome: local.nome,
        localCategoria: local.categoria || '',
        userId: user.uid,
        userEmail: user.email,
        nota: mediaFinal,
        estrutura: aspectos.estrutura,
        atendimento: aspectos.atendimento,
        acessibilidade: aspectos.acessibilidade,
        comentario: comentario.trim(),
        avaliadoEm: new Date().toISOString(),
      };

      // 1) Salva na subcoleção do user (pra ele ver no perfil)
      await setDocument(`usuarios/${user.uid}/avaliacoes`, localId, dadosAvaliacao);

      // 2) Salva na coleção raiz "avaliacoes" (pra o admin ver as reviews do local)
      const avaliacaoId = `${user.uid}_${localId}`;
      await setDocument('avaliacoes', avaliacaoId, dadosAvaliacao);

      // 3) Marca como visitado
      await setDocument(`usuarios/${user.uid}/visitados`, localId, {
        localId,
        localNome: local.nome,
        localCategoria: local.categoria || '',
        visitadoEm: new Date().toISOString(),
      });

      navigation.navigate('FeedPrincipal', {
        tipoLogin,
        toast: 'Avaliação enviada',
      });
    } catch (e) {
      Alert.alert(
        'Erro ao avaliar',
        e.message || 'Não foi possível enviar a avaliação.'
      );
    } finally {
      setEnviando(false);
    }
  };

  const renderStars = (value, onPress = null, size = 24) =>
    [1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity key={star} onPress={() => onPress && onPress(star)} disabled={!onPress}>
        <MaterialIcons name="star" size={size} color={star <= value ? C.starAlt : '#444'} />
      </TouchableOpacity>
    ));

  return (
    <ScrollView style={styles.avalContainer}>
      <ImageBackground
        source={{
          uri: local.imagem || 'https://images.unsplash.com/photo-1548518176-89ee8ea83e8a?w=640&q=80',
        }}
        style={styles.avalHeader}
      >
        <View style={styles.avalOverlay}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.avalBotaoVoltar}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
            <Text style={styles.avalBotaoVoltarTexto}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.avalTitulo}>Avaliar Local</Text>
          <Text style={styles.avalNome}>{local.nome}</Text>
          <Text style={styles.avalLocalText}>{local.local}</Text>
          <View style={styles.avalMedia}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="star" size={14} color={C.starAlt} style={{ marginRight: 4 }} />
              <Text style={styles.avalMediaTexto}>
                {mediaLocal} • {local.totalAvaliacoes || 0} avaliações
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.avalCard}>
        <Text style={styles.avalSubtitulo}>Sua avaliação</Text>
        <View style={styles.avalEstrelas}>{renderStars(mediaFinal, null, 32)}</View>
        <Text style={styles.avalHint}>Baseado nos aspectos avaliados</Text>

        <Text style={styles.avalSection}>ASPECTOS</Text>
        {['estrutura', 'atendimento', 'acessibilidade'].map((item) => (
          <View key={item} style={styles.avalAspectoRow}>
            <Text style={styles.avalAspectoTexto}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              {renderStars(aspectos[item], (val) =>
                setAspectos({ ...aspectos, [item]: val })
              )}
            </View>
          </View>
        ))}

        <Text style={styles.avalSection}>COMENTÁRIO</Text>
        <TextInput
          placeholder="Descreva sua experiência..."
          placeholderTextColor="#888"
          style={styles.avalInput}
          multiline
          value={comentario}
          onChangeText={setComentario}
        />

        <TouchableOpacity style={styles.btnPrimary} onPress={enviarAvaliacao} disabled={enviando}>
          {enviando
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnPrimaryText}>ENVIAR</Text>
          }
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}