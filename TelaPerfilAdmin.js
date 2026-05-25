import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { C, styles } from './Styles';
import { StatCard, SectionTitle, StarRow, Tag, IconBtn } from './components/Component';
import {
  getCurrentUser, listDocuments, deleteDocument, getDocument, setDocument,
} from './FirebaseConfig';

const categoriaIcon = {
  Teatro: '🎭',
  Cinema: '🎬',
  Museu: '🏛️',
  Evento: '🎉',
  Show: '🎤',
};

// Cascade delete: apaga referências do local em todas as subcoleções dos users
async function apagarReferenciasLocal(localId) {
  try {
    const usuarios = await listDocuments('usuarios');
    for (const u of usuarios) {
      // tenta apagar em cada subcoleção (ignora 404)
      try { await deleteDocument(`usuarios/${u.id}/visitados`, localId); } catch (e) {}
      try { await deleteDocument(`usuarios/${u.id}/salvos`, localId); } catch (e) {}
      try { await deleteDocument(`usuarios/${u.id}/avaliacoes`, localId); } catch (e) {}
      // Apaga da coleção raiz de avaliações
      try { await deleteDocument('avaliacoes', `${u.id}_${localId}`); } catch (e) {}
    }
  } catch (e) {
    console.warn('Erro ao apagar referências:', e);
  }
}

