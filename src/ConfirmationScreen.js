import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F7F9EB;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 1s ease-in;
`;

const Message = styled.h1`
  font-size: 5rem;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const SubMessage = styled.p`
  font-size: 2.5rem;
  color: #007B2D;
`;

const ConfirmationScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/youtube');
    }, 3000); // 3초 후에 YouTubeScreen으로 이동

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container>
      <MessageContainer>
        <Message>네, 알겠습니다.</Message>
        <SubMessage>영상을 틀어드릴게요.</SubMessage>
      </MessageContainer>
    </Container>
  );
};

export default ConfirmationScreen;