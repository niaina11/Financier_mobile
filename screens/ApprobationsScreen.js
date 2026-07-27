import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StyleSheet, Modal, TextInput
} from 'react-native';

const initialDemandes = [
  { id: 1, type: 'SUPPRESSION', ref: 'OP-2024-022', agence: 'Agence 3', agent: 'Pierre Rakoto', montant: 850000, motif: 'Erreur de saisie', date: '08/06/2024 10:15', statut: 'EN_ATTENTE' },
  { id: 2, type: 'MODIFICATION', ref: 'OP-2024-015', agence: 'Agence 3', agent: 'Pierre Rakoto', montant: 1200000, motif: 'Mise à jour montant', date: '08/06/2024 09:30', statut: 'EN_ATTENTE' },
  { id: 3, type: 'INSCRIPTION', ref: 'USR-2024-005', agence: 'Agence 5', agent: 'Marie Solo', montant: 0, motif: 'Nouveau agent', date: '07/06/2024 14:00', statut: 'APPROUVÉE' },
  { id: 4, type: 'SUPPRESSION', ref: 'OP-2024-010', agence: 'Agence 3', agent: 'Pierre Rakoto', montant: 300000, motif: 'Doublon', date: '07/06/2024 11:00', statut: 'REJETÉE' },
];

const typeStyles = {
  SUPPRESSION: { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626', emoji: '🗑️' },
  MODIFICATION: { bg: '#fff7ed', border: '#fdba74', text: '#ea580c', emoji: '✏️' },
  INSCRIPTION: { bg: '#f0fdf4', border: '#86efac', text: '#16a34a', emoji: '👤' },
};

const statutStyles = {
  EN_ATTENTE: { bg: '#fef3c7', text: '#92400e' },
  APPROUVÉE: { bg: '#dcfce7', text: '#166534' },
  REJETÉE: { bg: '#fee2e2', text: '#991b1b' },
};

export default function ApprobationsScreen() {
  const [demandes, setDemandes] = useState(initialDemandes);
  const [filter, setFilter] = useState('TOUS');
  const [modalVisible, setModalVisible] = useState(false);
  const [newDemande, setNewDemande] = useState({ type: 'SUPPRESSION', ref: '', motif: '' });

  const filters = ['TOUS', 'EN_ATTENTE', 'APPROUVÉE', 'REJETÉE'];
  const filtered = filter === 'TOUS' ? demandes : demandes.filter(d => d.statut === filter);

  const handleNouvelleDemandeSubmit = () => {
    const d = {
      id: demandes.length + 1,
      type: newDemande.type,
      ref: newDemande.ref || `OP-2024-0${demandes.length + 30}`,
      agence: 'Agence 3',
      agent: 'Pierre Rakoto',
      montant: 0,
      motif: newDemande.motif,
      date: new Date().toLocaleDateString('fr-FR'),
      statut: 'EN_ATTENTE',
    };
    setDemandes([d, ...demandes]);
    setModalVisible(false);
    setNewDemande({ type: 'SUPPRESSION', ref: '', motif: '' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.subtitle}>{demandes.filter(d => d.statut === 'EN_ATTENTE').length} en attente</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Demande</Text>
        </TouchableOpacity>
      </View>

      {/* Filtres */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll}>
        {filtered.map((d) => {
          const ts = typeStyles[d.type];
          const ss = statutStyles[d.statut];
          return (
            <View key={d.id} style={[styles.card, { backgroundColor: ts.bg, borderColor: ts.border }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardEmoji}>{ts.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardType, { color: ts.text }]}>{d.type}</Text>
                  <Text style={styles.cardRef}>{d.ref}</Text>
                </View>
                <View style={[styles.statutBadge, { backgroundColor: ss.bg }]}>
                  <Text style={[styles.statutText, { color: ss.text }]}>{d.statut}</Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardDetail}>👤 {d.agent} — {d.agence}</Text>
                <Text style={styles.cardDetail}>💬 {d.motif}</Text>
                {d.montant > 0 && (
                  <Text style={styles.cardDetail}>💰 {d.montant.toLocaleString()} Ar</Text>
                )}
                <Text style={styles.cardDate}>📅 {d.date}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Modal nouvelle demande */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvelle Demande</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Type de demande</Text>
            <View style={styles.typeGrid}>
              {['SUPPRESSION', 'MODIFICATION', 'AUTRE'].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setNewDemande({ ...newDemande, type: t })}
                  style={[styles.typeBtn, newDemande.type === t && styles.typeBtnActive]}
                >
                  <Text style={[styles.typeBtnText, newDemande.type === t && styles.typeBtnTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Référence opération</Text>
            <TextInput
              value={newDemande.ref}
              onChangeText={(v) => setNewDemande({ ...newDemande, ref: v })}
              placeholder="Ex: OP-2024-018"
              style={styles.textInput}
            />

            <Text style={styles.fieldLabel}>Motif</Text>
            <TextInput
              value={newDemande.motif}
              onChangeText={(v) => setNewDemande({ ...newDemande, motif: v })}
              placeholder="Expliquez la raison de votre demande..."
              multiline
              style={[styles.textInput, styles.textArea]}
            />

            <TouchableOpacity onPress={handleNouvelleDemandeSubmit} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Envoyer la demande</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  topBar: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subtitle: { fontSize: 13, color: '#64748b' },
  addBtn: { backgroundColor: '#1a3a5c', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  addBtnText: { color: 'white', fontWeight: '700', fontSize: 14 },
  filterScroll: { paddingHorizontal: 16, marginBottom: 8, maxHeight: 48 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: 'white', marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  filterBtnActive: { backgroundColor: '#1a3a5c', borderColor: '#1a3a5c' },
  filterText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  filterTextActive: { color: 'white' },
  scroll: { padding: 16 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  cardEmoji: { fontSize: 24 },
  cardType: { fontSize: 14, fontWeight: '800' },
  cardRef: { fontSize: 12, color: '#64748b', marginTop: 2 },
  statutBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statutText: { fontSize: 11, fontWeight: '700' },
  cardBody: { gap: 4 },
  cardDetail: { fontSize: 13, color: '#475569' },
  cardDate: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1a3a5c' },
  closeBtn: { fontSize: 22, color: '#94a3b8' },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  typeGrid: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' },
  typeBtnActive: { backgroundColor: '#dbeafe', borderColor: '#1a3a5c' },
  typeBtnText: { fontSize: 11, fontWeight: '700', color: '#94a3b8' },
  typeBtnTextActive: { color: '#1a3a5c' },
  textInput: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, marginBottom: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: '#1a3a5c', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  saveBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});