import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {List, Divider} from 'react-native-paper';
import {Title} from 'react-native-paper';
import {AuthContext} from '../navigation/AuthProvider';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useStatsBar from '../utils/useStatusBar';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Dashboard from './BroadcastScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen({navigation}) {
  useStatsBar('light-content', '#6646ee');

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const Tab = createMaterialBottomTabNavigator();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('THREADS')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            name: '',
            latestMessage: {
              text: '',
            },
            ...documentSnapshot.data(),
          };
        });

        setThreads(threads);

        if (loading) {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const MainScreen = () => {
    return (
      <FlatList
        data={threads}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Room', {thread: item})}>
            <List.Item
              title={item.name}
              description={item.latestMessage.text}
              titleNumberOfLines={1}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              descriptionN
              umberOfLines={1}
            />
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="MainScreen"
        activeColor="#f0edf6"
        inactiveColor="#3e2465"
        barStyle={{backgroundColor: '#694fad'}}>
        <Tab.Screen
          name="MainScreen"
          component={MainScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="BroadcastScreen"
          component={Dashboard}
          options={{
            tabBarLabel: 'Updates',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="bell" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
  },
  listDescription: {
    fontSize: 16,
  },
});
