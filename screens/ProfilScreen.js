import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';

const infos = [
  { label: 'Email', value: 'pierre@agence3.mg' },
  { label: 'Téléphone', value: '+261 34 00 000 00' },
  { label: 'Rôle', value: "Agent d'Agence" },
  { label: 'Statut', value: 'Actif ✅' },
];

const menuItems = [
  { label: 'Changer mot de passe', emoji: '🔑' },
  { label: 'Notifications', emoji: '🔔' },
  { label: 'Aide & Support', emoji: '❓' },
];

export default function ProfilScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Mon Profil</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.profileName}>Pierre Rakoto</Text>
          <Text style={styles.profileRole}>Agent d'Agence</Text>
          <Text style={styles.profileAgence}>🏢 Agence 3 — Antananarivo</Text>
        </View>

        <View style={styles.infoCard}>
          {infos.map(({ label, value }) => (
            <View key={label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.menuCard}>
          {menuItems.map(({ label, emoji }, i) => (
            <TouchableOpacity
              key={label}
              style={[styles.menuItem, i < menuItems.length - 1 && styles.menuBorder]}
            >
              <Text style={styles.menuEmoji}>{emoji}</Text>
              <Text style={styles.menuLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutEmoji}>🚪</Text>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  scroll: { padding: 20 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#1a3a5c', marginBottom: 20 },
  profileCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20, elevation: 2 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarEmoji: { fontSize: 36 },
  profileName: { fontSize: 18, fontWeight: '800', color: '#1a3a5c' },
  profileRole: { color: '#64748b', fontSize: 13, marginTop: 2 },
  profileAgence: { color: '#2980b9', fontSize: 13, fontWeight: '600', marginTop: 8 },
  infoCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  infoLabel: { fontSize: 13, color: '#94a3b8' },
  infoValue: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
  menuCard: { backgroundColor: 'white', borderRadius: 20, overflow: 'hidden', marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  menuEmoji: { fontSize: 20 },
  menuLabel: { fontSize: 14, color: '#1e293b', fontWeight: '500' },
  logoutBtn: { backgroundColor: '#fee2e2', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  logoutEmoji: { fontSize: 20 },
  logoutText: { color: '#dc2626', fontWeight: '700', fontSize: 15 },
});