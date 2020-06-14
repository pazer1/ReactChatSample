import React, {createContext, useState} from 'react';
import {ImageEditor} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        register: async (email, password, avartar) => {
          try {
            var getFileBlob = function (url, cb) {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url);
              xhr.responseType = 'blob';
              xhr.addEventListener('load', function () {
                cb(xhr.response);
              });
              xhr.send();
            };

            uploadToStorage = (imageURL) => {
              getFileBlob(imageURL, (blob) => {
                storage()
                  .ref()
                  .child('images/user')
                  .put(blob)
                  .then(function (snapshot) {
                    console.log('Uploaded a blob or file!');
                  });
              });
            };
            uploadToStorage(avartar);
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.error(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
