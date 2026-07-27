import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  SafeAreaView, ScrollView, StyleSheet
} from 'react-native';

export default function InscriptionScreen({ onBack }) {
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '',
    telephone: '', agence: '', password: '', confirm: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const agences = ['Agence 1', 'Agence 2', 'Agence 3', 'Agence 4', 'Agence 5'];

  const handleSubmit = () => {
    if (form.nom && form.email && form.password) setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successBox}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successTitle}>Demande envoyée !</Text>
          <Text style={styles.successText}>
            Votre demande d'inscription a été transmise à l'administrateur.
            Vous recevrez une notification une fois votre compte validé.
          </Text>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Retour à la connexion</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={onBack} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Retour</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>
            Votre compte sera activé après validation par l'administrateur
          </Text>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Seuls les agents enregistrés par l'admin peuvent s'inscrire
          </Text>
        </View>

        <View style={styles.form}>
          {[
            { key: 'nom', label: 'Nom', placeholder: 'Rakoto' },
            { key: 'prenom', label: 'Prénom', placeholder: 'Pierre' },
            { key: 'email', label: 'Email', placeholder: 'pierre@agence.mg', type: 'email-address' },
            { key: 'telephone', label: 'Téléphone', placeholder: '+261 34 00 000 00', type: 'phone-pad' },
          ].map(({ key, label, placeholder, type }) => (
            <View key={key} style={styles.inputGroup}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                value={form[key]}
                onChangeText={(v) => setForm({ ...form, [key]: v })}
                placeholder={placeholder}
                keyboardType={type || 'default'}
                autoCapitalize={key === 'email' ? 'none' : 'words'}
                style={styles.input}
              />
            </View>
          ))}

          {/* Sélection agence */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Agence</Text>
            <View style={styles.agenceGrid}>
              {agences.map((a) => (
                <TouchableOpacity
                  key={a}
                  onPress={() => setForm({ ...form, agence: a })}
                  style={[styles.agenceBtn, form.agence === a && styles.agenceBtnActive]}
                >
                  <Text style={[styles.agenceBtnText, form.agence === a && styles.agenceBtnTextActive]}>
                    {a}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              value={form.password}
              onChangeText={(v) => setForm({ ...form, password: v })}
              placeholder="••••••••"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <TextInput
              value={form.confirm}
              onChangeText={(v) => setForm({ ...form, confirm: v })}
              placeholder="••••••••"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Envoyer la demande d'inscription</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  scroll: { padding: 20 },
  backLink: { marginBottom: 16 },
  backLinkText: { color: '#1a3a5c', fontWeight: '600', fontSize: 14 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#1a3a5c' },
  subtitle: { color: '#64748b', fontSize: 13, marginTop: 4 },
  warningBox: {
    backgroundColor: '#fef3c7', borderWidth: 1, borderColor: '#fde047',
    borderRadius: 12, padding: 12, marginBottom: 16,
  },
  warningText: { color: '#92400e', fontSize: 13, fontWeight: '500' },
  form: { backgroundColor: 'white', borderRadius: 20, padding: 20 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 14,
  },
  agenceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  agenceBtn: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
    borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#f8fafc',
  },
  agenceBtnActive: { backgroundColor: '#dbeafe', borderColor: '#1a3a5c' },
  agenceBtnText: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },
  agenceBtnTextActive: { color: '#1a3a5c', fontWeight: '700' },
  submitBtn: {
    backgroundColor: '#1a3a5c', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  submitBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  successBox: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  successEmoji: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '800', color: '#1a3a5c', marginBottom: 12 },
  successText: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 22 },
  backBtn: {
    backgroundColor: '#1a3a5c', borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 32, marginTop: 24,
  },
  backBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});