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
import { styles, Colors } from './Styles'; // 🔴 IMPORTANTE: importando os estilos

// ─── Categorias ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Teatro', emoji: '🎭' },
  { label: 'Cinema', emoji: '🎬' },
  { label: 'Museu', emoji: '🏛️' },
  { label: 'Evento', emoji: '🎉' },
  { label: 'Show', emoji: '🎵' },
];

// ─── Ícones ──────────────────────────────────────────────────────────────────
const IconImage = () => <Text style={{ fontSize: 28, opacity: 0.4 }}>🖼️</Text>;

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
    Alert.alert('Sucesso', `Local "${nome}" cadastrado com sucesso!`);
    // Limpar formulário
    setNome('');
    setDescricao('');
    setLocalizacao('');
    setSelectedCategory('Teatro');
    setHasImage(false);
  };

  const handleCancelar = () => {
    if (navigation) {
      navigation.goBack();
    } else {
      setNome('');
      setDescricao('');
      setLocalizacao('');
      setSelectedCategory('Teatro');
      setHasImage(false);
      Alert.alert('Formulário limpo');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          
          {/* Upload de imagem */}
          <TouchableOpacity style={styles.uploadZone} onPress={handlePickImage} activeOpacity={0.7}>
            {hasImage ? (
              <>
                <Text style={styles.uploadImagedText}>✅ Imagem selecionada</Text>
                <Text style={styles.uploadText}>Toque para trocar</Text>
              </>
            ) : (
              <>
                <IconImage />
                <Text style={styles.uploadText}>📸 Toque para adicionar imagem</Text>
                <Text style={styles.uploadSubtext}>JPG, PNG até 5MB</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Campo Nome */}
          <Text style={styles.fieldLabel}>NOME *</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>📍</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Teatro Municipal"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* Campo Descrição */}
          <Text style={styles.fieldLabel}>DESCRIÇÃO</Text>
          <View style={[styles.inputRow, styles.inputRowMultiline]}>
            <Text style={styles.inputIcon}>📄</Text>
            <TextInput
              style={[styles.textInput, styles.textInputMultiline]}
              placeholder="Descreva o local, horários, valores..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              multiline
              numberOfLines={3}
              value={descricao}
              onChangeText={setDescricao}
            />
          </View>

          {/* Campo Localização */}
          <Text style={styles.fieldLabel}>LOCALIZAÇÃO *</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>📍</Text>
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
            {CATEGORIES.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.chip,
                  selectedCategory === item.label && styles.chipActive,
                ]}
                onPress={() => setSelectedCategory(item.label)}
              >
                <Text style={[
                  styles.chipText,
                  selectedCategory === item.label && styles.chipTextActive,
                ]}>
                  {item.emoji} {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Botão Cadastrar */}
          <TouchableOpacity 
            style={styles.btnGreen} 
            onPress={handleCadastrar}
            activeOpacity={0.8}
          >
            <Text style={styles.btnGreenText}>Cadastrar Local</Text>
          </TouchableOpacity>

          {/* Botão Cancelar */}
          <TouchableOpacity 
            style={styles.btnOutline} 
            onPress={handleCancelar}
          >
            <Text style={styles.btnOutlineText}>Cancelar</Text>
          </TouchableOpacity>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}