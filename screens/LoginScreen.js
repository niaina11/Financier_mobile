import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet
} from 'react-native';

export default function LoginScreen({ onLogin, onInscription }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoEmoji}>🛡️</Text>
          </View>
          <Text style={styles.title}>Surveillance Financière</Text>
          <Text style={styles.subtitle}>Agent d'Agence — 19 Agences</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="agent@agence.mg"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              style={styles.input}
            />
          </View>
          <TouchableOpacity
            onPress={() => { if (email && password) onLogin(); }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity onPress={onInscription} style={styles.inscriptionBtn}>
            <Text style={styles.inscriptionText}>Pas encore de compte ? S'inscrire</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>
          ⚠️ L'inscription nécessite une validation par l'administrateur
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a3a5c' },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logoBox: {
    width: 72, height: 72, backgroundColor: '#2980b9',
    borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  logoEmoji: { fontSize: 32 },
  title: { color: 'white', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#93c5fd', fontSize: 13, marginTop: 4 },
  form: { backgroundColor: 'white', borderRadius: 20, padding: 24 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 14,
  },
  button: {
    backgroundColor: '#1a3a5c', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 4,
  },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 15 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  dividerText: { color: '#9ca3af', fontSize: 13 },
  inscriptionBtn: {
    borderWidth: 1, borderColor: '#1a3a5c', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  inscriptionText: { color: '#1a3a5c', fontWeight: '600', fontSize: 14 },
  note: { color: '#93c5fd', fontSize: 11, textAlign: 'center', marginTop: 20 },
});