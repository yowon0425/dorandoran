import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logoImage from './img/doran2.png';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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
  min-height: 100vh;
  background-color: #F7F9EB;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-top: 50px;
  }
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
  padding: 20px 40px;
  font-size: 2.5rem;
  cursor: pointer;
  background-color: #007B2D;
  color: white;
  border: none;
  border-radius: 15px;
  transition: background-color 0.3s, transform 0.3s;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:hover, &:active {
    background-color: #45a049;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    padding: 15px 30px;
    font-size: 2rem;
    width: 80%;
    max-width: 300px;
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

const firebaseConfig = {
    apiKey: "AIzaSyB8sERMO4W8uTVBH238hCaHwFGuCmO2YwE",
  authDomain: "dorandoran-419b9.firebaseapp.com",
  databaseURL: "https://dorandoran-419b9-default-rtdb.firebaseio.com",
  projectId: "dorandoran-419b9",
  storageBucket: "dorandoran-419b9.appspot.com",
  messagingSenderId: "1022208652097",
  appId: "1:1022208652097:web:b9a399996e27bb8dca27c0",
  measurementId: "G-B2GVZQTR6E"
  };

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ListeningScreen = ({ setSearchQuery }) => {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [countdown, setCountdown] = useState(10);
    const navigate = useNavigate();
    const recognitionRef = useRef(null);
    const isRecognitionStarted = useRef(false);

    const saveTranscriptToFirebase = async (transcript) => {
        try {
            const docRef = await addDoc(collection(db, "answer"), {
                text: transcript,
                timestamp: new Date()
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

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
                saveTranscriptToFirebase(currentTranscript);  // Firebase에 저장
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