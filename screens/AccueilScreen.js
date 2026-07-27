import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StyleSheet
} from 'react-native';

const actions = [
  { label: 'Ajouter Recette', emoji: '➕', bg: '#dcfce7' },
  { label: 'Ajouter Dépense', emoji: '➖', bg: '#fee2e2' },
  { label: 'Voir Historique', emoji: '📊', bg: '#dbeafe' },
  { label: 'Alertes', emoji: '🔔', bg: '#fef3c7' },
];

const dernieresOps = [
  { ref: 'OP-2024-018', type: 'Recette', montant: '+1 200 000 Ar', date: "Aujourd'hui 09:30", color: '#27ae60' },
  { ref: 'OP-2024-017', type: 'Dépense', montant: '-850 000 Ar', date: "Aujourd'hui 08:15", color: '#e74c3c' },
  { ref: 'OP-2024-016', type: 'Recette', montant: '+3 500 000 Ar', date: 'Hier 16:40', color: '#27ae60' },
];

export default function AccueilScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcome}>BIENVENUE</Text>
          <Text style={styles.name}>Agent Pierre</Text>
          <Text style={styles.agence}>Agence 3 — Antananarivo</Text>
        </View>

        {/* Carte Solde */}
        <View style={styles.soldeCard}>
          <Text style={styles.soldeLabel}>SOLDE DE L'AGENCE</Text>
          <Text style={styles.soldeValue}>12 450 000 Ar</Text>
          <View style={styles.soldeRow}>
            <View>
              <Text style={styles.soldeSubLabel}>Recettes ce mois</Text>
              <Text style={styles.recette}>+8 200 000 Ar</Text>
            </View>
            <View>
              <Text style={styles.soldeSubLabel}>Dépenses ce mois</Text>
              <Text style={styles.depense}>-3 800 000 Ar</Text>
            </View>
          </View>
        </View>

        {/* Actions rapides */}
        <Text style={styles.sectionTitle}>Actions Rapides</Text>
        <View style={styles.actionsGrid}>
          {actions.map(({ label, emoji, bg }) => (
            <TouchableOpacity key={label} style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: bg }]}>
                <Text style={styles.actionEmoji}>{emoji}</Text>
              </View>
              <Text style={styles.actionLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dernières opérations */}
        <Text style={styles.sectionTitle}>Dernières Opérations</Text>
        {dernieresOps.map((op) => (
          <View key={op.ref} style={styles.opCard}>
            <View>
              <Text style={styles.opType}>{op.type}</Text>
              <Text style={styles.opRef}>{op.ref} — {op.date}</Text>
            </View>
            <Text style={[styles.opMontant, { color: op.color }]}>{op.montant}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  scroll: { padding: 20 },
  header: { marginBottom: 20 },
  welcome: { fontSize: 12, color: '#94a3b8', letterSpacing: 1 },
  name: { fontSize: 22, fontWeight: '800', color: '#1a3a5c' },
  agence: { fontSize: 13, color: '#64748b' },
  soldeCard: { backgroundColor: '#1a3a5c', borderRadius: 20, padding: 24, marginBottom: 20 },
  soldeLabel: { color: '#93c5fd', fontSize: 12, marginBottom: 8 },
  soldeValue: { color: 'white', fontSize: 32, fontWeight: '800' },
  soldeRow: { flexDirection: 'row', marginTop: 16, gap: 20 },
  soldeSubLabel: { color: '#93c5fd', fontSize: 11 },
  recette: { color: '#4ade80', fontSize: 16, fontWeight: '700' },
  depense: { color: '#f87171', fontSize: 16, fontWeight: '700' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a3a5c', marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  actionCard: {
    backgroundColor: 'white', borderRadius: 16, padding: 16,
    width: '47%', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionEmoji: { fontSize: 22 },
  actionLabel: { fontSize: 13, fontWeight: '600', color: '#374151', textAlign: 'center' },
  opCard: {
    backgroundColor: 'white', borderRadius: 14, padding: 14, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  opType: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  opRef: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  opMontant: { fontSize: 15, fontWeight: '800' },
});