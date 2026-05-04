import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { C, styles } from '../Styles';
import { Avatar, StatCard, StarRow, Tag, IconBtn, GlassCard } from '../components/Component';

const reviews = [
  {
    id: 1,
    local: 'Teatro José de Alencar',
    rating: 5,
    comment: 'Lugar incrível! Arquitetura de tirar o fôlego. Atendimento excelente e espaço muito bem conservado.',
    date: 'há 2 dias',
    tag: 'Teatro',
  },
  {
    id: 2,
    local: 'Cineteatro São Luiz',
    rating: 4,
    comment: 'Sala bem equipada, som perfeito. Poderia ter mais sessões durante a semana.',
    date: 'há 1 semana',
    tag: 'Cinema',
  },
  {
    id: 3,
    local: 'Museu do Ceará',
    rating: 5,
    comment: 'Exposição riquíssima sobre a história cearense. Recomendo muito a visita!',
    date: 'há 2 semanas',
    tag: 'Museu',
  },
  {
    id: 4,
    local: 'Festival Crato 2026',
    rating: 4,
    comment: 'Organização impecável. Shows excelentes e boa estrutura para o público.',
    date: 'há 1 mês',
    tag: 'Evento',
  },
];

export default function TelaPerfilVisit({ navigation, route }) {
  const tipoLogin = route?.params?.tipoLogin || 'visitante';
  const [activeTab, setActiveTab] = useState('reviews');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* HEADER */}
      <View style={styles.headerGradient}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={{ color: C.text, fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Meu Perfil</Text>
          <IconBtn
            icon="⚙️"
            onPress={() => navigation.navigate('ConfigPerfil', { tipoLogin })}
          />
        </View>

        <View style={styles.profileCenter}>
          <View style={[styles.avatarRing, { borderColor: C.accentSoft }]}>
            <Avatar initials="JV" size={72} colors={[C.blue, C.accent]} />
          </View>
          <Text style={styles.profileName}>João Visitante</Text>
          <Text style={styles.profileHandle}>@joao.visitante</Text>

          <View style={styles.statsRow}>
            <StatCard value="12" label="Avaliações" />
            <View style={styles.statDivider} />
            <StatCard value="8" label="Locais" />
            <View style={styles.statDivider} />
            <StatCard value="4.6" label="Nota média" />
          </View>
        </View>

        {/* TABS */}
        <View style={styles.tabRow}>
          {['reviews', 'visited', 'saved'].map(tab => (
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

      {/* CONTENT */}
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {activeTab === 'reviews' && (
          <View style={{ gap: 12 }}>
            {reviews.map(r => (
              <GlassCard key={r.id} style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={styles.reviewLocalName}>{r.local}</Text>
                    <Tag label={r.tag} />
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <StarRow rating={r.rating} />
                    <Text style={styles.reviewDate}>{r.date}</Text>
                  </View>
                </View>

                <Text style={styles.reviewComment}>"{r.comment}"</Text>

                <View style={styles.reviewActions}>
                  <TouchableOpacity style={styles.reviewActionBtn}>
                    <Text style={{ color: C.muted, fontSize: 12 }}>✏️ Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.reviewActionBtn, { borderColor: C.redSoft }]}>
                    <Text style={{ color: C.red, fontSize: 12 }}>🗑 Excluir</Text>
                  </TouchableOpacity>
                </View>
              </GlassCard>
            ))}

            {/* Botão Histórico */}
            <TouchableOpacity
              style={[styles.btnOutline, { marginTop: 8 }]}
              onPress={() => navigation.navigate('Historico', { tipoLogin })}
            >
              <Text style={styles.btnOutlineText}>Ver histórico completo →</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab !== 'reviews' && (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 32 }}>
              {activeTab === 'visited' ? '🗺️' : '🔖'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'visited' ? 'Nenhum local visitado ainda.' : 'Nenhum local salvo ainda.'}
            </Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.goBack()}>
              <Text style={{ color: C.accent, fontSize: 13, fontWeight: '600' }}>Explorar locais →</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}