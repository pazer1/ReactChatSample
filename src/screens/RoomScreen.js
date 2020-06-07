import React, {useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';

export default function RoomScreen() {
  const [messages, setMessages] = useState([
    {
      _id: 0,
      text: 'New room created.',
      createAt: new Date().getTime(),
      system: true,
    },
    {
      _id: 1,
      text: 'Henlo!',
      createAt: new Date().getTime(),
      user: {
        _id: 2,
        name: 'Test User',
      },
    },
  ]);

  function handleSend(newMessage = []) {
    setMessages(GiftedChat.append(messages, newMessage));
  }
  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessage) => handleSend(newMessage)}
      user={{_id: 1}}
    />
  );
}
