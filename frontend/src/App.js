
import React from 'react';
import { useState } from 'react';
import { socket } from './socket';
import Chat from './components/Chat/Chat';
import Join from './components/Join/Join';
import { Routes, Route }
	from "react-router-dom";

const App = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  console.log("App.js")

	return (
		<Routes>
			<Route path="/" element={<Join socket={socket} setName={setName} setRoom={setRoom} />}/>
			<Route path="/chat" element={<Chat socket={socket} name={name} room={room} />} />
		</Routes>
	);
}

export default App;
