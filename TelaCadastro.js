import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ImageBackground, Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
  ScrollView,
} from 'react-native';
import { cadastrar, setDocument } from './FirebaseConfig';

export default function TelaCadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoConta, setTipoConta] = useState('visitante');
  const [loading, setLoading] = useState(false);

  const handleCadastrar = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe seu nome.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu e-mail.');
      return;
    }
    if (!senha.trim()) {
      Alert.alert('Atenção', 'Informe uma senha.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const { uid } = await cadastrar(email.trim(), senha);

      await setDocument('usuarios', uid, {
        nome: nome.trim(),
        email: email.trim(),
        tipoConta,
      });

      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      navigation.replace('FeedPrincipal', {
        tipoLogin: tipoConta,
        usuario: nome.trim(),
      });
    } catch (erro) {
      let mensagem = 'Não foi possível criar a conta.';
      const code = erro.code ?? '';

      if (code === 'auth/email-already-in-use') {
        mensagem = 'Este e-mail já está cadastrado.';
      } else if (code === 'auth/invalid-email') {
        mensagem = 'E-mail inválido.';
      } else if (code === 'auth/weak-password') {
        mensagem = 'A senha é muito fraca (mínimo 6 caracteres).';
      } else if (code === 'auth/network-request-failed') {
        mensagem = 'Sem conexão com a internet.';
      }
      Alert.alert('Erro ao cadastrar', mensagem);
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
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">

            {/* LOGO igual à tela de Login */}
            <View style={styles.logoArea}>
              <Image
                source={require('./certo.png')}
                style={styles.logoImagem}
                resizeMode="contain"
              />
              <Text style={styles.logoSubtitulo}>Crie sua conta</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitulo}>Cadastro</Text>

              {/* NOME */}
              <View style={styles.inputRow}>
                <Feather name="user" size={18} color="rgba(240,244,255,0.6)" />
                <TextInput
                  style={styles.input}
                  placeholder="Nome"
                  placeholderTextColor="rgba(240,244,255,0.45)"
                  value={nome}
                  onChangeText={setNome}
                />
              </View>

              {/* EMAIL */}
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

              {/* SENHA */}
              <View style={styles.inputRow}>
                <Feather name="lock" size={18} color="rgba(240,244,255,0.6)" />
                <TextInput
                  style={styles.input}
                  placeholder="Senha (mín. 6 caracteres)"
                  placeholderTextColor="rgba(240,244,255,0.45)"
                  secureTextEntry
                  value={senha}
                  onChangeText={setSenha}
                />
              </View>

              {/* CONFIRMAR SENHA */}
              <View style={styles.inputRow}>
                <Feather name="lock" size={18} color="rgba(240,244,255,0.6)" />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar senha"
                  placeholderTextColor="rgba(240,244,255,0.45)"
                  secureTextEntry
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                />
              </View>

              {/* TIPO DE CONTA */}
              <Text style={styles.tipoLabel}>Tipo de conta</Text>
              <View style={styles.tipoRow}>
                <TouchableOpacity
                  style={[styles.tipoBtn, tipoConta === 'visitante' && styles.tipoBtnAtivo]}
                  onPress={() => setTipoConta('visitante')}
                >
                  <Feather
                    name="user"
                    size={16}
                    color={tipoConta === 'visitante' ? '#fff' : 'rgba(240,244,255,0.6)'}
                  />
                  <Text
                    style={[
                      styles.tipoBtnText,
                      tipoConta === 'visitante' && styles.tipoBtnTextAtivo,
                    ]}
                  >
                    Visitante
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tipoBtn, tipoConta === 'admin' && styles.tipoBtnAtivo]}
                  onPress={() => setTipoConta('admin')}
                >
                  <Feather
                    name="shield"
                    size={16}
                    color={tipoConta === 'admin' ? '#fff' : 'rgba(240,244,255,0.6)'}
                  />
                  <Text
                    style={[
                      styles.tipoBtnText,
                      tipoConta === 'admin' && styles.tipoBtnTextAtivo,
                    ]}
                  >
                    Admin
                  </Text>
                </TouchableOpacity>
              </View>

              {/* BOTÃO CRIAR CONTA */}
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={handleCadastrar}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.btnPrimaryText}>CRIAR CONTA</Text>
                }
              </TouchableOpacity>

              {/* VOLTAR PARA LOGIN */}
              <TouchableOpacity
                style={styles.btnCadastro}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.btnCadastroText}>Já tenho uma conta</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(4,10,25,0.88)' },
  inner: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoArea: { alignItems: 'center', marginBottom: 20 },
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
  tipoLabel: {
    color: 'rgba(240,244,255,0.6)',
    fontSize: 11,
    letterSpacing: 1,
    marginTop: 4,
    marginBottom: -4,
  },
  tipoRow: { flexDirection: 'row', gap: 10 },
  tipoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingVertical: 11,
  },
  tipoBtnAtivo: {
    backgroundColor: 'rgba(37,99,235,0.4)',
    borderColor: '#2563eb',
  },
  tipoBtnText: { color: 'rgba(240,244,255,0.6)', fontSize: 13, fontWeight: '600' },
  tipoBtnTextAtivo: { color: '#fff' },
  btnPrimary: {
    backgroundColor: '#2563eb', borderRadius: 14, padding: 13, alignItems: 'center',
    shadowColor: '#2563eb', shadowOpacity: 0.45, shadowRadius: 12, elevation: 6,
    marginTop: 4,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 13, letterSpacing: 1 },
  btnCadastro: {
    borderRadius: 14, padding: 13, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  btnCadastroText: { color: 'rgba(255,255,255,0.8)', fontWeight: '600', fontSize: 13 },
});