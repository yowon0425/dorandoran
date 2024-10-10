import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e0f7fa;
`;

const Message = styled.h1`
  font-size: 3rem;
  text-align: center;
  color: #00796b;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
`;

const Result = styled.p`
  margin-top: 20px;
  font-size: 2.5rem; /* 글자 크기를 크게 설정 */
  color: #00796b;
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
      }, 3000); // 인식 후 3초 후에 이동
    };

    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      setSearchQuery(currentTranscript); // 인식된 텍스트를 검색 쿼리로 설정
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
      <Message>듣고있어요!</Message>
      <Button onClick={toggleListening}>
        {listening ? '인식 중지' : '음성 인식 시작'}
      </Button>
      {transcript && <Result>인식된 내용: {transcript}</Result>}
    </Container>
  );
};

export default ListeningScreen;