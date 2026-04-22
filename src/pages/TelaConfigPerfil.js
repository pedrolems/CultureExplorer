import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { styles } from '../Styles';

export default function TelaConfigPerfil({ navigation, route }) {
  const tipoLogin = route?.params?.tipoLogin || 'visitante';
  const tituloTela = tipoLogin === 'admin' ? 'Config. Admin' : 'Meu Perfil';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0f1d' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1d" />

      <View style={styles.container_principal}>

        {/* Botão de voltar */}
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.textoTeatro}>{tituloTela}</Text>

        {/* Foto de perfil */}
        <View style={styles.containerAvatar}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.imagem}
          />
          <TouchableOpacity style={styles.botaoCamera}>
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Card central */}
        <View style={styles.cardAvaliacao}>
          <Text style={styles.tituloSecao}>EDITAR PERFIL</Text>

          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#999" style={styles.iconInput} />
            <TextInput
              style={styles.caixaInput}
              placeholder="MUDAR EMAIL"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.iconInput} />
            <TextInput
              style={styles.caixaInput}
              placeholder="MUDAR SENHA"
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.botaoEditar}>
            <Text style={styles.textoBotao}>SALVAR</Text>
          </TouchableOpacity>

          <Text style={styles.ouEntreCom}>Ou conecte com</Text>

          <View style={styles.rowBotoes}>
            <TouchableOpacity style={[styles.botaoSocial, { backgroundColor: '#1877F2' }]}>
              <FontAwesome name="facebook" size={22} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botaoSocial, { backgroundColor: '#EA4335' }]}>
              <FontAwesome name="google" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}