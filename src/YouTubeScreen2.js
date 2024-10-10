import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F7F9EB;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 90%;
  height: 70vh;
  min-height: 360px;
  margin-bottom: 30px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const ControlButton = styled.button`
  padding: 15px 30px;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  background-color: #007B2D;
  color: white;
  border: none;
  border-radius: 15px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }
`;

const PlayButton = styled.button`
  padding: 15px 30px;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  background-color: #FF0000;
  color: white;
  border: none;
  border-radius: 15px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #CC0000;
    transform: scale(1.05);
  }
`;

const YouTubeScreen = () => {
    const navigate = useNavigate();
    const videoId = 'oK_ffvHgULI'; // 고정된 비디오 ID
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // 모바일 환경 감지
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            setIsMobile(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase()));
        };
        checkMobile();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 600000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Container>
            <VideoContainer>
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMobile ? 0 : 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </VideoContainer>
            <ButtonContainer>
                <ControlButton onClick={() => navigate('/')}>돌아가기</ControlButton>
                <ControlButton onClick={() => navigate('/listening')}>듣고 싶은 노래 선곡하기</ControlButton>
            </ButtonContainer>
        </Container>
    );
};

export default YouTubeScreen;