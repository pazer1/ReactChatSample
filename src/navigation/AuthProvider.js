import React, {createContext, useState} from 'react';
import {ImageEditor} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState('');

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        profileImage,
        setProfileImage,
        login: async (email, password) => {
          try {
            await auth()
              .signInWithEmailAndPassword(email, password)
              .then(() => {
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
              });
          } catch (e) {
            console.log(e);
          }
        },
        register: async (email, password, avartar) => {
          try {
            await auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                var getFileBlob = function (url, cb) {
                  var xhr = new XMLHttpRequest();
                  xhr.open('GET', url);
                  xhr.responseType = 'blob';
                  xhr.addEventListener('load', function () {
                    cb(xhr.response);
                  });
                  xhr.send();
                };

                const uploadToStorage = (imageURL) => {
                  getFileBlob(imageURL, (blob) => {
                    storage()
                      .ref()
                      .child('images/' + email)
                      .put(blob)
                      .then(() => {
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
                      });
                  });
                };
                uploadToStorage(avartar);
              });
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
