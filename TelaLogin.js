import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { login, getDocument } from './FirebaseConfig';

export default function TelaLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEntrar = async () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu e-mail.');
      return;
    }
    if (!senha.trim()) {
      Alert.alert('Atenção', 'Informe sua senha.');
      return;
    }

    setLoading(true);
    try {
      const { uid } = await login(email.trim(), senha);

      // Busca dados do usuário no Firestore
      const dados = await getDocument('usuarios', uid);
      const tipoLogin = dados?.tipoConta ?? 'visitante';
      const nomeUsuario = dados?.nome ?? email.trim().split('@')[0];

      navigation.replace('FeedPrincipal', {
        tipoLogin,
        usuario: nomeUsuario, // ← agora passa o NOME
      });
    } catch (erro) {
      let mensagem = 'Não foi possível realizar o login.';
      const code = erro.code ?? '';

      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found'
      ) {
        mensagem = 'E-mail ou senha incorretos.';
      } else if (code === 'auth/invalid-email') {
        mensagem = 'E-mail inválido.';
      } else if (code === 'auth/too-many-requests') {
        mensagem = 'Muitas tentativas. Tente novamente mais tarde.';
      } else if (code === 'auth/network-request-failed') {
        mensagem = 'Sem conexão com a internet.';
      }
      Alert.alert('Erro ao entrar', mensagem);
    } finally {
      setLoading(false);
    }
  };

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
          <View style={styles.logoArea}>
            <Image
              source={require('./certo.png')}
              style={styles.logoImagem}
              resizeMode="contain"
            />
            <Text style={styles.logoSubtitulo}>Descubra o Mundo Cultural</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Bem-vindo de volta</Text>

            <View style={styles.inputRow}>
              <Feather name="mail" size={18} color="rgba(240,244,255,0.6)" />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="rgba(240,244,255,0.45)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputRow}>
              <Feather name="lock" size={18} color="rgba(240,244,255,0.6)" />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="rgba(240,244,255,0.45)"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
            </View>

            <TouchableOpacity style={styles.btnPrimary} onPress={handleEntrar} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnPrimaryText}>ENTRAR</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('RedefSenha')}>
              <Text style={styles.esqueciSenha}>Esqueci a senha</Text>
            </TouchableOpacity>

            <View style={styles.divisorRow}>
              <View style={styles.divisorLinha} />
              <Text style={styles.divisorTexto}>Ou</Text>
              <View style={styles.divisorLinha} />
            </View>

            <TouchableOpacity style={styles.btnCadastro} onPress={() => navigation.navigate('Cadastro')}>
              <Text style={styles.btnCadastroText}>Criar nova conta</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(4,10,25,0.88)' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  logoArea: { alignItems: 'center', marginBottom: 28 },
  logoImagem: { width: 260, height: 150, marginBottom: 4 },
  logoSubtitulo: { color: 'rgba(240,244,255,0.55)', fontSize: 12, marginTop: 4 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.13)',
    borderRadius: 22, padding: 20, gap: 12,
  },
  cardTitulo: { color: '#f0f4ff', fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, gap: 10,
  },
  input: { flex: 1, color: '#f0f4ff', fontSize: 13 },
  btnPrimary: {
    backgroundColor: '#2563eb', borderRadius: 14, padding: 13, alignItems: 'center',
    shadowColor: '#2563eb', shadowOpacity: 0.45, shadowRadius: 12, elevation: 6,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 13, letterSpacing: 1 },
  esqueciSenha: { color: 'rgba(240,244,255,0.55)', fontSize: 11, textAlign: 'center' },
  divisorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  divisorLinha: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  divisorTexto: { color: 'rgba(240,244,255,0.55)', fontSize: 11 },
  btnCadastro: {
    borderRadius: 14, padding: 13, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  btnCadastroText: { color: 'rgba(255,255,255,0.8)', fontWeight: '600', fontSize: 13 },
});