import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomeScreen from './WelcomeScreen';
import ListeningScreen from './ListeningScreen';
import ConfirmationScreen from './ConfirmationScreen';
import YouTubeScreen from './YouTubeScreen';
import YoutubeScreen2 from './YouTubeScreen2';
import Admin from './admin';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/listening" element={<ListeningScreen setSearchQuery={setSearchQuery} />} />
        <Route path="/confirmation" element={<ConfirmationScreen />} />
        <Route path="/youtube" element={<YouTubeScreen searchQuery={searchQuery} />} />
        <Route path="/youtube2" element={<YoutubeScreen2/>} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </Router>
  );
}

export default App;