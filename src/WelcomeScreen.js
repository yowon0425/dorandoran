import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const Message = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  color: #333;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
`;

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/listening');
  };

  return (
    <Container>
      <Message>안녕하세요! 원하시는 노래나 영상이 있으면 말씀해주세요!</Message>
      <Button onClick={handleClick}>테스트</Button>
    </Container>
  );
};

export default WelcomeScreen;