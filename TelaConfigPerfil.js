import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  SafeAreaView, StatusBar, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles, C } from './Styles';
import {
  getCurrentUser, getDocument, setDocument, atualizarSenha,
} from './FirebaseConfig';

export default function TelaConfigPerfil({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoConta, setTipoConta] = useState('visitante');
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const carregarDados = useCallback(async () => {
    const user = getCurrentUser();
    if (!user) {
      setCarregando(false);
      return;
    }
    try {
      const dados = await getDocument('usuarios', user.uid);
      setNome(dados?.nome || '');
      setEmail(user.email || '');
      setTipoConta(dados?.tipoConta || 'visitante');
    } catch (e) {
      console.warn('Erro ao carregar dados:', e);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const handleSalvar = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe seu nome.');
      return;
    }

    // Se preencheu uma senha, valida
    if (novaSenha || confirmarSenha) {
      if (novaSenha.length < 6) {
        Alert.alert('Atenção', 'A nova senha deve ter pelo menos 6 caracteres.');
        return;
      }
      if (novaSenha !== confirmarSenha) {
        Alert.alert('Erro', 'As senhas não coincidem.');
        return;
      }
    }

    const user = getCurrentUser();
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado.');
      return;
    }

    setLoading(true);
    try {
      // 1) Atualiza nome no Firestore
      await setDocument('usuarios', user.uid, {
        nome: nome.trim(),
        email: user.email,
        tipoConta,
      });

      // 2) Atualiza senha (se preencheu)
      if (novaSenha) {
        await atualizarSenha(novaSenha);
        setNovaSenha('');
        setConfirmarSenha('');
      }

      Alert.alert('Sucesso', 'Perfil atualizado!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      let msg = 'Não foi possível atualizar o perfil.';
      const code = e.code ?? '';
      if (code === 'auth/weak-password') {
        msg = 'A senha é muito fraca (mínimo 6 caracteres).';
      } else if (code === 'auth/requires-recent-login') {
        msg = 'Por segurança, faça login novamente para trocar a senha.';
      }
      Alert.alert('Erro', msg);
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={C.accent} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* HEADER */}
      <View style={styles.headerGradient}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={{ color: C.text, fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Editar perfil</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.profileCenter}>
          <View style={[styles.avatarRing, { borderColor: C.accentSoft }]}>
            <View style={{
              width: 72, height: 72, borderRadius: 36,
              backgroundColor: tipoConta === 'admin' ? C.purple : C.blue,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>
                {(nome || email).charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.profileName}>{nome || 'Sem nome'}</Text>
          <Text style={styles.profileHandle}>{email}</Text>

          {tipoConta === 'admin' && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>ADMINISTRADOR</Text>
            </View>
          )}
        </View>
      </View>

      {/* FORMULÁRIO */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 40 }}>

        <Text style={styles.fieldLabel}>NOME</Text>
        <View style={styles.inputRow}>
          <MaterialCommunityIcons name="account-outline" size={18} color="rgba(255,255,255,0.5)" />
          <TextInput
            style={styles.textInput}
            placeholder="Seu nome"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <Text style={styles.fieldLabel}>E-MAIL (não pode ser alterado)</Text>
        <View style={[styles.inputRow, { opacity: 0.5 }]}>
          <MaterialCommunityIcons name="email-outline" size={18} color="rgba(255,255,255,0.5)" />
          <TextInput
            style={styles.textInput}
            value={email}
            editable={false}
          />
          <MaterialCommunityIcons name="lock" size={14} color="rgba(255,255,255,0.4)" />
        </View>

        <View style={styles.divider} />

        <Text style={[styles.fieldLabel, { marginTop: 4 }]}>
          NOVA SENHA (deixe em branco para manter)
        </Text>
        <View style={styles.inputRow}>
          <MaterialCommunityIcons name="lock-outline" size={18} color="rgba(255,255,255,0.5)" />
          <TextInput
            style={styles.textInput}
            placeholder="Mín. 6 caracteres"
            placeholderTextColor="rgba(255,255,255,0.4)"
            secureTextEntry
            value={novaSenha}
            onChangeText={setNovaSenha}
          />
        </View>

        <Text style={styles.fieldLabel}>CONFIRMAR NOVA SENHA</Text>
        <View style={styles.inputRow}>
          <MaterialCommunityIcons name="lock-check-outline" size={18} color="rgba(255,255,255,0.5)" />
          <TextInput
            style={styles.textInput}
            placeholder="Repita a senha"
            placeholderTextColor="rgba(255,255,255,0.4)"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={handleSalvar}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnPrimaryText}>SALVAR ALTERAÇÕES</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnOutline} onPress={() => navigation.goBack()}>
          <Text style={styles.btnOutlineText}>Cancelar</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}