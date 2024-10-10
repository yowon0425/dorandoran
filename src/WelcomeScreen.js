import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import doranImage from './img/doran.jpg';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  background-color: #F7F9EB;
  padding: 20px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 55%;
  margin-left: auto;
  margin-right: 10%;
`;

const Message = styled.h1`
  font-size: 5rem;
  text-align: center;
  color: #333;
  margin-bottom: 56px;
  line-height: 1.2;
  transform: translateZ(0);
  transition: all 0.3s ease;
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

const DoranImage = styled.img`
  height: 80vh;
  width: auto;
  object-fit: contain;
`;

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate('/listening');
  }, [navigate]);

  const memoizedMessage = useMemo(() => (
    <Message>
      안녕하세요!<br/>
      원하시는 노래나<br/>영상이 있으면<br/>
      말씀해주세요!
    </Message>
  ), []);

  return (
    <Container>
      <ContentContainer>
        {memoizedMessage}
        <Button onClick={handleClick}>시작하기</Button>
      </ContentContainer>
      <DoranImage src={doranImage} alt="도란이" />
    </Container>
  );
};

export default WelcomeScreen;