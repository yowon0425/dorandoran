import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 90%;
  height: 90%;
`;

const VideoFrame = styled.iframe`
  width: 100%;
  height: 100%;
`;

const ControlButton = styled.button`
  position: absolute;
  top: 20px;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
    transform: scale(1.05);
  }
`;

const StartButton = styled(ControlButton)`
  left: 20px;
`;

const StopButton = styled(ControlButton)`
  right: 20px;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
`;

const YouTubeScreen = ({ searchQuery }) => {
    const [videoId, setVideoId] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const navigate = useNavigate();
    const iframeRef = useRef(null);
  
    useEffect(() => {
      const fetchVideo = async () => {
        try {
          const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
              part: 'snippet',
              q: searchQuery,
              type: 'video',
              maxResults: 1,
              key: 'AIzaSyCMjGFaFyzjAob5e870jNKRN3ZBmCZAAkU',
            },
          });
  
          if (response.data.items.length > 0) {
            setVideoId(response.data.items[0].id.videoId);
          }
        } catch (error) {
          console.error('YouTube API 요청 실패:', error);
        }
      };
  
      if (searchQuery) {
        fetchVideo();
      }
    }, [searchQuery]);
  
    useEffect(() => {
      let recognition;
      if (!isPlaying) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'ko-KR';
        recognition.continuous = true;
        recognition.interimResults = false;
  
        recognition.onresult = (event) => {
          const last = event.results.length - 1;
          const command = event.results[last][0].transcript.toLowerCase();
          console.log('Recognized: ', command);
  
          if (command.includes('도란아')) {
            navigate('/listening');
          }
        };
  
        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
        };
  
        recognition.start();
      }
  
      return () => {
        if (recognition) {
          recognition.stop();
        }
      };
    }, [isPlaying, navigate]);
  
    const startVideo = () => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        setIsPlaying(true);
      }
    };
  
    const stopVideo = () => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        setIsPlaying(false);
      }
    };
  
    return (
      <Container>
        {videoId ? (
          <VideoContainer>
            <VideoFrame
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <StartButton onClick={startVideo}>▶ 영상 시작</StartButton>
            <StopButton onClick={stopVideo}>■ 영상 중지</StopButton>
          </VideoContainer>
        ) : (
          <p>영상을 불러오는 중입니다...</p>
        )}
        <Button onClick={() => navigate('/listening')}>음성인식</Button>
      </Container>
    );
  };
  
  export default YouTubeScreen;