import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Image, TextInput,
  SafeAreaView, StatusBar, Animated, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles, C } from './Styles';
import { listDocuments, getCurrentUser, setDocument, deleteDocument, getDocument } from './FirebaseConfig';

export default function TelaFeedPrincipal({ navigation, route }) {
  const tipoLogin = route?.params?.tipoLogin || 'visitante';
  const usuario = route?.params?.usuario || 'Visitante';
  const toastMessage = route?.params?.toast || null;

  const [mostrarBusca, setMostrarBusca] = useState(false);
  const [pesquisa, setPesquisa] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [dados, setDados] = useState([]);
  const [salvosIds, setSalvosIds] = useState([]);

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const [toastVisible, setToastVisible] = useState(false);
  const [toastText, setToastText] = useState('');

  const showToast = (msg) => {
    setToastText(msg);
    setToastVisible(true);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => setToastVisible(false));
  };

  const carregarLocais = useCallback(async () => {
    try {
      const user = getCurrentUser();
      const locaisFirestore = await listDocuments('locais');
      let filtrados = locaisFirestore.filter((l) => l.ativo !== false);

      if (user && tipoLogin !== 'admin') {
        try {
          const salvos = await listDocuments(`usuarios/${user.uid}/salvos`);
          setSalvosIds(salvos.map((s) => s.localId || s.id));
        } catch (e) { /* ignora */ }
      }

      setDados(filtrados);
    } catch (e) {
      console.warn('Erro ao carregar locais:', e);
      setDados([]);
    }
  }, [tipoLogin]);

  useFocusEffect(
    useCallback(() => {
      carregarLocais();
    }, [carregarLocais])
  );

  useEffect(() => {
    if (toastMessage) {
      showToast(toastMessage);
      navigation.setParams({ toast: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastMessage]);

  const categorias = [
    { nome: 'Todos', icone: 'apps' },
    { nome: 'Teatro', icone: 'theater-comedy' },
    { nome: 'Cinema', icone: 'movie' },
    { nome: 'Museu', icone: 'museum' },
    { nome: 'Evento', icone: 'event' },
  ];

  const dadosFiltrados = dados.filter((item) => {
    const texto = pesquisa.toLowerCase();
    const bateBusca =
      item.nome?.toLowerCase().includes(texto) ||
      item.categoria?.toLowerCase().includes(texto);
    const bateCategoria = categoriaAtiva === 'Todos' || item.categoria === categoriaAtiva;
    return bateBusca && bateCategoria;
  });

  // Não passa nome no param — deixa a tela de perfil buscar do Firestore
  const irParaPerfil = () => {
    if (tipoLogin === 'admin') {
      navigation.navigate('PerfilAdmin', { tipoLogin });
    } else {
      navigation.navigate('PerfilVisitante', { tipoLogin });
    }
  };

  const calcularMedia = (item) => {
    if (item.totalAvaliacoes > 0) {
      return (item.somaNotas / item.totalAvaliacoes).toFixed(1);
    }
    return '—';
  };

  const podeAvaliar = (item) => {
    const user = getCurrentUser();
    if (!user) return false;
    return item.criadoPor !== user.uid;
  };

  const handleClicarLocal = (item) => {
    if (!podeAvaliar(item)) {
      Alert.alert(
        'Aviso',
        'Você não pode avaliar um local que cadastrou.'
      );
      return;
    }
    navigation.navigate('Avaliacao', { local: item, tipoLogin });
  };

  const toggleSalvar = async (item) => {
    const user = getCurrentUser();
    if (!user) return;
    const jaSalvo = salvosIds.includes(item.id);
    try {
      if (jaSalvo) {
        await deleteDocument(`usuarios/${user.uid}/salvos`, item.id);
        setSalvosIds((prev) => prev.filter((id) => id !== item.id));
        showToast('Removido dos salvos');
      } else {
        await setDocument(`usuarios/${user.uid}/salvos`, item.id, {
          localId: item.id,
          localNome: item.nome,
          localCategoria: item.categoria || '',
          salvoEm: new Date().toISOString(),
        });
        setSalvosIds((prev) => [...prev, item.id]);
        showToast('Salvo!');
      }
    } catch (e) {
      console.warn('Erro ao salvar:', e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bgAlt }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bgAlt} />
      <View style={styles.feedContainer}>

        {toastVisible && (
          <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
            <MaterialCommunityIcons name="check-circle-outline" size={20} color="#fff" />
            <Text style={styles.toastText}>{toastText}</Text>
          </Animated.View>
        )}

        <View style={styles.feedHeaderContainer}>
          <View>
            <Text style={styles.feedBoasVindas}>Olá, {usuario}</Text>
            <Text style={styles.feedTitulo}>Cultura Explorer</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <TouchableOpacity style={styles.feedBotaoBusca} onPress={() => setMostrarBusca(!mostrarBusca)}>
              <MaterialIcons name="search" size={20} color={C.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.feedAvatarBtn} onPress={irParaPerfil}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>
                {usuario.charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {mostrarBusca && (
          <TextInput
            style={styles.feedInputBusca}
            placeholder="Pesquisar espaço cultural..."
            placeholderTextColor={C.mutedAlt}
            value={pesquisa}
            onChangeText={setPesquisa}
          />
        )}

        <View style={styles.feedCategorias}>
          {categorias.map((cat) => {
            const ativo = cat.nome === categoriaAtiva;
            return (
              <TouchableOpacity
                key={cat.nome}
                onPress={() => setCategoriaAtiva(cat.nome)}
                style={ativo ? styles.feedCategoriaAtiva : styles.feedCategoria}
              >
                <MaterialIcons name={cat.icone} size={16} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={{ color: '#FFF' }}>{cat.nome}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={dadosFiltrados}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const ehMeuLocal = !podeAvaliar(item);
            const estaSalvo = salvosIds.includes(item.id);

            return (
              <View style={styles.feedCard}>
                <TouchableOpacity onPress={() => handleClicarLocal(item)}>
                  {item.imagem && (
                    <Image source={{ uri: item.imagem }} style={styles.feedCardImagem} />
                  )}
                  <View style={styles.feedCardInfo}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.feedCardTitulo}>{item.nome}</Text>
                        <Text style={styles.feedCardLocal}>📍 {item.local}</Text>
                        <Text style={styles.feedCardAvaliacao}>
                          ⭐ {calcularMedia(item)} • {item.totalAvaliacoes || 0} avaliações
                        </Text>
                      </View>

                      {tipoLogin !== 'admin' && !ehMeuLocal && (
                        <TouchableOpacity
                          onPress={() => toggleSalvar(item)}
                          style={{
                            padding: 8,
                            borderRadius: 12,
                            backgroundColor: estaSalvo ? C.accentSoft : 'rgba(255,255,255,0.05)',
                            borderWidth: 0.5,
                            borderColor: estaSalvo ? C.accent : C.border,
                          }}
                        >
                          <MaterialCommunityIcons
                            name={estaSalvo ? 'bookmark' : 'bookmark-outline'}
                            size={20}
                            color={estaSalvo ? C.accent : C.muted}
                          />
                        </TouchableOpacity>
                      )}

                      {ehMeuLocal && (
                        <View style={{
                          backgroundColor: C.purpleSoft,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 8,
                        }}>
                          <Text style={{ color: C.purple, fontSize: 10, fontWeight: '700' }}>SEU</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={{ paddingTop: 40, alignItems: 'center' }}>
              <Text style={{ color: C.muted, fontSize: 14 }}>Nenhum local disponível ainda.</Text>
            </View>
          }
        />

        {tipoLogin === 'admin' && (
          <TouchableOpacity
            style={[styles.btnGreen, { marginTop: 8 }]}
            onPress={() => navigation.navigate('CadastrarLocal')}
          >
            <MaterialCommunityIcons name="plus" size={18} color="#fff" />
            <Text style={styles.btnGreenText}>Cadastrar Local</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}