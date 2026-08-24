import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StyleSheet
} from 'react-native';

const dernieresOps = [
  { ref: 'OP-2024-018', type: 'Recette', montant: '+1 200 000 Ar', date: "Aujourd'hui 09:30", color: '#27ae60' },
  { ref: 'OP-2024-017', type: 'Dépense', montant: '-850 000 Ar', date: "Aujourd'hui 08:15", color: '#e74c3c' },
  { ref: 'OP-2024-016', type: 'Recette', montant: '+3 500 000 Ar', date: 'Hier 16:40', color: '#27ae60' },
];

export default function AccueilScreen() {

  const [prenom, setPrenom] = useState('');
  const [agence, setAgence] = useState('');
  const [recette, setRecette] = useState(0);
  const [depense, setDepense] = useState(0);
  const [solde, setSolde]= useState(0);

  const chargerUser = async () => {
    try {
      const storedPrenom = await AsyncStorage.getItem('prenom');
      const storedAgence = await AsyncStorage.getItem('nom_agence');
      if (storedPrenom) {
        setPrenom(storedPrenom);
      }
      if (storedAgence) {
        setAgence(storedAgence);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du prénom de l'utilisateur :", error);
    }
  };
  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      console.log("TOKEN :", token);

      const [depenses, recettes, soldes] = await Promise.all([
        fetch('http://192.168.50.243:3000/api/agence/getDepense', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),

        fetch('http://192.168.50.243:3000/api/agence/getRecette', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch('http://192.168.50.243:3000/api/agence/getSolde', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
      ]);

      const depenseText = await depenses.text();
      const recetteText = await recettes.text();
      const soldeText = await soldes.text();

      const depenseData = JSON.parse(depenseText);
      const recetteData = JSON.parse(recetteText);
      const soldeData = JSON.parse(soldeText);

      setDepense(depenseData.data.depense || 0);
      setRecette(recetteData.data.recette || 0);
      setSolde(soldeData.data.solde || 0); 

    } catch (err) {
      console.error(
        "Erreur lors de la récupération des statistiques :",
        err
      );
    }
  };
  useEffect(() => {
    chargerUser();
    fetchStats();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcome}>BIENVENUE</Text>
          <Text style={styles.name}>{prenom}</Text>
          <Text style={styles.agence}>Agence: {agence}</Text>
        </View>

        {/* Carte Solde */}
        <View style={styles.soldeCard}>
          <Text style={styles.soldeLabel}>SOLDE DE L'AGENCE</Text>
          <Text style={styles.soldeValue}>{solde} Ar</Text>
          <View style={styles.soldeRow}>
            <View>
              <Text style={styles.soldeSubLabel}>Recettes ce mois</Text>
              <Text style={styles.recette}>{recette} Ar</Text>
            </View>
            <View>
              <Text style={styles.soldeSubLabel}>Dépenses ce mois</Text>
              <Text style={styles.depense}>-{depense} Ar</Text>
            </View>
          </View>
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