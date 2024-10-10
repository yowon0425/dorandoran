import React, { useEffect, useState } from 'react';
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

const VideoFrame = styled.iframe`
  width: 90%; /* 영상 크기를 더 크게 설정 */
  height: 90%;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
`;

const YouTubeScreen = ({ searchQuery }) => {
  const [videoId, setVideoId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            q: searchQuery,
            type: 'video',
            maxResults: 1,
            key: 'YOUR_YOUTUBE_API_KEY', // 여기에 당신의 YouTube API 키를 입력하세요
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

  return (
    <Container>
      {videoId ? (
        <VideoFrame
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <p>영상을 불러오는 중입니다...</p>
      )}
      <Button onClick={() => navigate('/listening')}>음성인식</Button>
    </Container>
  );
};

export default YouTubeScreen;