import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { styles, C } from './Styles';

const lugaresIniciais = [
  {
    id: '1',
    nome: 'Teatro José de Alencar',
    local: 'Centro • 0.8 km',
    totalAvaliacoes: 238,
    somaNotas: 238 * 4.8,
    categoria: 'TEATRO',
  },
  {
    id: '2',
    nome: 'Cineteatro São Luiz',
    local: 'Aldeota • 1.4 km',
    totalAvaliacoes: 142,
    somaNotas: 142 * 4.5,
    categoria: 'CINEMA',
  },
  {
    id: '3',
    nome: 'Museu do Ceará',
    local: 'Centro • 0.5 km',
    totalAvaliacoes: 312,
    somaNotas: 312 * 4.9,
    categoria: 'MUSEU',
  },
  {
    id: '4',
    nome: 'Expocrato',
    local: 'Crato • 500 km',
    totalAvaliacoes: 479,
    somaNotas: 479 * 4.5,
    categoria: 'EVENTOS',
  },
];

export default function TelaBusca({ navigation, route }) {
  const tipoLogin = route?.params?.tipoLogin || 'visitante';

  const [busca, setBusca] = useState('');
  const [lugares, setLugares] = useState(lugaresIniciais);
  const [dados, setDados] = useState(lugaresIniciais);
  const [categoria, setCategoria] = useState('Todos');
  const [ordenar, setOrdenar] = useState('proximos');

  function filtrar(texto, cat = categoria, ord = ordenar, fonte = lugares) {
    setBusca(texto);
    setCategoria(cat);
    setOrdenar(ord);

    let filtrados = fonte.filter((item) => {
      const matchNome = item.nome.toLowerCase().includes(texto.toLowerCase());
      const matchCategoria =
        cat === 'Todos' || item.categoria === cat.toUpperCase();
      return matchNome && matchCategoria;
    });

    if (ord === 'avaliados') {
      filtrados.sort((a, b) => {
        const mediaA = a.somaNotas / a.totalAvaliacoes;
        const mediaB = b.somaNotas / b.totalAvaliacoes;
        return mediaB - mediaA;
      });
    }

    if (ord === 'recentes') {
      filtrados.reverse();
    }

    setDados(filtrados);
  }

  return (
    <View style={styles.buscaContainer}>

      <Text style={styles.buscaTitulo}>Explorar Locais</Text>

      {/* BUSCA */}
      <TextInput
        placeholder="Buscar por nome ou local..."
        placeholderTextColor="#aaa"
        style={styles.buscaSearch}
        value={busca}
        onChangeText={(text) => filtrar(text)}
      />

      {/* ORDENAR */}
      <Text style={styles.buscaSubtitulo}>ORDENAR POR</Text>
      <View style={styles.buscaRow}>
        <Chip
          label="Mais próximos"
          active={ordenar === 'proximos'}
          onPress={() => filtrar(busca, categoria, 'proximos')}
        />
        <Chip
          label="Melhor avaliados"
          active={ordenar === 'avaliados'}
          onPress={() => filtrar(busca, categoria, 'avaliados')}
        />
        <Chip
          label="Recentes"
          active={ordenar === 'recentes'}
          onPress={() => filtrar(busca, categoria, 'recentes')}
        />
      </View>

      {/* CATEGORIA */}
      <Text style={styles.buscaSubtitulo}>CATEGORIA</Text>
      <View style={styles.buscaRow}>
        <Chip label="Todos" active={categoria === 'Todos'} onPress={() => filtrar(busca, 'Todos')} />
        <Chip
          label="Teatro"
          active={categoria === 'Teatro'}
          onPress={() => filtrar(busca, 'Teatro')}
          icon={<MaterialIcons name="theater-comedy" size={14} color={categoria === 'Teatro' ? '#fff' : '#ccc'} />}
        />
        <Chip
          label="Cinema"
          active={categoria === 'Cinema'}
          onPress={() => filtrar(busca, 'Cinema')}
          icon={<MaterialIcons name="movie" size={14} color={categoria === 'Cinema' ? '#fff' : '#ccc'} />}
        />
        <Chip
          label="Museu"
          active={categoria === 'Museu'}
          onPress={() => filtrar(busca, 'Museu')}
          icon={<MaterialIcons name="museum" size={14} color={categoria === 'Museu' ? '#fff' : '#ccc'} />}
        />
        <Chip
          label="Eventos"
          active={categoria === 'Eventos'}
          onPress={() => filtrar(busca, 'Eventos')}
          icon={<MaterialIcons name="celebration" size={14} color={categoria === 'Eventos' ? '#fff' : '#ccc'} />}
        />
      </View>

      {/* LISTA */}
      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardLocal
            lugar={item}
            onPress={(lugar) =>
              navigation.navigate('Avaliacao', { local: lugar, tipoLogin })
            }
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* NAVBAR */}
      <View style={styles.buscaNavbar}>
        <TouchableOpacity
          style={styles.buscaNavItem}
          onPress={() => navigation.navigate('FeedPrincipal', { tipoLogin })}
        >
          <MaterialIcons name="home" size={22} color="#aaa" />
          <Text style={styles.buscaNavText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buscaNavItem}>
          <MaterialIcons name="search" size={22} color={C.blueAlt} />
          <Text style={[styles.buscaNavText, { color: C.blueAlt }]}>Buscar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buscaNavItem}
          onPress={() =>
            tipoLogin === 'admin'
              ? navigation.navigate('PerfilAdmin', { tipoLogin })
              : navigation.navigate('PerfilVisitante', { tipoLogin })
          }
        >
          <MaterialIcons name="person" size={22} color="#aaa" />
          <Text style={styles.buscaNavText}>Perfil</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

function Chip({ label, active, onPress, icon }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.buscaChip,
        active && { backgroundColor: C.blueAlt, borderColor: C.blueAlt },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {icon}
        <Text style={{ color: active ? '#fff' : '#ccc' }}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

function CardLocal({ lugar, onPress }) {
  const media = lugar.somaNotas / lugar.totalAvaliacoes;

  return (
    <TouchableOpacity onPress={() => onPress(lugar)}>
      <View style={styles.buscaCard}>
        <View style={styles.buscaCardImagem} />

        <View style={{ flex: 1 }}>
          <Text style={styles.buscaCardNome}>{lugar.nome}</Text>
          <Text style={styles.buscaCardLocal}>{lugar.local}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="star" size={14} color="#FFD700" />
            <Text style={styles.buscaCardAvaliacao}>
              {' '}{media.toFixed(1)} • {lugar.totalAvaliacoes} avaliações
            </Text>
          </View>
        </View>

        <View style={styles.buscaTag}>
          <Text style={styles.buscaTagText}>{lugar.categoria}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}