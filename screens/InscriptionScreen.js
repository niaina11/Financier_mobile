import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  SafeAreaView, ScrollView, StyleSheet, ActivityIndicator
} from 'react-native';
import {url} from '../utils/api';

export default function InscriptionScreen({ onBack }) {
  // Liste des vraies agences récupérées depuis le backend
  const [listeAgencesBDD, setListeAgencesBDD] = useState([]);
  const [loadingAgences, setLoadingAgences] = useState(true);

  const [form, setForm] = useState({
    nom: '', prenom: '', email: '',telephone: '',role:'',
    telephone: '', id_agence: '', password: '', confirm: '',
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);

  // 1. Charger les agences de la BDD dès l'ouverture de l'écran mobile
  useEffect(() => {
    const chargerAgences = async () => {
      try {
        const response = await fetch(`${url}/api/auth/getAgencesPublic`); 
        const result = await response.json();
        
        if (response.ok) {
          setListeAgencesBDD(result.data || []);
        } else {
          console.warn("Réponse d'erreur du serveur :", result.message);
        }
      } catch (err) {
        console.error("Erreur chargement agences:", err.message);
      } finally {
        setLoadingAgences(false);
      }
    };

    chargerAgences();
  }, []);

  // 2. Soumission de l'inscription avec l'ID de l'agence choisie
  const handleSubmit = async () => {
    if (!form.nom || !form.email || !form.password || !form.id_agence) {
      setError("Veuillez remplir tous les champs obligatoires et choisir une agence.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoadingSubmit(true);
    setError(null);

    try {
      const response = await fetch(`${url}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          telephone: form.telephone,
          role: "AGENT",
          id_agence: form.id_agence,
          mot_de_passe: form.password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Échec de l'inscription.");
      }

      setSubmitted(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successBox}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successTitle}>Demande envoyée !</Text>
          <Text style={styles.successText}>
            Votre demande d'inscription a bien été transmise pour votre agence.
            Vous pourrez vous connecter dès que l'administrateur aura validé votre compte.
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
          <Text style={styles.title}>Créer un compte Agent</Text>
          <Text style={styles.subtitle}>
            Sélectionnez votre agence. Votre compte sera activé après validation par l'admin.
          </Text>
        </View>

        <View style={styles.form}>
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {[
            { key: 'nom', label: 'Nom *', placeholder: 'Rakoto' },
            { key: 'prenom', label: 'Prénom', placeholder: 'Pierre' },
            { key: 'email', label: 'Email *', placeholder: 'pierre@agence.mg', type: 'email-address' },
            { key: 'telephone', label: 'Téléphone', placeholder: '034 00 000 00', type: 'phone-pad' },
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

          {/* Sélection de la vraie agence issue de la BDD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sélectionnez votre Agence *</Text>
            {loadingAgences ? (
              <ActivityIndicator color="#1a3a5c" style={{ marginVertical: 10 }} />
            ) : (
              <View style={styles.agenceGrid}>
                {listeAgencesBDD.map((agence) => (
                  <TouchableOpacity
                    key={agence.id_agence}
                    onPress={() => setForm({ ...form, id_agence: agence.id_agence })}
                    style={[
                      styles.agenceBtn, 
                      form.id_agence === agence.id_agence && styles.agenceBtnActive
                    ]}
                  >
                    <Text style={[
                      styles.agenceBtnText, 
                      form.id_agence === agence.id_agence && styles.agenceBtnTextActive
                    ]}>
                      {agence.nom}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe *</Text>
            <TextInput
              value={form.password}
              onChangeText={(v) => setForm({ ...form, password: v })}
              placeholder="••••••••"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmer le mot de passe *</Text>
            <TextInput
              value={form.confirm}
              onChangeText={(v) => setForm({ ...form, confirm: v })}
              placeholder="••••••••"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <TouchableOpacity 
            onPress={handleSubmit} 
            disabled={loadingSubmit} 
            style={[styles.submitBtn, loadingSubmit && styles.submitBtnDisabled]}
          >
            {loadingSubmit ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitBtnText}>Envoyer la demande d'inscription</Text>
            )}
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
  form: { backgroundColor: 'white', borderRadius: 20, padding: 20 },
  errorBox: {
    backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fca5a5',
    borderRadius: 12, padding: 12, marginBottom: 16,
  },
  errorText: { color: '#991b1b', fontSize: 13, fontWeight: '600' },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#374151'
  },
  agenceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  agenceBtn: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
    borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#f8fafc',
  },
  agenceBtnActive: { backgroundColor: '#dbeafe', borderColor: '#1a3a5c' },
  agenceBtnText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  agenceBtnTextActive: { color: '#1a3a5c', fontWeight: '700' },
  submitBtn: {
    backgroundColor: '#1a3a5c', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.6 },
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