export default function TelaPerfilAdmin({ navigation, route }) {
  const [meusLocais, setMeusLocais] = useState([]);
  const [deletando, setDeletando] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [carregando, setCarregando] = useState(true); // ← LOADING INICIAL
  const tipoLogin = route?.params?.tipoLogin || 'admin';

  const carregarDados = useCallback(async () => {
    const user = getCurrentUser();
    if (!user) {
      setCarregando(false);
      return;
    }
    try {
      const [todos, dadosUser] = await Promise.all([
        listDocuments('locais'),
        getDocument('usuarios', user.uid),
      ]);
      const meus = todos.filter((loc) => loc.criadoPor === user.uid);
      setMeusLocais(meus);
      setNome(dadosUser?.nome || user.email?.split('@')[0] || 'Admin');
      setEmail(user.email || '');
      setFotoPerfil(dadosUser?.fotoPerfil || '');
    } catch (e) {
      console.warn('Erro ao carregar dados:', e);
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
          alert('Imagem muito grande, escolha outra menor');
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

  const handleExcluir = async (local) => {
    setDeletando(local.id);
    try {
      // 1) Apaga o local
      await deleteDocument('locais', local.id);
      // 2) Apaga as referências em todos os usuários (visitados, salvos, avaliações)
      await apagarReferenciasLocal(local.id);
      // 3) Tira da lista local
      setMeusLocais((prev) => prev.filter((l) => l.id !== local.id));
    } catch (e) {
      console.warn(e);
    } finally {
      setDeletando(null);
    }
  };

  const toggleAtivo = async (local) => {
    const novoStatus = local.ativo === false ? true : false;
    try {
      await setDocument('locais', local.id, { ...local, ativo: novoStatus });
      setMeusLocais((prev) =>
        prev.map((l) => l.id === local.id ? { ...l, ativo: novoStatus } : l)
      );
    } catch (e) {
      console.warn('Erro ao ativar/desativar:', e);
    }
  };

  const verReviews = (local) => {
    navigation.navigate('ReviewsLocal', { local });
  };

  // LOADING INICIAL — evita mostrar conteúdo errado antes dos dados chegarem
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

  const totalLocais = meusLocais.length;
  const totalAvaliacoes = meusLocais.reduce((s, l) => s + Number(l.totalAvaliacoes || 0), 0);
  const somaTotal = meusLocais.reduce((s, l) => s + Number(l.somaNotas || 0), 0);
  const mediaGeral = totalAvaliacoes > 0 ? (somaTotal / totalAvaliacoes).toFixed(1) : '—';
  const iniciais = (nome || 'AD').slice(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <View style={[styles.headerGradient, { backgroundColor: '#0e0b1f' }]}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={30} color={C.text} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Olá, {nome}</Text>
          <IconBtn icon="⚙️" onPress={() => navigation.navigate('ConfigPerfil', { tipoLogin })} />
        </View>

        <View style={styles.profileCenter}>
          <TouchableOpacity onPress={handleTrocarFoto}>
            <View style={[styles.avatarRing, { borderColor: 'rgba(139,92,246,0.4)', position: 'relative' }]}>
              {fotoPerfil ? (
                <Image source={{ uri: fotoPerfil }} style={{ width: 72, height: 72, borderRadius: 36 }} />
              ) : (
                <View style={{
                  width: 72, height: 72, borderRadius: 36,
                  backgroundColor: C.purple,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>{iniciais}</Text>
                </View>
              )}
              <View style={{
                position: 'absolute',
                bottom: 0, right: 0,
                backgroundColor: C.purple,
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

          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>ADMINISTRADOR</Text>
          </View>

          <View style={styles.statsRow}>
            <StatCard value={String(totalLocais)} label="Locais" />
            <View style={styles.statDivider} />
            <StatCard value={mediaGeral} label="Média" />
            <View style={styles.statDivider} />
            <StatCard value={String(totalAvaliacoes)} label="Avaliações" />
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 32 }}>

        <TouchableOpacity
          style={[styles.btnGreen, { marginTop: 8 }]}
          onPress={() => navigation.navigate('CadastrarLocal')}
        >
          <MaterialCommunityIcons name="plus" size={18} color="#fff" />
          <Text style={styles.btnGreenText}>Cadastrar Local</Text>
        </TouchableOpacity>

        <SectionTitle>Meus Locais Cadastrados</SectionTitle>

        {meusLocais.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 32 }}>🏛️</Text>
            <Text style={styles.emptyText}>Nenhum local cadastrado por você.</Text>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {meusLocais.map((local) => {
              const totalAv = Number(local.totalAvaliacoes || 0);
              const media = totalAv > 0 ? (Number(local.somaNotas) / totalAv).toFixed(1) : '—';
              const estouDeletando = deletando === local.id;
              const localAtivo = local.ativo !== false;

              return (
                <View
                  key={local.id}
                  style={{
                    backgroundColor: C.surface,
                    borderWidth: 0.5,
                    borderColor: C.border,
                    borderRadius: 18,
                    padding: 14,
                    opacity: localAtivo ? 1 : 0.55,
                  }}
                >
                  <TouchableOpacity activeOpacity={0.7} onPress={() => verReviews(local)}>
                    <View style={styles.adminLocalRow}>
                      <View style={styles.adminLocalIcon}>
                        <Text style={{ fontSize: 20 }}>{categoriaIcon[local.categoria] || '📍'}</Text>
                      </View>
                      <View style={{ flex: 1, gap: 4 }}>
                        <Text style={styles.adminLocalName} numberOfLines={1}>{local.nome}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          {local.categoria ? <Tag label={local.categoria} /> : null}
                          <View style={[styles.statusBadge, {
                            backgroundColor: localAtivo ? C.greenSoft : 'rgba(245,158,11,0.2)',
                          }]}>
                            <Text style={{
                              color: localAtivo ? C.green : C.star,
                              fontSize: 10, fontWeight: '700',
                            }}>
                              {localAtivo ? '● Ativo' : '○ Desativado'}
                            </Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <StarRow rating={Math.round(Number(media) || 0)} />
                          <Text style={{ color: C.muted, fontSize: 11 }}>
                            {media} · {totalAv} avaliações
                          </Text>
                        </View>
                      </View>
                      <MaterialCommunityIcons name="chevron-right" size={22} color={C.muted} />
                    </View>
                  </TouchableOpacity>

                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => toggleAtivo(local)}
                      style={{
                        flex: 1,
                        backgroundColor: localAtivo ? 'rgba(245,158,11,0.15)' : C.greenSoft,
                        borderWidth: 0.5,
                        borderColor: localAtivo ? C.star + '66' : C.green + '66',
                        borderRadius: 10,
                        paddingVertical: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <MaterialCommunityIcons
                        name={localAtivo ? 'eye-off-outline' : 'eye-outline'}
                        size={16}
                        color={localAtivo ? C.star : C.green}
                      />
                      <Text style={{
                        color: localAtivo ? C.star : C.green,
                        fontSize: 12, fontWeight: '700',
                      }}>
                        {localAtivo ? 'Desativar' : 'Ativar'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleExcluir(local)}
                      disabled={estouDeletando}
                      style={{
                        flex: 1,
                        backgroundColor: estouDeletando ? '#444' : C.redSoft,
                        borderWidth: 0.5,
                        borderColor: C.red + '66',
                        borderRadius: 10,
                        paddingVertical: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <MaterialCommunityIcons name="trash-can-outline" size={16} color={C.red} />
                      <Text style={{ color: C.red, fontSize: 12, fontWeight: '700' }}>
                        {estouDeletando ? 'Excluindo...' : 'Excluir'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}