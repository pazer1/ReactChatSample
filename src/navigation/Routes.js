import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from './AuthProvider';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import auth from '@react-native-firebase/auth';
import Loading from '../components/Loading';
import storage from '@react-native-firebase/storage';

export default function Routes() {
  const {user, setUser} = useContext(AuthContext);
  const {profileImage, setProfileImage} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  function onAuthStateChanged(user) {
    setUser(user);
    {user.email !== undefined | user.email !== null? getImageUrl(user.email)}
    if (initializing) {
      setInitializing(false);
    }
    setLoading(false);
  }

  const getImageUrl = (email) => {
    storage()
      .ref()
      .child('images/' + email)
      .getDownloadURL()
      .then(function (url) {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function (event) {
          var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
        // Or inserted into an <img> element:
        console.log(url);
        setProfileImage(url);
      })
      .catch(function (error) {
        // Handle any errors
        console.log(error);
      });
  };

  useEffect(() => {
    console.log('Route Call');
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
