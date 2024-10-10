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
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%; // Use full width
  height: 80vh; // Increase height to make video larger
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

const YouTubeScreen = () => {
  const navigate = useNavigate();
  const videoId = 'FhA37Sw4j8w'; // 고정된 비디오 ID
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
      const checkMobile = () => {
          const userAgent = navigator.userAgent || navigator.vendor || window.opera;
          setIsMobile(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase()));
      };
      checkMobile();
  }, []);

  useEffect(() => {
      // Load YouTube IFrame API
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
          new window.YT.Player('player', {
              videoId,
              height: '100%',
              width: '100%',
              playerVars: {
                  autoplay: 1, // 자동 재생 설정
                  mute: 1, // 자동 재생을 위해 음소거 설정 (대부분의 브라우저에서 필요)
                  controls: 1, // 컨트롤 표시
                  rel: 0, // 관련 동영상 표시 안 함
              },
              events: {
                  'onReady': (event) => {
                      event.target.playVideo(); // 동영상 재생 시작
                  },
                  'onStateChange': (event) => {
                      if (event.data === window.YT.PlayerState.ENDED) {
                          navigate('/');
                      }
                  }
              }
          });
      };

      const timer = setTimeout(() => {
          navigate('/');
      }, 600000);

      return () => clearTimeout(timer);
  }, [navigate, videoId]);

  return (
      <Container>
          <VideoContainer>
              <div id="player"></div>
          </VideoContainer>
          <ButtonContainer>
              <ControlButton onClick={() => navigate('/')}>돌아가기</ControlButton>
              <ControlButton onClick={() => navigate('/listening')}>듣고 싶은 노래 선곡하기</ControlButton>
          </ButtonContainer>
      </Container>
  );
};

export default YouTubeScreen;