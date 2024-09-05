import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

const ManageWorkersScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = [];
        querySnapshot.forEach((doc) => {
          userList.push({ id: doc.id, ...doc.data() });
        });
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.table}>
        <View style={styles.headerRow}>
        <Text style={styles.header}>Name</Text>
        <Text style={styles.header}>Email</Text>
        <Text style={styles.header}>ID</Text>
        </View>
        {users.map((user) => (
          <View key={user.id} style={styles.row}>
            <Text style={styles.cell}>{user.name}</Text>
            <Text style={styles.cell}>{user.email}</Text>
            <Text style={styles.cell}>{user.id}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ManageWorkersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5dc',
  },
  table: {
    marginTop: 10,
  },
  headerRow: { 
    flexDirection: 'row',
    backgroundColor: '#8B4513', 
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  header: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff', 
    padding: 5,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    padding: 5,
  },
});








        