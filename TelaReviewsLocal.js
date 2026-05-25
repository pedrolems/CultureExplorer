import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles, C } from './Styles';
import { listDocuments } from './FirebaseConfig';

export default function TelaReviewsLocal({ navigation, route }) {
  const local = route?.params?.local;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarReviews = useCallback(async () => {
    if (!local) return;
    setLoading(true);
    try {
      const todas = await listDocuments('avaliacoes');
      const doLocal = todas.filter((r) => r.localId === local.id);
      doLocal.sort((a, b) => (b.avaliadoEm || '').localeCompare(a.avaliadoEm || ''));
      setReviews(doLocal);
    } catch (e) {
      console.warn('Erro ao carregar reviews:', e);
    } finally {
      setLoading(false);
    }
  }, [local]);

  useFocusEffect(
    useCallback(() => {
      carregarReviews();
    }, [carregarReviews])
  );

  if (!local) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>
          Nenhum local selecionado.
        </Text>
      </SafeAreaView>
    );
  }

  const totalAvaliacoes = reviews.length;
  const media = totalAvaliacoes > 0
    ? (reviews.reduce((s, r) => s + Number(r.nota || 0), 0) / totalAvaliacoes).toFixed(1)
    : '—';

  const renderStars = (value) =>
    [1, 2, 3, 4, 5].map((star) => (
      <MaterialIcons
        key={star}
        name="star"
        size={14}
        color={star <= value ? C.starAlt : '#444'}
      />
    ));

  const formatarData = (iso) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* HEADER */}
      <View style={[styles.headerGradient, { backgroundColor: '#0e0b1f' }]}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={{ color: C.text, fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Avaliações do local</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={{ paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center' }}>
          <Text style={{ color: C.text, fontSize: 20, fontWeight: '800', textAlign: 'center' }}>
            {local.nome}
          </Text>
          <Text style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
            {local.local}
          </Text>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 12,
            backgroundColor: C.surface,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 14,
            borderWidth: 0.5,
            borderColor: C.border,
          }}>
            <MaterialIcons name="star" size={18} color={C.starAlt} />
            <Text style={{ color: C.text, fontSize: 16, fontWeight: '800' }}>
              {media}
            </Text>
            <Text style={{ color: C.muted, fontSize: 12 }}>
              · {totalAvaliacoes} {totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 32 }}>

        {loading ? (
          <View style={{ paddingTop: 40, alignItems: 'center' }}>
            <ActivityIndicator color={C.accent} size="large" />
          </View>
        ) : reviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 32 }}>📭</Text>
            <Text style={styles.emptyText}>Nenhuma avaliação ainda.</Text>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {reviews.map((r) => (
              <View key={r.id} style={{
                backgroundColor: C.surface,
                borderWidth: 0.5,
                borderColor: C.border,
                borderRadius: 18,
                padding: 14,
              }}>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <View style={{
                      width: 32, height: 32, borderRadius: 16,
                      backgroundColor: C.blueSoft,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800' }}>
                        {(r.userEmail || '?').charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: C.text, fontSize: 13, fontWeight: '700' }} numberOfLines={1}>
                        {r.userEmail || 'Anônimo'}
                      </Text>
                      <Text style={{ color: C.muted, fontSize: 10 }}>
                        {formatarData(r.avaliadoEm)}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 2 }}>
                    {renderStars(Number(r.nota || 0))}
                  </View>
                </View>

                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginVertical: 6,
                }}>
                  <Text style={{ color: C.muted, fontSize: 11 }}>
                    Estrutura: <Text style={{ color: C.starAlt }}>{r.estrutura || 0}★</Text>
                  </Text>
                  <Text style={{ color: C.muted, fontSize: 11 }}>
                    Atendimento: <Text style={{ color: C.starAlt }}>{r.atendimento || 0}★</Text>
                  </Text>
                  <Text style={{ color: C.muted, fontSize: 11 }}>
                    Acessibilidade: <Text style={{ color: C.starAlt }}>{r.acessibilidade || 0}★</Text>
                  </Text>
                </View>

                {r.comentario ? (
                  <Text style={{
                    color: C.muted,
                    fontSize: 13,
                    fontStyle: 'italic',
                    lineHeight: 18,
                    marginTop: 4,
                  }}>
                    "{r.comentario}"
                  </Text>
                ) : null}

              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}