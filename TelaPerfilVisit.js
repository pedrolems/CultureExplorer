import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { C, styles } from './Styles';
import { StatCard, StarRow, Tag, IconBtn, GlassCard } from './components/Component';
import {
  getCurrentUser, listDocuments, deleteDocument,
  getDocument, setDocument,
} from './FirebaseConfig';

export default function TelaPerfilVisit({ navigation }) {
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviewList, setReviewList] = useState([]);
  const [visitedList, setVisitedList] = useState([]);
  const [savedList, setSavedList] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [carregando, setCarregando] = useState(true); // ← LOADING INICIAL

  const carregarDados = useCallback(async () => {
    const user = getCurrentUser();
    if (!user) {
      setCarregando(false);
      return;
    }
    try {
      // Busca todos os dados em paralelo + lista de locais (pra filtrar os que não existem)
      const [avals, visits, salvos, dadosUser, locais] = await Promise.all([
        listDocuments(`usuarios/${user.uid}/avaliacoes`),
        listDocuments(`usuarios/${user.uid}/visitados`),
        listDocuments(`usuarios/${user.uid}/salvos`),
        getDocument('usuarios', user.uid),
        listDocuments('locais'),
      ]);

      // Conjunto de IDs de locais que ainda existem
      const idsExistentes = new Set(locais.map((l) => l.id));

      // Filtra: só mostra registros de locais que ainda existem
      const avalsValidas = avals.filter((a) => idsExistentes.has(a.localId || a.id));
      const visitsValidos = visits.filter((v) => idsExistentes.has(v.localId || v.id));
      const salvosValidos = salvos.filter((s) => idsExistentes.has(s.localId || s.id));

      setReviewList(avalsValidas);
      setVisitedList(visitsValidos);
      setSavedList(salvosValidos);
      setNome(dadosUser?.nome || user.email?.split('@')[0] || 'Visitante');
      setEmail(user.email || '');
      setFotoPerfil(dadosUser?.fotoPerfil || '');

      // Limpa do banco em background (não bloqueia a UI)
      avals.forEach((a) => {
        const lid = a.localId || a.id;
        if (!idsExistentes.has(lid)) {
          deleteDocument(`usuarios/${user.uid}/avaliacoes`, a.id).catch(() => {});
        }
      });
      visits.forEach((v) => {
        const lid = v.localId || v.id;
        if (!idsExistentes.has(lid)) {
          deleteDocument(`usuarios/${user.uid}/visitados`, v.id).catch(() => {});
        }
      });
      salvos.forEach((s) => {
        const lid = s.localId || s.id;
        if (!idsExistentes.has(lid)) {
          deleteDocument(`usuarios/${user.uid}/salvos`, s.id).catch(() => {});
        }
      });
    } catch (e) {
      console.warn('Erro ao carregar dados do perfil:', e);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const handleTrocarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]?.base64) {
        const dataUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
        if (dataUri.length > 900000) {
          alert('Imagem muito grande');
          return;
        }
        const user = getCurrentUser();
        const dadosUser = await getDocument('usuarios', user.uid);
        await setDocument('usuarios', user.uid, {
          ...dadosUser,
          fotoPerfil: dataUri,
        });
        setFotoPerfil(dataUri);
      }
    } catch (e) {
      console.warn('Erro foto:', e);
    }
  };

  const handleDeleteReview = async (review) => {
    const user = getCurrentUser();
    if (!user) return;
    try {
      const localId = review.localId || review.id;
      const notaQueVouRemover = Number(review.nota || 0);

      await deleteDocument(`usuarios/${user.uid}/avaliacoes`, review.id);

      try {
        await deleteDocument('avaliacoes', `${user.uid}_${localId}`);
      } catch (e) { /* ignora */ }

      const localAtual = await getDocument('locais', localId);
      if (localAtual) {
        const novaSoma = Math.max(0, Number(localAtual.somaNotas || 0) - notaQueVouRemover);
        const novoTotal = Math.max(0, Number(localAtual.totalAvaliacoes || 0) - 1);
        await setDocument('locais', localId, {
          ...localAtual,
          somaNotas: novaSoma,
          totalAvaliacoes: novoTotal,
        });
      }
      setReviewList((prev) => prev.filter((r) => r.id !== review.id));
    } catch (e) {
      console.warn('Erro ao apagar avaliação:', e);
    }
  };

  const handleUnsave = async (id) => {
    const user = getCurrentUser();
    if (!user) return;
    try {
      await deleteDocument(`usuarios/${user.uid}/salvos`, id);
      setSavedList((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.warn(e);
    }
  };

  // LOADING INICIAL
  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={C.accent} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const avgRating = reviewList.length
    ? (reviewList.reduce((s, r) => s + Number(r.nota || 0), 0) / reviewList.length).toFixed(1)
    : '—';

  const renderEmpty = (mensagem, icone) => (
    <View style={styles.emptyState}>
      <Text style={{ fontSize: 32 }}>{icone}</Text>
      <Text style={styles.emptyText}>{mensagem}</Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('FeedPrincipal')}>
        <Text style={{ color: C.accent, fontSize: 13, fontWeight: '600' }}>Explorar locais →</Text>
      </TouchableOpacity>
    </View>
  );

  const iniciais = (nome || 'V').slice(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <View style={styles.headerGradient}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={30} color={C.text} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Olá, {nome}</Text>
          <IconBtn icon="⚙️" onPress={() => navigation.navigate('ConfigPerfil')} />
        </View>

        <View style={styles.profileCenter}>
          <TouchableOpacity onPress={handleTrocarFoto}>
            <View style={[styles.avatarRing, { borderColor: C.accentSoft, position: 'relative' }]}>
              {fotoPerfil ? (
                <Image source={{ uri: fotoPerfil }} style={{ width: 72, height: 72, borderRadius: 36 }} />
              ) : (
                <View style={{
                  width: 72, height: 72, borderRadius: 36,
                  backgroundColor: C.blue,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>{iniciais}</Text>
                </View>
              )}
              <View style={{
                position: 'absolute',
                bottom: 0, right: 0,
                backgroundColor: C.blue,
                borderRadius: 12,
                width: 24, height: 24,
                alignItems: 'center', justifyContent: 'center',
                borderWidth: 2, borderColor: C.bg,
              }}>
                <MaterialCommunityIcons name="camera" size={12} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{nome}</Text>
          <Text style={styles.profileHandle}>{email}</Text>

          <View style={styles.statsRow}>
            <StatCard value={String(reviewList.length)} label="Avaliações" />
            <View style={styles.statDivider} />
            <StatCard value={String(visitedList.length)} label="Visitados" />
            <View style={styles.statDivider} />
            <StatCard value={avgRating} label="Nota média" />
          </View>
        </View>

        <View style={styles.tabRow}>
          {['reviews', 'visited', 'saved'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'reviews' ? 'Avaliações' : tab === 'visited' ? 'Visitados' : 'Salvos'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 32 }}>

        {activeTab === 'reviews' && (
          <View style={{ gap: 12 }}>
            {reviewList.length === 0 ? (
              renderEmpty('Nenhum local avaliado ainda.', '⭐')
            ) : (
              reviewList.map((r) => (
                <GlassCard key={r.id} style={{ gap: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={styles.reviewLocalName}>{r.localNome}</Text>
                      {r.localCategoria ? <Tag label={r.localCategoria} /> : null}
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <StarRow rating={Number(r.nota || 0)} />
                    </View>
                  </View>
                  {r.comentario ? (
                    <Text style={styles.reviewComment}>"{r.comentario}"</Text>
                  ) : null}
                  <View style={styles.reviewActions}>
                    <TouchableOpacity
                      style={[styles.reviewActionBtn, { borderColor: C.redSoft }]}
                      onPress={() => handleDeleteReview(r)}
                    >
                      <Text style={{ color: C.red, fontSize: 12 }}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              ))
            )}
          </View>
        )}

        {activeTab === 'visited' && (
          <View style={{ gap: 12 }}>
            {visitedList.length === 0 ? (
              renderEmpty('Nenhum local visitado ainda.', '📍')
            ) : (
              visitedList.map((v) => (
                <GlassCard key={v.id}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{
                      width: 48, height: 48, borderRadius: 14,
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      borderWidth: 0.5, borderColor: C.border,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Text style={{ fontSize: 22 }}>📍</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewLocalName}>{v.localNome}</Text>
                      {v.localCategoria ? <Tag label={v.localCategoria} /> : null}
                    </View>
                  </View>
                </GlassCard>
              ))
            )}
          </View>
        )}

        {activeTab === 'saved' && (
          <View style={{ gap: 12 }}>
            {savedList.length === 0 ? (
              renderEmpty('Nenhum local salvo ainda.', '🔖')
            ) : (
              savedList.map((s) => (
                <GlassCard key={s.id}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{
                      width: 48, height: 48, borderRadius: 14,
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      borderWidth: 0.5, borderColor: C.border,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Text style={{ fontSize: 22 }}>🔖</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewLocalName}>{s.localNome}</Text>
                      {s.localCategoria ? <Tag label={s.localCategoria} /> : null}
                    </View>
                    <TouchableOpacity
                      onPress={() => handleUnsave(s.id)}
                      style={{
                        padding: 9, borderRadius: 10,
                        backgroundColor: C.redSoft,
                        borderWidth: 0.5,
                        borderColor: 'rgba(239,68,68,0.3)',
                      }}>
                      <MaterialCommunityIcons name="trash-can-outline" size={16} color={C.red} />
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              ))
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}