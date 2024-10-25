import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Ip from './Ip';

export default function App() {
  const [adatok, setAdatok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const letoltes = async () => {
    try {
      const response = await fetch(Ip.Ipcim + "film");
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setAdatok(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    letoltes();
  }, []);

  const szavazas = async (id) => {
    try {
      const bemenet = { "bevitel1": id };
      const response = await fetch(Ip.Ipcim + "/szavazatFelvitel", {
        method: "POST",
        body: JSON.stringify(bemenet),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      });

      if (!response.ok) throw new Error('Failed to submit vote');
      const result = await response.text();
      Alert.alert("Vote Submitted", result);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const renderFilmItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.film_cim}</Text>
      <Image
        source={{ uri: Ip.Ipcim + item.film_kep }}
        style={styles.image}
      />
      <TouchableOpacity style={styles.voteButton} onPress={() => szavazas(item.film_id)}>
        <Text style={styles.voteButtonText}>Erre szavazok</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Marvel movies...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Marvel filmek</Text>
      {adatok.length === 0 ? (
        <Text style={styles.emptyText}>No movies available at the moment.</Text>
      ) : (
        <FlatList
          data={adatok}
          renderItem={renderFilmItem}
          keyExtractor={item => item.film_id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e23636',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  image: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 15,
  },
  voteButton: {
    backgroundColor: '#e23636',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  voteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
});
