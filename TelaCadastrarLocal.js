import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  SafeAreaView, StatusBar, Alert, ActivityIndicator, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles, Colors, C } from './Styles';
import { addDocument, getCurrentUser } from './FirebaseConfig';

const CATEGORIES = [
  { label: 'Teatro', icon: 'drama-masks' },
  { label: 'Cinema', icon: 'movie-open-outline' },
  { label: 'Museu', icon: 'bank-outline' },
  { label: 'Evento', icon: 'party-popper' },
  { label: 'Show', icon: 'music' },
];

export default function TelaCadastrarLocal({ navigation }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [imagemBase64, setImagemBase64] = useState(''); // ← base64 data URI
  const [imagemPreview, setImagemPreview] = useState(''); // pra mostrar na tela
  const [selectedCategory, setSelectedCategory] = useState('Teatro');
  const [loading, setLoading] = useState(false);

  // Abre a galeria
  const escolherImagem = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de acesso à sua galeria para escolher uma foto.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.3, // qualidade BAIXA pra não estourar 1MB do Firestore
        base64: true, // ← retorna em base64
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.base64) {
          // Monta a data URI completa (formato que <Image source={{uri}}> entende)
          const dataUri = `data:image/jpeg;base64,${asset.base64}`;
          setImagemBase64(dataUri);
          setImagemPreview(asset.uri);
        } else {
          Alert.alert('Erro', 'Não foi possível processar a imagem.');
        }
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
      console.warn(e);
    }
  };

  const handleCadastrar = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome do local é obrigatório.');
      return;
    }
    if (!localizacao.trim()) {
      Alert.alert('Atenção', 'A localização é obrigatória.');
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado.');
      return;
    }

    // Verifica se a imagem não está gigante (>900KB em base64 = ~700KB real)
    if (imagemBase64 && imagemBase64.length > 900000) {
      Alert.alert(
        'Imagem muito grande',
        'A imagem ficou muito pesada. Tente escolher outra com menor qualidade.'
      );
      return;
    }

    setLoading(true);
    try {
      await addDocument('locais', {
        nome: nome.trim(),
        descricao: descricao.trim(),
        local: localizacao.trim(),
        categoria: selectedCategory,
        imagem: imagemBase64,
        criadoPor: user.uid,
        criadoPorEmail: user.email,
        somaNotas: 0,
        totalAvaliacoes: 0,
        ativo: true,
        criadoEm: new Date().toISOString(),
      });

      navigation.navigate('FeedPrincipal', {
        tipoLogin: 'admin',
        toast: 'Local cadastrado',
      });
    } catch (e) {
      Alert.alert('Erro', `Não foi possível cadastrar: ${e.message || 'erro desconhecido'}`);
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>

          <TouchableOpacity activeOpacity={0.8} onPress={escolherImagem}>
            {imagemPreview ? (
              <View style={{
                borderRadius: 16,
                overflow: 'hidden',
                marginBottom: 18,
                borderWidth: 1,
                borderColor: C.border,
                position: 'relative',
              }}>
                <Image
                  source={{ uri: imagemPreview }}
                  style={{ width: '100%', height: 180 }}
                  resizeMode="cover"
                />
                <View style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  flexDirection: 'row',
                  gap: 6,
                }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      borderRadius: 16,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    onPress={escolherImagem}
                  >
                    <MaterialCommunityIcons name="image-edit" size={14} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Trocar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'rgba(220,38,38,0.8)',
                      borderRadius: 16,
                      padding: 6,
                    }}
                    onPress={() => {
                      setImagemBase64('');
                      setImagemPreview('');
                    }}
                  >
                    <MaterialCommunityIcons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.uploadZone}>
                <MaterialCommunityIcons name="image-plus" size={36} color="rgba(255,255,255,0.4)" />
                <Text style={styles.uploadTextRow}>
                  <Text style={styles.uploadHighlight}>Toque para anexar uma foto</Text>
                </Text>
                <Text style={styles.uploadSubtext}>
                  Escolha uma imagem da sua galeria
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>NOME *</Text>
          <View style={styles.inputRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={18} color="rgba(255,255,255,0.5)" />
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Teatro Municipal"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <Text style={styles.fieldLabel}>DESCRIÇÃO</Text>
          <View style={[styles.inputRow, styles.inputRowMultiline]}>
            <MaterialCommunityIcons name="file-document-outline" size={18} color="rgba(255,255,255,0.5)" />
            <TextInput
              style={[styles.textInput, styles.textInputMultiline]}
              placeholder="Descreva o local cultural..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              multiline
              value={descricao}
              onChangeText={setDescricao}
            />
          </View>

          <Text style={styles.fieldLabel}>LOCALIZAÇÃO *</Text>
          <View style={styles.inputRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={18} color="rgba(255,255,255,0.5)" />
            <TextInput
              style={styles.textInput}
              placeholder="Endereço completo"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={localizacao}
              onChangeText={setLocalizacao}
            />
          </View>

          <Text style={styles.fieldLabel}>CATEGORIA</Text>
          <View style={styles.chipsRow}>
            {CATEGORIES.map((item) => {
              const isActive = selectedCategory === item.label;
              return (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => setSelectedCategory(item.label)}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={14}
                    color={isActive ? Colors.accent : 'rgba(255,255,255,0.6)'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.btnGreen} onPress={handleCadastrar} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : (
                <>
                  <MaterialCommunityIcons name="check" size={18} color="#fff" />
                  <Text style={styles.btnGreenText}>Cadastrar Local</Text>
                </>
              )
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnOutline} onPress={() => navigation.goBack()}>
            <Text style={styles.btnOutlineText}>Cancelar</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}