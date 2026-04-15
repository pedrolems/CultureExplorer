import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoLogin, setTipoLogin] = useState('visitante');

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1548518176-89ee8ea83e8a?w=640&q=80' }}
      style={styles.bgImage}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inner}
        >

          {/* LOGO */}
          <View style={styles.logoArea}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoEmoji}>🌍</Text>
            </View>
            <Text style={styles.logoTitulo}>CULTURA EXPLORER</Text>
            <Text style={styles.logoSubtitulo}>Descubra o Mundo Cultural</Text>
          </View>

          {/* CARD DE LOGIN */}
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Bem-vindo de volta</Text>

            {/* INPUT USUÁRIO */}
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome de usuário"
                placeholderTextColor="rgba(240,244,255,0.45)"
                value={usuario}
                onChangeText={setUsuario}
              />
            </View>

            {/* INPUT SENHA */}
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="rgba(240,244,255,0.45)"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
            </View>

            {/* BOTÃO ENTRAR */}
            <TouchableOpacity style={styles.btnPrimary}>
              <Text style={styles.btnPrimaryText}>ENTRAR</Text>
            </TouchableOpacity>

            {/* TIPO DE LOGIN */}
            <View style={styles.tipoRow}>
              <TouchableOpacity
                style={[styles.btnTipo, tipoLogin === 'visitante' && styles.btnTipoAtivo]}
                onPress={() => setTipoLogin('visitante')}
              >
                <Text style={styles.btnTipoText}>👤 Visitante</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnTipo, tipoLogin === 'admin' && styles.btnTipoAtivo]}
                onPress={() => setTipoLogin('admin')}
              >
                <Text style={[styles.btnTipoText, { color: '#38bdf8' }]}>🧑‍💼 Administrador</Text>
              </TouchableOpacity>
            </View>

            {/* ESQUECI SENHA */}
            <Text style={styles.esqueciSenha}>Esqueci a senha</Text>

            {/* DIVISOR */}
            <View style={styles.divisorRow}>
              <View style={styles.divisorLinha} />
              <Text style={styles.divisorTexto}>Ou entre com</Text>
              <View style={styles.divisorLinha} />
            </View>

            {/* BOTÕES SOCIAIS */}
            <View style={styles.sociaisRow}>
              <TouchableOpacity style={[styles.btnSocial, { backgroundColor: '#1877f2' }]}>
                <Text style={styles.btnSocialText}>f</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnSocial, { backgroundColor: '#ea4335' }]}>
                <Text style={styles.btnSocialText}>G</Text>
              </TouchableOpacity>
            </View>
          </View>

        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4,10,25,0.88)',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  // LOGO
  logoArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: 'rgba(37,99,235,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoEmoji: {
    fontSize: 26,
  },
  logoTitulo: {
    color: '#f0f4ff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
  logoSubtitulo: {
    color: 'rgba(240,244,255,0.55)',
    fontSize: 12,
    marginTop: 4,
  },

  // CARD
  card: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    borderRadius: 22,
    padding: 20,
    gap: 12,
  },
  cardTitulo: {
    color: '#f0f4ff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },

  // INPUT
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
  },
  inputIcon: {
    fontSize: 14,
  },
  input: {
    flex: 1,
    color: '#f0f4ff',
    fontSize: 13,
  },

  // BOTÃO PRIMÁRIO
  btnPrimary: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    padding: 13,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
  },

  // TIPO DE LOGIN
  tipoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnTipo: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 14,
    padding: 9,
    alignItems: 'center',
  },
  btnTipoAtivo: {
    borderColor: 'rgba(56,189,248,0.5)',
    backgroundColor: 'rgba(37,99,235,0.2)',
  },
  btnTipoText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '600',
  },

  // ESQUECI SENHA
  esqueciSenha: {
    color: 'rgba(240,244,255,0.55)',
    fontSize: 11,
    textAlign: 'center',
  },

  // DIVISOR
  divisorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  divisorLinha: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  divisorTexto: {
    color: 'rgba(240,244,255,0.55)',
    fontSize: 11,
  },

  // SOCIAIS
  sociaisRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  btnSocial: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSocialText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});