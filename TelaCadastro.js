import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles, Colors } from './Styles';

export default function TelaCadastroScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoConta, setTipoConta] = useState('Visitante');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmaSenhaVisivel, setConfirmaSenhaVisivel] = useState(false);

  const handleCadastrar = () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu e-mail.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'Senha muito curta.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    Alert.alert('Sucesso', `Conta criada para ${email}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarBox}>
            <MaterialCommunityIcons name="account-outline" size={32} color="#fff" />
          </View>
        </View>

        {/* Texto */}
        <Text style={styles.tagline}>
          Para continuar{' '}
          <Text style={styles.taglineHighlight}>crie sua conta!</Text>
        </Text>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nova conta</Text>

          {/* Email */}
          <Text style={styles.fieldLabel}>E-mail *</Text>
          <View style={styles.inputRow}>
            <MaterialCommunityIcons name="email-outline" size={18} color="rgba(255,255,255,0.5)" />
            <TextInput
              style={styles.textInput}
              placeholder="seu@email.com"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Senha */}
          <Text style={styles.fieldLabel}>Senha *</Text>
          <View style={styles.inputRow}>
            <MaterialCommunityIcons name="lock-outline" size={18} color="rgba(255,255,255,0.5)" />
            <TextInput
              style={styles.textInput}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!senhaVisivel}
            />
            <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
              <MaterialCommunityIcons
                name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color="rgba(255,255,255,0.5)"
              />
            </TouchableOpacity>
          </View>

          {/* Confirmar */}
          <Text style={styles.fieldLabel}>Confirmar senha *</Text>
          <View style={styles.inputRow}>
            <MaterialCommunityIcons name="lock-outline" size={18} color="rgba(255,255,255,0.5)" />
            <TextInput
              style={styles.textInput}
              placeholder="Repita a senha"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!confirmaSenhaVisivel}
            />
            <TouchableOpacity onPress={() => setConfirmaSenhaVisivel(!confirmaSenhaVisivel)}>
              <MaterialCommunityIcons
                name={confirmaSenhaVisivel ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color="rgba(255,255,255,0.5)"
              />
            </TouchableOpacity>
          </View>

          {/* Tipo */}
          <Text style={styles.fieldLabel}>Tipo de conta</Text>
          <View style={styles.chipsRow}>
            {['ADM', 'Visitante'].map((tipo) => {
              const isActive = tipoConta === tipo;

              return (
                <TouchableOpacity
                  key={tipo}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => setTipoConta(tipo)}
                >
                  <MaterialCommunityIcons
                    name={tipo === 'ADM' ? 'shield-outline' : 'account-group-outline'}
                    size={14}
                    color={isActive ? Colors.accent : 'rgba(255,255,255,0.6)'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {tipo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Botão */}
          <TouchableOpacity style={styles.btnGreen} onPress={handleCadastrar}>
            <MaterialCommunityIcons name="check" size={18} color="#fff" />
            <Text style={styles.btnGreenText}> Cadastrar</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}