import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';
import auth, {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

export default function RoomScreen({route}) {
  const [messages, setMessages] = useState([]);
  const {thread} = route.params;
  const {user} = useContext(AuthContext);
  const {profileImage} = useContext(AuthContext);
  const currentUser = user.toJSON();
  const refContainer = useRef(null);
  let ChatComponent = React.createRef();

  async function handleSend(messages) {
    const text = messages[0].text;
    console.log(profileImage);

    firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: currentUser.uid,
          email: currentUser.email,
          avatar: profileImage,
        },
      });

    await firestore()
      .collection('THREADS')
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime(),
          },
        },
        {merge: true},
      );
  }

  useEffect(() => {
    console.log(user);
    console.log(profileImage);

    const messagesListener = firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.email,
              avatar: firebaseData.user.avatar,
            };
          }
          return data;
        });
        refContainer.current.scrollToBottom();
        setMessages(messages);
      });
    return () => messagesListener();
  }, []);

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#6646ee',
          },
          left: {
            backgroundColor: '#DBDB36',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  }

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon="send-circle" size={32} color="#6646ee" />
        </View>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton
          icon="chevron-double-down"
          size={36}
          color="#6646ee"
          ref={ChatComponent}
        />
      </View>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }

  return (
    <GiftedChat
      ref={refContainer}
      messages={messages}
      onSend={(newMessage) => handleSend(newMessage)}
      user={{_id: currentUser.uid}}
      placeholder="Type your message here..."
      alwaysShowSend
      showUserAvatar
      scrollToBottom
      renderBubble={renderBubble}
      renderLoading={renderLoading}
      renderSend={renderSend}
      scrollToBottomComponent={scrollToBottomComponent}
      renderSystemMessage={renderSystemMessage}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  systemMessageWrapper: {
    backgroundColor: '#6646ee',
    borderRadius: 4,
    padding: 5,
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});
