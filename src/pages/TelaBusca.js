import React, { useState } from 'react';
import TelaAvaliacao from './TelaAvaliacao';
import { Feather } from '@expo/vector-icons';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';

const lugaresIniciais = [
  {
    id: '1',
    nome: 'Teatro José de Alencar',
    local: 'Centro • 0.8 km',
    totalAvaliacoes: 238,
    somaNotas: 238 * 4.8,
    categoria: 'TEATRO'
  },
  {
    id: '2',
    nome: 'Cineteatro São Luiz',
    local: 'Aldeota • 1.4 km',
    totalAvaliacoes: 142,
    somaNotas: 142 * 4.5,
    categoria: 'CINEMA'
  },
  {
    id: '3',
    nome: 'Museu do Ceará',
    local: 'Centro • 0.5 km',
    totalAvaliacoes: 312,
    somaNotas: 312 * 4.9,
    categoria: 'MUSEU'
  },
  {
    id: '4',
    nome: 'Expocrato',
    local: 'Crato • 500 km',
    totalAvaliacoes: 479,
    somaNotas: 479 * 4.5,
    categoria: 'EVENTOS'
  }
];

export default function App() {
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [busca, setBusca] = useState('');
  // ✅ CORREÇÃO 1: `lugares` agora é um estado, não uma constante
  const [lugares, setLugares] = useState(lugaresIniciais);
  const [dados, setDados] = useState(lugaresIniciais);
  const [categoria, setCategoria] = useState('Todos');
  const [ordenar, setOrdenar] = useState('proximos');
  const [tela, setTela] = useState('buscar');

  // ✅ CORREÇÃO 2: `filtrar` recebe `fonte` para poder ser chamada com dados atualizados
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

  // ✅ CORREÇÃO 3: `atualizarLocal` agora atualiza `lugares` (fonte de verdade)
  // e re-aplica o filtro atual para que `dados` também reflita a mudança
  const atualizarLocal = (localAtualizado) => {
    const novosLugares = lugares.map((item) =>
      item.id === localAtualizado.id ? localAtualizado : item
    );

    setLugares(novosLugares); // atualiza a fonte de verdade

    // re-aplica filtro atual sobre os dados novos
    let filtrados = novosLugares.filter((item) => {
      const matchNome = item.nome.toLowerCase().includes(busca.toLowerCase());
      const matchCategoria =
        categoria === 'Todos' || item.categoria === categoria.toUpperCase();
      return matchNome && matchCategoria;
    });

    if (ordenar === 'avaliados') {
      filtrados.sort((a, b) => {
        const mediaA = a.somaNotas / a.totalAvaliacoes;
        const mediaB = b.somaNotas / b.totalAvaliacoes;
        return mediaB - mediaA;
      });
    }

    if (ordenar === 'recentes') {
      filtrados.reverse();
    }

    setDados(filtrados);
  };

  if (tela === 'avaliar') {
    return (
      <AvaliarLocal
        local={localSelecionado}
        atualizarLocal={atualizarLocal}
        voltar={() => setTela('buscar')}
      />
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Explorar Locais</Text>

      {/* BUSCA */}
      <TextInput
        placeholder="Buscar por nome ou local..."
        placeholderTextColor="#aaa"
        style={styles.search}
        value={busca}
        onChangeText={(text) => filtrar(text)}
      />

      {/* FILTROS */}
      <Text style={styles.subtitulo}>ORDENAR POR</Text>
      <View style={styles.row}>
        <Chip
          label="Mais próximos"
          active={ordenar === 'proximos'}
          onPress={() => {
            setOrdenar('proximos');
            filtrar(busca, categoria, 'proximos');
          }}
        />
        <Chip
          label="Melhor avaliados"
          active={ordenar === 'avaliados'}
          onPress={() => {
            setOrdenar('avaliados');
            filtrar(busca, categoria, 'avaliados');
          }}
        />
        <Chip
          label="Recentes"
          active={ordenar === 'recentes'}
          onPress={() => {
            setOrdenar('recentes');
            filtrar(busca, categoria, 'recentes');
          }}
        />
      </View>

      <Text style={styles.subtitulo}>CATEGORIA</Text>
      <View style={styles.row}>
        <Chip
          label="Todos"
          active={categoria === 'Todos'}
          onPress={() => filtrar(busca, 'Todos')}
        />
        <Chip
          label="🎭 Teatro"
          active={categoria === 'Teatro'}
          onPress={() => filtrar(busca, 'Teatro')}
        />
        <Chip
          label="🎬 Cinema"
          active={categoria === 'Cinema'}
          onPress={() => filtrar(busca, 'Cinema')}
        />
        <Chip
          label="🏛 Museu"
          active={categoria === 'Museu'}
          onPress={() => filtrar(busca, 'Museu')}
        />
        <Chip
          label="🎉 Eventos"
          active={categoria === 'Eventos'}
          onPress={() => filtrar(busca, 'Eventos')}
        />
      </View>

      {/* LISTA */}
      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            lugar={item}
            onPress={(lugar) => {
              setLocalSelecionado(lugar);
              setTela('avaliar');
            }}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* NAVBAR */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navItemContainer}
          onPress={() => setTela('buscar')}
        >
          <Feather name="home" size={22} color="#aaa" />
          <Text style={[styles.navText, { color: '#aaa' }]}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItemContainer}>
          <Feather name="search" size={22} color="#1E90FF" />
          <Text style={[styles.navText, { color: '#1E90FF' }]}>Buscar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItemContainer}>
          <Feather name="user" size={22} color="#aaa" />
          <Text style={[styles.navText, { color: '#aaa' }]}>Perfil</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        active && { backgroundColor: '#1E90FF', borderColor: '#1E90FF' }
      ]}
    >
      <Text style={{ color: active ? '#fff' : '#ccc' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Card({ lugar, onPress }) {
  const media = lugar.somaNotas / lugar.totalAvaliacoes;

  return (
    <TouchableOpacity onPress={() => onPress(lugar)}>
      <View style={styles.card}>

        <View style={styles.imagem} />

        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{lugar.nome}</Text>
          <Text style={styles.local}>{lugar.local}</Text>
          <Text style={styles.avaliacao}>
            ⭐ {media.toFixed(1)} • {lugar.totalAvaliacoes} avaliações
          </Text>
        </View>

        <View style={styles.tag}>
          <Text style={styles.tagText}>{lugar.categoria}</Text>
        </View>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F1A',
    padding: 16
  },
  titulo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  search: {
    backgroundColor: '#1A1F2E',
    padding: 12,
    borderRadius: 12,
    color: '#fff',
    marginBottom: 20
  },
  subtitulo: {
    color: '#aaa',
    marginBottom: 8,
    marginTop: 10
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap'
  },
  chip: {
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20
  },
  card: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center'
  },
  imagem: {
    width: 50,
    height: 50,
    backgroundColor: '#333',
    borderRadius: 8,
    marginRight: 10
  },
  nome: {
    color: '#fff',
    fontWeight: 'bold'
  },
  local: {
    color: '#aaa'
  },
  avaliacao: {
    color: '#FFD700',
    fontSize: 12
  },
  tag: {
    borderWidth: 1,
    borderColor: '#1E90FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  tagText: {
    color: '#1E90FF',
    fontSize: 12
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#222',
    backgroundColor: '#0B0F1A'
  },
  navItemContainer: {
    alignItems: 'center'
  },
  navText: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2
  }
});
