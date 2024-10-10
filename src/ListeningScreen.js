import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F7F9EB;
  padding: 20px;
`;

const Message = styled.h1`
  font-size: 5rem;
  text-align: center;
  color: #333;
  margin-bottom: 60px;
  line-height: 1.2;
`;

const Button = styled.button`
  padding: 30px 60px;
  font-size: 3rem;
  cursor: pointer;
  background-color: #007B2D;
  color: white;
  border: none;
  border-radius: 15px;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }
`;

const Result = styled.p`
  margin-top: 40px;
  font-size: 3.5rem;
  color: #333;
  text-align: center;
  max-width: 80%;
  word-wrap: break-word;
`;

const ListeningScreen = ({ setSearchQuery }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ko-KR';

    recognition.onstart = () => {
      setListening(true);
      setTranscript('');
    };

    recognition.onend = () => {
      setListening(false);
      setTimeout(() => {
        navigate('/confirmation');
      }, 1500);
    };

    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      setSearchQuery(currentTranscript);
    };

    if (listening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
    
  }, [listening, navigate, setSearchQuery]);

  const toggleListening = () => {
    setListening((prevState) => !prevState);
  };

  return (
    <Container>
      <Message>
        {listening ? '듣고 있어요!' : '말씀해 주세요!'}
      </Message>
      <Button onClick={toggleListening}>
        {listening ? '인식 중지' : '말하기'}
      </Button>
      {transcript && <Result>"{transcript}"</Result>}
    </Container>
  );
};

export default ListeningScreen;