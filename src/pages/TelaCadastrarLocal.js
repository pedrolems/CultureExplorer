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
import { styles, Colors } from '../Styles';

// Categorias com ícones reais
const CATEGORIES = [
  { label: 'Teatro', icon: 'drama-masks' },
  { label: 'Cinema', icon: 'movie-open-outline' },
  { label: 'Museu', icon: 'bank-outline' },
  { label: 'Evento', icon: 'party-popper' },
  { label: 'Show', icon: 'music' },
];

const IconImage = () => (
  <MaterialCommunityIcons
    name="image-outline"
    size={32}
    color="rgba(255,255,255,0.35)"
  />
);

export default function CadastrarLocalScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Teatro');
  const [hasImage, setHasImage] = useState(false);

  const handlePickImage = () => {
    setHasImage(true);
    Alert.alert('Imagem', 'Seletor de imagem seria aberto aqui.');
  };

  const handleCadastrar = () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome do local é obrigatório.');
      return;
    }
    if (!localizacao.trim()) {
      Alert.alert('Atenção', 'A localização é obrigatória.');
      return;
    }

    Alert.alert('Sucesso', `Local "${nome}" cadastrado!`);
  };

  const handleCancelar = () => {
    navigation?.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>

          {/* Upload */}
          <TouchableOpacity style={styles.uploadZone} onPress={handlePickImage}>
            {hasImage ? (
              <>
                <Text style={styles.uploadImagedText}>Imagem selecionada</Text>
                <Text style={styles.uploadText}>Toque para trocar</Text>
              </>
            ) : (
              <>
                <IconImage />
                <Text style={styles.uploadTextRow}>
                  <Text style={styles.uploadHighlight}>Toque para adicionar</Text>
                  <Text style={styles.uploadText}> imagem</Text>
                </Text>
                <Text style={styles.uploadSubtext}>JPG, PNG · Máx 10MB</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Nome */}
          <Text style={styles.fieldLabel}>NOME *</Text>
          <View style={styles.inputRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={18}
              color="rgba(255,255,255,0.5)"
            />
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Teatro Municipal"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* Descrição */}
          <Text style={styles.fieldLabel}>DESCRIÇÃO</Text>
          <View style={[styles.inputRow, styles.inputRowMultiline]}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={18}
              color="rgba(255,255,255,0.5)"
            />
            <TextInput
              style={[styles.textInput, styles.textInputMultiline]}
              placeholder="Descreva o local cultural..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              multiline
              value={descricao}
              onChangeText={setDescricao}
            />
          </View>

          {/* Localização */}
          <Text style={styles.fieldLabel}>LOCALIZAÇÃO *</Text>
          <View style={styles.inputRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={18}
              color="rgba(255,255,255,0.5)"
            />
            <TextInput
              style={styles.textInput}
              placeholder="Endereço completo"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={localizacao}
              onChangeText={setLocalizacao}
            />
          </View>

          {/* Categoria */}
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
                  <Text
                    style={[
                      styles.chipText,
                      isActive && styles.chipTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* Botão */}
          <TouchableOpacity style={styles.btnGreen} onPress={handleCadastrar}>
            <MaterialCommunityIcons name="check" size={18} color="#fff" />
            <Text style={styles.btnGreenText}> Cadastrar Local</Text>
          </TouchableOpacity>

          {/* Cancelar */}
          <TouchableOpacity style={styles.btnOutline} onPress={handleCancelar}>
            <Text style={styles.btnOutlineText}>Cancelar</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}