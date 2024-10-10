import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
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

const ConfirmationScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/youtube');
    }, 2000); // 2초 후에 YouTubeScreen으로 이동

    return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 정리
  }, [navigate]);

  return (
    <Container>
      <Message>네, 알겠습니다. 틀어드릴게요.</Message>
    </Container>
  );
};

export default ConfirmationScreen;