import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, TextInput, SafeAreaView, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles, C } from '../Styles';

export default function TelaFeedPrincipal({ navigation, route }) {
  const tipoLogin = route?.params?.tipoLogin || 'visitante';
  const usuario = route?.params?.usuario || 'Visitante';

  const [mostrarBusca, setMostrarBusca] = useState(false);
  const [pesquisa, setPesquisa] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');

  const categorias = [
    { nome: 'Todos', icone: 'apps' },
    { nome: 'Teatros', icone: 'theater-comedy' },
    { nome: 'Cinemas', icone: 'movie' },
    { nome: 'Museus', icone: 'museum' },
    { nome: 'Eventos', icone: 'event' },
  ];

  const dados = [
    {
      id: '1',
      nome: 'Teatro José de Alencar',
      categoria: 'Teatros',
      local: 'Centro, Fortaleza',
      distancia: '0.8 km',
      avaliacao: '4.8',
      somaNotas: 1144,
      totalAvaliacoes: 238,
      imagem: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Theatro_Jos%C3%A9_de_Alencar.jpg',
    },
    {
      id: '2',
      nome: 'Cineteatro São Luiz',
      categoria: 'Cinemas',
      local: 'Aldeota, Fortaleza',
      distancia: '1.4 km',
      avaliacao: '4.5',
      somaNotas: 639,
      totalAvaliacoes: 142,
      imagem: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Cineteatro_Sao_Luiz.jpg',
    },
  ];

  const dadosFiltrados = dados.filter((item) => {
    const texto = pesquisa.toLowerCase();
    const bateBusca =
      item.nome.toLowerCase().includes(texto) ||
      item.categoria.toLowerCase().includes(texto);
    const bateCategoria = categoriaAtiva === 'Todos' || item.categoria === categoriaAtiva;
    return bateBusca && bateCategoria;
  });

  const irParaPerfil = () => {
    if (tipoLogin === 'admin') {
      navigation.navigate('PerfilAdmin', { tipoLogin });
    } else {
      navigation.navigate('PerfilVisitante', { tipoLogin });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B1220' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1220" />
      <View style={styles.feedContainer}>

        {/* HEADER */}
        <View style={styles.feedHeaderContainer}>
          <View>
            <Text style={styles.feedBoasVindas}>Olá, {usuario}</Text>
            <Text style={styles.feedTitulo}>Cultura Explorer</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            {/* Botão de avaliação */}
            <TouchableOpacity
              style={styles.feedBotaoBusca}
              onPress={() => navigation.navigate('Avaliacao', {
                local: dados[0],
                tipoLogin,
              })}
            >
              <Text style={styles.feedIcone}>⭐</Text>
            </TouchableOpacity>

            {/* Botão de busca */}
            <TouchableOpacity
              style={styles.feedBotaoBusca}
              onPress={() => setMostrarBusca(!mostrarBusca)}
            >
              <Text style={styles.feedIcone}>🔍</Text>
            </TouchableOpacity>

            {/* Avatar / Perfil */}
            <TouchableOpacity style={styles.feedAvatarBtn} onPress={irParaPerfil}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>
                {tipoLogin === 'admin' ? 'AD' : usuario.charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BUSCA */}
        {mostrarBusca && (
          <TextInput
            style={styles.feedInputBusca}
            placeholder="Pesquisar espaço cultural..."
            placeholderTextColor="#AAB0C0"
            value={pesquisa}
            onChangeText={setPesquisa}
          />
        )}

        {/* CATEGORIAS */}
        <View style={styles.feedCategorias}>
          {categorias.map((cat) => {
            const ativo = cat.nome === categoriaAtiva;
            return (
              <TouchableOpacity
                key={cat.nome}
                onPress={() => setCategoriaAtiva(cat.nome)}
                style={ativo ? styles.feedCategoriaAtiva : styles.feedCategoria}
              >
                <MaterialIcons name={cat.icone} size={16} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={{ color: '#FFF' }}>{cat.nome}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LISTA */}
        <FlatList
          data={dadosFiltrados}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.feedCard}
              onPress={() => navigation.navigate('Avaliacao', { local: item, tipoLogin })}
            >
              <Image source={{ uri: item.imagem }} style={styles.feedCardImagem} />
              <View style={styles.feedCardInfo}>
                <Text style={styles.feedCardTitulo}>{item.nome}</Text>
                <Text style={styles.feedCardLocal}>📍 {item.local} • {item.distancia}</Text>
                <Text style={styles.feedCardAvaliacao}>⭐ {item.avaliacao}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Botão Cadastrar Local (só admin) */}
        {tipoLogin === 'admin' && (
          <TouchableOpacity
            style={[styles.btnGreen, { marginTop: 8 }]}
            onPress={() => navigation.navigate('CadastrarLocal')}
          >
            <Text style={styles.btnGreenText}>＋ Cadastrar Local</Text>
          </TouchableOpacity>
        )}

      </View>
    </SafeAreaView>
  );
}