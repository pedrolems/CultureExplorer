import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles, C } from './Styles';
import { enviarResetSenha } from './FirebaseConfig';

export default function TelaRedefSenha({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnviar = async () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu e-mail.');
      return;
    }

    setLoading(true);
    try {
      await enviarResetSenha(email.trim());
      Alert.alert(
        'Email enviado',
        'Enviamos um link para redefinir sua senha. Verifique sua caixa de entrada.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (erro) {
      let mensagem = 'Não foi possível enviar o email de redefinição.';
      const code = erro.code ?? '';

      if (code === 'auth/invalid-email') {
        mensagem = 'E-mail inválido.';
      } else if (code === 'auth/user-not-found') {
        mensagem = 'Não encontramos uma conta com este e-mail.';
      } else if (code === 'auth/network-request-failed') {
        mensagem = 'Sem conexão com a internet.';
      } else if (code === 'auth/too-many-requests') {
        mensagem = 'Muitas tentativas. Tente novamente mais tarde.';
      }
      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <View style={styles.redefContainer}>

        <View style={{ marginBottom: 16 }}>
          <MaterialCommunityIcons name="lock-reset" size={52} color={C.accent} />
        </View>

        <Text style={styles.redefTitulo}>Redefinir senha</Text>

        <View style={styles.redefCard}>

          <Text style={[styles.fieldLabel, { marginBottom: 8 }]}>
            Informe seu e-mail para receber o link de redefinição
          </Text>

          <Text style={styles.fieldLabel}>E-MAIL</Text>
          <View style={styles.redefInputContainer}>
            <MaterialCommunityIcons name="email-outline" size={20} color="rgba(255,255,255,0.5)" />
            <TextInput
              placeholder="seu@email.com"
              placeholderTextColor="rgba(255,255,255,0.4)"
              style={styles.redefInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleEnviar}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnPrimaryText}>ENVIAR LINK</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnOutline} onPress={() => navigation.goBack()}>
            <Text style={styles.btnOutlineText}>Cancelar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}