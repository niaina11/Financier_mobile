import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Activity, Bell, User } from 'lucide-react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import InscriptionScreen from './screens/InscriptionScreen';
import AccueilScreen from './screens/AccueilScreen';
import OperationsScreen from './screens/OperationsScreen';
import ApprobationsScreen from './screens/ApprobationsScreen';
import ProfilScreen from './screens/ProfilScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Sidebar({ currentTab, onNavigate, onLogout }) {
  const items = [
    { name: 'Accueil', emoji: '🏠' },
    { name: 'Opérations', emoji: '💰' },
    { name: 'Approbations', emoji: '📋' },
    { name: 'Profil', emoji: '👤' },
  ];

  return (
    <View style={sidebarStyles.container}>
      <View style={sidebarStyles.logoBox}>
        <Text style={sidebarStyles.logoEmoji}>🛡️</Text>
        <Text style={sidebarStyles.logoTitle}>Surveillance</Text>
        <Text style={sidebarStyles.logoSub}>Financière</Text>
      </View>
      {items.map(({ name, emoji }) => (
        <TouchableOpacity
          key={name}
          onPress={() => onNavigate(name)}
          style={[sidebarStyles.item, currentTab === name && sidebarStyles.itemActive]}
        >
          <Text style={sidebarStyles.itemEmoji}>{emoji}</Text>
          <Text style={[sidebarStyles.itemLabel, currentTab === name && sidebarStyles.itemLabelActive]}>
            {name}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={onLogout} style={sidebarStyles.logoutBtn}>
        <Text style={sidebarStyles.logoutEmoji}>🚪</Text>
        <Text style={sidebarStyles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

function MainApp({ onLogout }) {
  const [currentTab, setCurrentTab] = useState('Accueil');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderScreen = () => {
    switch (currentTab) {
      case 'Accueil': return <AccueilScreen />;
      case 'Opérations': return <OperationsScreen />;
      case 'Approbations': return <ApprobationsScreen />;
      case 'Profil': return <ProfilScreen onLogout={onLogout} />;
      default: return <AccueilScreen />;
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar
          currentTab={currentTab}
          onNavigate={(name) => { setCurrentTab(name); setSidebarOpen(false); }}
          onLogout={onLogout}
        />
      )}

      {/* Contenu principal */}
      <View style={{ flex: 1 }}>
        {/* Topbar */}
        <View style={appStyles.topbar}>
          <TouchableOpacity onPress={() => setSidebarOpen(!sidebarOpen)} style={appStyles.menuBtn}>
            <Text style={appStyles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={appStyles.topbarTitle}>{currentTab}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Page courante */}
        <View style={{ flex: 1 }}>
          {renderScreen()}
        </View>

        {/* Bottom Navigation */}
        <View style={appStyles.bottomNav}>
          {[
            { name: 'Accueil', emoji: '🏠' },
            { name: 'Opérations', emoji: '💰' },
            { name: 'Approbations', emoji: '📋' },
            { name: 'Profil', emoji: '👤' },
          ].map(({ name, emoji }) => (
            <TouchableOpacity
              key={name}
              onPress={() => setCurrentTab(name)}
              style={appStyles.bottomItem}
            >
              <Text style={appStyles.bottomEmoji}>{emoji}</Text>
              <Text style={[appStyles.bottomLabel, currentTab === name && appStyles.bottomLabelActive]}>
                {name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState('login');

  if (screen === 'login') {
    return (
      <LoginScreen
        onLogin={() => setScreen('main')}
        onInscription={() => setScreen('inscription')}
      />
    );
  }
  if (screen === 'inscription') {
    return (
      <InscriptionScreen
        onBack={() => setScreen('login')}
      />
    );
  }
  return <MainApp onLogout={() => setScreen('login')} />;
}

const sidebarStyles = StyleSheet.create({
  container: {
    width: 220,
    backgroundColor: '#1a3a5c',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  logoBox: { alignItems: 'center', marginBottom: 32 },
  logoEmoji: { fontSize: 36, marginBottom: 8 },
  logoTitle: { color: 'white', fontSize: 16, fontWeight: '800' },
  logoSub: { color: '#93c5fd', fontSize: 12 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, paddingHorizontal: 12,
    borderRadius: 12, marginBottom: 4,
  },
  itemActive: { backgroundColor: 'rgba(255,255,255,0.15)' },
  itemEmoji: { fontSize: 18 },
  itemLabel: { color: '#93c5fd', fontSize: 14, fontWeight: '500' },
  itemLabelActive: { color: 'white', fontWeight: '700' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, paddingHorizontal: 12,
    borderRadius: 12, marginTop: 'auto',
    position: 'absolute', bottom: 40, left: 16, right: 16,
    backgroundColor: 'rgba(220,38,38,0.2)',
  },
  logoutEmoji: { fontSize: 18 },
  logoutText: { color: '#fca5a5', fontSize: 14, fontWeight: '600' },
});

const appStyles = StyleSheet.create({
  topbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1a3a5c', paddingTop: 50, paddingBottom: 14, paddingHorizontal: 16,
  },
  menuBtn: { width: 40, alignItems: 'center' },
  menuIcon: { color: 'white', fontSize: 22 },
  topbarTitle: { color: 'white', fontSize: 16, fontWeight: '800' },
  bottomNav: {
    flexDirection: 'row', backgroundColor: 'white',
    borderTopWidth: 1, borderTopColor: '#e2e8f0',
    paddingBottom: 8, paddingTop: 8,
  },
  bottomItem: { flex: 1, alignItems: 'center' },
  bottomEmoji: { fontSize: 20 },
  bottomLabel: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  bottomLabelActive: { color: '#1a3a5c', fontWeight: '700' },
});