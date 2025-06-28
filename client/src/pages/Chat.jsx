import React, { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import socket from '../socket';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const { friendId } = useParams();
  const { user, loading } = useContext(AuthContext);

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [friendName, setFriendName] = useState('');
  const scrollRef = useRef(null);

  // Fetch friend's name by ID
  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${friendId}`, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setFriendName(res.data.name);
      } catch (err) {
        console.error('Error fetching friend name:', err);
        setFriendName(friendId);
      }
    };

    if (friendId) fetchFriend();
  }, [friendId]);

  // Join socket room and listen for new messages
  useEffect(() => {
    if (!user?.id || !friendId) return;

    const sortedRoomId = [String(user.id), String(friendId)].sort().join('-');
    setRoomId(sortedRoomId);
    socket.emit('join-room', sortedRoomId);

    socket.on('receive-private-message', ({ senderId, message }) => {
      if (senderId !== user.id) {
        setChat(prev => {
          const updatedChat = [...prev, { senderId, message }];
          setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
          return updatedChat;
        });
      }
    });

    return () => {
      socket.off('receive-private-message');
    };
  }, [user?.id, friendId]);

  // Fetch message history between current user and friend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${friendId}`, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setChat(res.data);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    };

    if (user?.id && friendId) {
      fetchMessages();
    }
  }, [user?.id, friendId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit('private-message', {
      senderId: user.id,
      receiverId: friendId,
      message
    });

    setChat(prev => {
      const updated = [...prev, { senderId: user.id, message }];
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      return updated;
    });

    setMessage('');
  };

  if (loading || !user || !friendId) {
    return <div className="loading">Loading chat...</div>;
  }

  return (
    <div className="chat-container">
      <h2>Chat with {friendName}</h2>
      <div className="chat-box">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            ref={idx === chat.length - 1 ? scrollRef : null}
            className={msg.senderId === user.id ? 'chat-msg you' : 'chat-msg friend'}
          >
            <span>{msg.message}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
