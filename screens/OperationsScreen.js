import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal,
  TextInput, SafeAreaView, StyleSheet, Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OperationsScreen() {
  const [ops, setOps] = useState([]);
  const [modalAjout, setModalAjout] = useState(false);
  const [modalModif, setModalModif] = useState(false);
  const [modalFacture, setModalFacture] = useState(false);
  const [selectedOp, setSelectedOp] = useState(null);
  const [type, setType] = useState('DECAISSEMENT');
  const [montant, setMontant] = useState('');
  const [description, setDescription] = useState('');
  const [nomClient, setNomClient] = useState('');
  const [prenomClient, setPrenomClient] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [numero, setNumero] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (event, selectedDate) => {
    setShow(false);

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleAjouter = async () => {
    if (!montant || !description || !nomClient || !numero) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch('http://192.168.50.243:3000/api/agence/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type_operation: type,
          montant: parseInt(montant),
          description: description,
          nom_client: nomClient,
          prenom_client: prenomClient,
          numero_client: numero,
          date_operation: date.toISOString()
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de l\'ajout de l\'opération');
      }

      setOps([result.data, ...ops]);
      setMontant('');
      setDescription('');
      setNomClient('');
      setNumero('');
      setPrenomClient('');
      setModalAjout(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModifier = () => {
    if (!selectedOp) return;
    setOps(ops.map(o => o.id === selectedOp.id
      ? { ...o, montant: parseInt(montant) || o.montant, desc: description || o.desc }
      : o
    ));
    setModalModif(false);
    setSelectedOp(null);
  };

  const handleSupprimer = (op) => {
    Alert.alert(
      'Suppression',
      `La suppression de ${op.ref} nécessite la validation de l'administrateur. Envoyer la demande ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Envoyer demande',
          style: 'destructive',
          onPress: () => {
            setOps(ops.map(o => o.id === op.id ? { ...o, statut: 'SUPPRESSION_DEMANDÉE' } : o));
          },
        },
      ]
    );
  };

  const openModif = (op) => {
    setSelectedOp(op);
    setMontant(op.montant.toString());
    setDescription(op.desc);
    setModalModif(true);
  };

  const openFacture = (op) => {
    setSelectedOp(op);
    setModalFacture(true);
  };

  const fetchOperations = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch('http://192.168.50.243:3000/api/agence/operations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la récupération des opérations');
      }

      setOps(result.data);
    } catch (error) {
      setError(error.message);
    }
  };
  useEffect(() => {
    fetchOperations();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.count}>{ops.length} opérations</Text>
        <TouchableOpacity onPress={() => setModalAjout(true)} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Nouveau</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {
          error && (
            <Text style={{ color: 'red', marginBottom: 10 }}>
              {error.Error || error.message || 'Une erreur est survenue'}
            </Text>)
        }
        {ops.map((op) => (
          <View key={op.id_operation} style={styles.opCard}>
            <View style={styles.opRow}>
              <Text style={[styles.opType, { color: op.type_operation === 'Recette' ? '#27ae60' : '#e74c3c' }]}>
                {op.type_operation}
              </Text>
              <Text style={[styles.opMontant, { color: op.type_operation === 'ENCAISSEMENT' ? '#27ae60' : '#e74c3c' }]}>
                {op.type_operation === 'ENCAISSEMENT' ? '+' : '-'}{op.montant.toLocaleString()} Ar
              </Text>
            </View>
            <Text style={styles.opDesc}>{op.description}</Text>
            <View style={styles.opRow}>
              <Text style={styles.opRef}>{op.id_operation} — {op.date_operation}</Text>
            </View>

            {/* Actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => openModif(op)} style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>✏️ Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openFacture(op)} style={[styles.actionBtn, styles.actionBtnGreen]}>
                <Text style={styles.actionBtnText}>🧾 Facture</Text>
              </TouchableOpacity>
              {op.statut !== 'SUPPRESSION_DEMANDÉE' && (
                <TouchableOpacity onPress={() => handleSupprimer(op)} style={[styles.actionBtn, styles.actionBtnRed]}>
                  <Text style={styles.actionBtnText}>🗑️ Supprimer</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal Ajout */}
      <Modal visible={modalAjout} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvelle Opération</Text>
              <TouchableOpacity onPress={() => setModalAjout(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            {error && (
              <Text style={{ color: 'red', marginBottom: 10 }}>
                {error}
              </Text>
            )}
            <Text style={styles.fieldLabel}>Type</Text>
            <View style={styles.typeRow}>
              {['DECAISSEMENT', 'ENCAISSEMENT', 'TRANSFERT'].map((t) => (
                <TouchableOpacity
                  key={t} onPress={() => setType(t)}
                  style={[styles.typeBtn, type === t && {
                    backgroundColor: t === 'DECAISSEMENT' ? '#dcfce7' : '#fee2e2',
                    borderColor: t === 'DECAISSEMENT' ? '#27ae60' : '#e74c3c',
                  }]}
                >
                  <Text style={[styles.typeBtnText, { color: type === t ? (t === 'DECAISSEMENT' ? '#27ae60' : '#e74c3c') : '#94a3b8' }]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Montant (Ar)</Text>
            <TextInput value={montant} onChangeText={setMontant} placeholder="Ex: 1500000" keyboardType="numeric" style={styles.textInput} />
            <Text style={styles.fieldLabel}>Nom Client </Text>
            <TextInput value={nomClient} onChangeText={setNomClient} placeholder="Ex: Jean" style={styles.textInput} />
            <Text style={styles.fieldLabel}>Prénom Client </Text>
            <TextInput value={prenomClient} onChangeText={setPrenomClient} placeholder="Ex: Dupont" style={styles.textInput} />
            <Text style={styles.fieldLabel}>Numéro Téléphone</Text>
            <TextInput value={numero} onChangeText={setNumero} placeholder="Ex: 0340010001" keyboardType="numeric" style={styles.textInput} />
            <Text style={styles.fieldLabel}>Date</Text>
            <TouchableOpacity
              onPress={() => setShow(true)}
              style={styles.textInput}
            >
              <Text>{date.toLocaleDateString('fr-FR')}</Text>
            </TouchableOpacity>

            {show && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput value={description} onChangeText={setDescription} placeholder="Motif..." multiline style={[styles.textInput, styles.textArea]} />
            <TouchableOpacity onPress={handleAjouter} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Modification */}
      <Modal visible={modalModif} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier — {selectedOp?.ref}</Text>
              <TouchableOpacity onPress={() => setModalModif(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.fieldLabel}>Nouveau montant (Ar)</Text>
            <TextInput value={montant} onChangeText={setMontant} keyboardType="numeric" style={styles.textInput} />
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput value={description} onChangeText={setDescription} multiline style={[styles.textInput, styles.textArea]} />
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>⚠️ Toute modification sera journalisée</Text>
            </View>
            <TouchableOpacity onPress={handleModifier} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Enregistrer la modification</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Facture */}
      <Modal visible={modalFacture} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Facture</Text>
              <TouchableOpacity onPress={() => setModalFacture(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            {selectedOp && (
              <View style={styles.factureBox}>
                <View style={styles.factureHeader}>
                  <Text style={styles.factureTitle}>🛡️ Surveillance Financière</Text>
                  <Text style={styles.factureSubtitle}>Agence 3 — Antananarivo</Text>
                </View>
                <View style={styles.factureDivider} />
                <Text style={styles.factureRef}>FACTURE N° {selectedOp.ref}</Text>
                <Text style={styles.factureDate}>Date : {selectedOp.date}</Text>
                <View style={styles.factureDivider} />
                <View style={styles.factureRow}>
                  <Text style={styles.factureLabel}>Type</Text>
                  <Text style={styles.factureValue}>{selectedOp.type}</Text>
                </View>
                <View style={styles.factureRow}>
                  <Text style={styles.factureLabel}>Description</Text>
                  <Text style={styles.factureValue}>{selectedOp.desc}</Text>
                </View>
                <View style={styles.factureRow}>
                  <Text style={styles.factureLabel}>Agent</Text>
                  <Text style={styles.factureValue}>Pierre Rakoto</Text>
                </View>
                <View style={styles.factureRow}>
                  <Text style={styles.factureLabel}>Statut</Text>
                  <Text style={styles.factureValue}>{selectedOp.statut}</Text>
                </View>
                <View style={styles.factureDivider} />
                <View style={styles.factureTotalRow}>
                  <Text style={styles.factureTotalLabel}>MONTANT TOTAL</Text>
                  <Text style={[styles.factureTotalValue, { color: selectedOp.type === 'Recette' ? '#27ae60' : '#e74c3c' }]}>
                    {selectedOp.type === 'Recette' ? '+' : '-'}{selectedOp.montant.toLocaleString()} Ar
                  </Text>
                </View>
                <View style={styles.factureDivider} />
                <Text style={styles.factureFooter}>
                  Document généré automatiquement par le Système de Surveillance Financière
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => { Alert.alert('✅ Succès', 'Facture téléchargée avec succès !'); setModalFacture(false); }}
              style={styles.saveBtn}
            >
              <Text style={styles.saveBtnText}>📥 Télécharger la facture</Text>
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
  count: { fontSize: 13, color: '#64748b' },
  addBtn: { backgroundColor: '#1a3a5c', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  addBtnText: { color: 'white', fontWeight: '700', fontSize: 14 },
  scroll: { padding: 16 },
  opCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 1 },
  opRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  opType: { fontSize: 13, fontWeight: '700' },
  opMontant: { fontSize: 16, fontWeight: '800' },
  opDesc: { fontSize: 13, color: '#475569', marginBottom: 6 },
  opRef: { fontSize: 11, color: '#94a3b8' },
  opStatut: { fontSize: 11, fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionBtn: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  actionBtnGreen: { backgroundColor: '#dcfce7' },
  actionBtnRed: { backgroundColor: '#fee2e2' },
  actionBtnText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1a3a5c' },
  closeBtn: { fontSize: 22, color: '#94a3b8' },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' },
  typeBtnText: { fontWeight: '700' },
  textInput: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, marginBottom: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  warningBox: { backgroundColor: '#fef3c7', borderRadius: 10, padding: 10, marginBottom: 16 },
  warningText: { color: '#92400e', fontSize: 12 },
  saveBtn: { backgroundColor: '#1a3a5c', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  saveBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  factureBox: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 20, marginBottom: 16 },
  factureHeader: { alignItems: 'center', marginBottom: 12 },
  factureTitle: { fontSize: 16, fontWeight: '800', color: '#1a3a5c' },
  factureSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  factureDivider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 12 },
  factureRef: { fontSize: 15, fontWeight: '800', color: '#1a3a5c', marginBottom: 4 },
  factureDate: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  factureRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  factureLabel: { fontSize: 13, color: '#94a3b8' },
  factureValue: { fontSize: 13, fontWeight: '600', color: '#1e293b', flex: 1, textAlign: 'right' },
  factureTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  factureTotalLabel: { fontSize: 14, fontWeight: '800', color: '#1a3a5c' },
  factureTotalValue: { fontSize: 20, fontWeight: '800' },
  factureFooter: { fontSize: 10, color: '#94a3b8', textAlign: 'center', marginTop: 4 },
});