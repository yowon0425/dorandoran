import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logoImage from './img/doran2.png';

const Logo = styled.img`
  width: 400px;
  height: auto;
  margin-bottom: 20px;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F7F9EB;
  padding: 20px;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
`;

const Message = styled.h1`
  font-size: 5rem;
  text-align: center;
  color: #333;
  line-height: 1.2;
`;

const Countdown = styled.p`
  font-size: 3rem;
  color: #007B2D;
  margin-top: 20px;
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

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinningCircle = styled.div`
  width: 100px;
  height: 100px;
  border: 10px solid #007B2D;
  border-top: 10px solid #45a049;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
  margin-bottom: 30px;
`;

const ListeningScreen = ({ setSearchQuery }) => {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [countdown, setCountdown] = useState(10);
    const navigate = useNavigate();
    const recognitionRef = useRef(null);
    const isRecognitionStarted = useRef(false);
  
    useEffect(() => {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'ko-KR';
      recognition.continuous = false;
      recognition.interimResults = true;
  
      recognition.onstart = () => {
        setListening(true);
        setTranscript('');
        isRecognitionStarted.current = true;
      };
  
      recognition.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(currentTranscript);
        
        if (event.results[0].isFinal) {
          setSearchQuery(currentTranscript);
          setTimeout(() => {
            navigate('/confirmation');
          }, 1500);
        }
      };
  
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setListening(false);
        isRecognitionStarted.current = false;
      };
  
      recognition.onend = () => {
        setListening(false);
        isRecognitionStarted.current = false;
      };
  
      recognitionRef.current = recognition;
  
      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
      };
    }, [navigate, setSearchQuery]);
  
    useEffect(() => {
      let timer;
      if (countdown > 0 && !listening) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else if (countdown === 0 && !listening) {
        startListening();
      }
      return () => clearTimeout(timer);
    }, [countdown, listening]);
  
    const startListening = () => {
      setCountdown(0);
      if (recognitionRef.current && !isRecognitionStarted.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Error starting speech recognition:', error);
          isRecognitionStarted.current = false;
        }
      }
    };
  
    const stopListening = () => {
      if (recognitionRef.current && isRecognitionStarted.current) {
        recognitionRef.current.stop();
      }
    };
    
  return (
    <Container>
      <Logo src={logoImage} alt="Logo" visible={!listening} />
      {listening && <SpinningCircle />}
      <MessageContainer>
        <Message>{listening ? '듣고 있어요!' : '말씀해 주세요!'}</Message>
        {!listening && countdown > 0 && (
          <Countdown>{countdown}초 후 자동으로 시작됩니다</Countdown>
        )}
      </MessageContainer>
      {!listening ? (
        <Button onClick={startListening}>말하기</Button>
      ) : (
        <Button onClick={stopListening}>중지</Button>
      )}
      {transcript && <Result>"{transcript}"</Result>}
    </Container>
  );
};

export default ListeningScreen;