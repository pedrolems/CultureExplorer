import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { C, styles } from '../Styles';

export function Avatar({ initials, size = 64, colors = [C.blue, C.accent], style }) {
  return (
    <View style={[{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: colors[0],
      alignItems: 'center',
      justifyContent: 'center',
    }, style]}>
      <Text style={{ color: '#fff', fontSize: size * 0.3, fontWeight: '800' }}>
        {initials}
      </Text>
    </View>
  );
}

export function StatCard({ value, label }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function SectionTitle({ children }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function StarRow({ rating }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Text key={i} style={{ color: i <= rating ? C.star : C.hint, fontSize: 12 }}>★</Text>
      ))}
    </View>
  );
}

export function Tag({ label, color = C.accent, bg = C.accentSoft }) {
  return (
    <View style={{
      backgroundColor: bg,
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderWidth: 0.5,
      borderColor: color + '55',
      alignSelf: 'flex-start',
    }}>
      <Text style={{ color, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }}>{label}</Text>
    </View>
  );
}

export function IconBtn({ icon, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconBtn}>
      <Text style={{ fontSize: 16 }}>{icon}</Text>
    </TouchableOpacity>
  );
}

export function GlassCard({ children, style }) {
  return (
    <View style={[styles.glassCard, style]}>
      {children}
    </View>
  );
}