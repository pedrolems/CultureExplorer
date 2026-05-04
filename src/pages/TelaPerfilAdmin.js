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
import { Avatar, StatCard, SectionTitle, StarRow, Tag, IconBtn, GlassCard } from '../components/Component';

const adminLocais = [
  { id: 1, nome: 'Teatro José de Alencar', categoria: 'Teatro', rating: 4.8, avaliacoes: 238, status: 'ativo' },
  { id: 2, nome: 'Cineteatro São Luiz', categoria: 'Cinema', rating: 4.5, avaliacoes: 142, status: 'ativo' },
  { id: 3, nome: 'Museu do Ceará', categoria: 'Museu', rating: 4.9, avaliacoes: 312, status: 'revisão' },
  { id: 4, nome: 'Festival Crato 2026', categoria: 'Evento', rating: 4.3, avaliacoes: 89, status: 'ativo' },
];

const categoriaIcon = {
  Teatro: '🎭',
  Cinema: '🎬',
  Museu: '🏛️',
  Evento: '🎉',
};

const settingsItems = [
  { icon: '🔑', label: 'Alterar senha' },
  { icon: '📧', label: 'Atualizar e-mail' },
  { icon: '📢', label: 'Notificações' },
  { icon: '🚪', label: 'Sair', danger: true },
];

export default function TelaPerfilAdmin({ navigation, route }) {
  const tipoLogin = route?.params?.tipoLogin || 'admin';
  const [selected, setSelected] = useState(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* HEADER */}
      <View style={[styles.headerGradient, { backgroundColor: '#0e0b1f' }]}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={{ color: C.text, fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Admin Panel</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <IconBtn icon="🔔" />
            <IconBtn
              icon="⚙️"
              onPress={() => navigation.navigate('ConfigPerfil', { tipoLogin })}
            />
          </View>
        </View>

        <View style={styles.profileCenter}>
          <View style={[styles.avatarRing, { borderColor: 'rgba(139,92,246,0.4)' }]}>
            <Avatar initials="AD" size={72} colors={[C.purple, '#8b5cf6']} />
          </View>
          <Text style={styles.profileName}>Admin Cultural</Text>

          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>🛡 ADMINISTRADOR</Text>
          </View>

          <View style={styles.statsRow}>
            <StatCard value="7" label="Locais" />
            <View style={styles.statDivider} />
            <StatCard value="4.7" label="Média" />
            <View style={styles.statDivider} />
            <StatCard value="782" label="Avaliações" />
          </View>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('CadastrarLocal')}
        >
          <Text style={styles.ctaIcon}>＋</Text>
          <Text style={styles.ctaText}>Cadastrar Novo Local</Text>
        </TouchableOpacity>

        {/* Resumo rápido */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          <View style={[styles.miniCard, { flex: 1 }]}>
            <Text style={{ color: C.green, fontSize: 18, fontWeight: '800' }}>6</Text>
            <Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>Ativos</Text>
          </View>
          <View style={[styles.miniCard, { flex: 1 }]}>
            <Text style={{ color: C.star, fontSize: 18, fontWeight: '800' }}>1</Text>
            <Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>Em revisão</Text>
          </View>
          <View style={[styles.miniCard, { flex: 1 }]}>
            <Text style={{ color: C.accent, fontSize: 18, fontWeight: '800' }}>782</Text>
            <Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>Reviews</Text>
          </View>
        </View>

        {/* Lista de locais */}
        <SectionTitle>Locais Cadastrados</SectionTitle>

        <View style={{ gap: 10 }}>
          {adminLocais.map(local => (
            <GlassCard key={local.id}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelected(selected === local.id ? null : local.id)}
              >
                <View style={styles.adminLocalRow}>
                  <View style={styles.adminLocalIcon}>
                    <Text style={{ fontSize: 20 }}>{categoriaIcon[local.categoria]}</Text>
                  </View>

                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.adminLocalName} numberOfLines={1}>{local.nome}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Tag label={local.categoria} />
                      <View style={[styles.statusBadge, {
                        backgroundColor: local.status === 'ativo' ? C.greenSoft : 'rgba(245,158,11,0.2)',
                      }]}>
                        <Text style={{ color: local.status === 'ativo' ? C.green : C.star, fontSize: 10, fontWeight: '700' }}>
                          {local.status === 'ativo' ? '● Ativo' : '◐ Revisão'}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <StarRow rating={Math.round(local.rating)} />
                      <Text style={{ color: C.muted, fontSize: 11 }}>
                        {local.rating} · {local.avaliacoes} avaliações
                      </Text>
                    </View>
                  </View>

                  <Text style={{ color: C.muted, fontSize: 14, marginLeft: 8 }}>
                    {selected === local.id ? '↑' : '↓'}
                  </Text>
                </View>

                {selected === local.id && (
                  <View style={styles.adminActions}>
                    <View style={styles.adminDivider} />
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: C.blueSoft, borderColor: C.blue + '44', flex: 1 }]}>
                        <Text style={{ color: C.accent, fontSize: 12, fontWeight: '600' }}>✏️ Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: 'rgba(99,102,241,0.15)', borderColor: C.purple + '44', flex: 1 }]}
                        onPress={() => navigation.navigate('Historico', { tipoLogin })}
                      >
                        <Text style={{ color: C.purple, fontSize: 12, fontWeight: '600' }}>📊 Avaliações</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: C.redSoft, borderColor: C.red + '44', flex: 1 }]}>
                        <Text style={{ color: C.red, fontSize: 12, fontWeight: '600' }}>🗑 Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </GlassCard>
          ))}
        </View>

        {/* Configurações da conta */}
        <View style={{ marginTop: 24 }}>
          <SectionTitle>Conta</SectionTitle>
          <GlassCard style={{ gap: 0 }}>
            {settingsItems.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.settingRow, i < settingsItems.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: C.divider }]}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.label === 'Sair') navigation.navigate('Login');
                  else if (item.label === 'Alterar senha' || item.label === 'Atualizar e-mail') {
                    navigation.navigate('ConfigPerfil', { tipoLogin });
                  }
                }}
              >
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                <Text style={[styles.settingLabel, item.danger && { color: C.red }]}>{item.label}</Text>
                <Text style={{ color: C.hint, fontSize: 14 }}>›</Text>
              </TouchableOpacity>
            ))}
          </GlassCard>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}