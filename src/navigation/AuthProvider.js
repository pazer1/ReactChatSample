import React, {createContext, useState} from 'react';
import {ImageEditor} from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';

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
            await auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                var wantedMaxSize = 150;
                var rawheight = avartar.height;
                var rawwidth = avartar.width;
                var ratio = rawwidth / rawheight;
                var wantedwidth = wantedMaxSize;
                var wantedheight = wantedMaxSize / ratio;
                // check vertical or horizontal
                if (rawheight > rawwidth) {
                  wantedwidth = wantedMaxSize * ratio;
                  wantedheight = wantedMaxSize;
                }
                let resizeUri = await new Promise((resolve, reject)=>{
                ImageEditor.cropImage(avartar,{
                  offset:{x:0,y:0},
                  size:{width:avartar.width,height:avartar.height},
                  displaySize:{width:wantedwidth,height:wantedHeight},
                  resizeMode:'contain',
                },
                uri=>resolve(uri),
                ()=>reject(),
                )
                })

                var ref = firebase.database().ref("Uploads");
                var storage 
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
