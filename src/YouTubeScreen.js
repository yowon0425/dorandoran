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
  min-height: 360px;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ModalButton = styled.button`
  margin: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
`;

const CountdownText = styled.p`
  font-size: 1.5rem;
  margin-top: 10px;
`;

const YouTubeScreen = ({ searchQuery }) => {
    const [videoId, setVideoId] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [player, setPlayer] = useState(null);
    const [playlistIds, setPlaylistIds] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [countdown, setCountdown] = useState(10);
    const navigate = useNavigate();
    const playerRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            console.log('YouTube IFrame API Ready');
        };

        return () => {
            window.onYouTubeIframeAPIReady = null;
        };
    }, []);

    const initializeYouTubePlayer = (videoId) => {
        console.log('Initializing player with video ID:', videoId);
        if (window.YT && videoId) {
            playerRef.current = new window.YT.Player('youtube-player', {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 1,
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }
    };

    const onPlayerReady = (event) => {
        console.log('Player ready');
        setPlayer(event.target);
        event.target.playVideo();
        setIsPlaying(true);
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.ENDED) {
            setShowEndModal(true);
        }
    };

    const playNextVideo = () => {
        if (currentVideoIndex < playlistIds.length - 1) {
            setCurrentVideoIndex(prevIndex => prevIndex + 1);
            if (player && player.loadVideoById) {
                player.loadVideoById(playlistIds[currentVideoIndex + 1]);
            }
        } else {
            fetchRelatedVideos(videoId);
        }
    };

    const fetchRelatedVideos = async (videoId) => {
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    relatedToVideoId: videoId,
                    type: 'video',
                    maxResults: 5,
                    key: 'AIzaSyC9-bWZpXNmLZmAE-XbnEvnqmdbekSO3is',
                },
            });

            if (response.data.items.length > 0) {
                const newVideoIds = response.data.items.map(item => item.id.videoId);
                setPlaylistIds(prevIds => [...prevIds, ...newVideoIds]);
                setCurrentVideoIndex(prevIndex => prevIndex + 1);
                if (player && player.loadVideoById) {
                    player.loadVideoById(newVideoIds[0]);
                }
            } else {
                console.log('No related videos found');
            }
        } catch (error) {
            console.error('Related videos fetch failed:', error);
        }
    };

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        part: 'snippet',
                        q: searchQuery,
                        type: 'video',
                        maxResults: 5,
                        key: 'AIzaSyC9-bWZpXNmLZmAE-XbnEvnqmdbekSO3is',
                    },
                });

                if (response.data.items.length > 0) {
                    const videoIds = response.data.items.map(item => item.id.videoId);
                    setPlaylistIds(videoIds);
                    setVideoId(videoIds[0]);
                    console.log('Video IDs:', videoIds);
                    if (window.YT && window.YT.Player) {
                        initializeYouTubePlayer(videoIds[0]);
                    }
                }
            } catch (error) {
                console.error('YouTube API 요청 실패:', error);
            }
        };

        if (searchQuery) {
            fetchVideos();
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

    useEffect(() => {
        let intervalId;
        if (showEndModal) {
            setCountdown(10);
            intervalId = setInterval(() => {
                setCountdown(prevCount => {
                    if (prevCount === 1) {
                        clearInterval(intervalId);
                        handleContinuePlayback();
                        return 0;
                    }
                    return prevCount - 1;
                });
            }, 1000);

            timerRef.current = setTimeout(() => {
                handleContinuePlayback();
            }, 10000);
        }
        return () => {
            clearInterval(intervalId);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [showEndModal]);

    const startVideo = () => {
        if (player && player.playVideo) {
            player.playVideo();
            setIsPlaying(true);
        }
    };

    const stopVideo = () => {
        if (player && player.pauseVideo) {
            player.pauseVideo();
            setIsPlaying(false);
        }
    };

    const handleContinuePlayback = () => {
        setShowEndModal(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        playNextVideo();
    };

    const handleEndSession = () => {
        setShowEndModal(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        navigate('/');
    };

    return (
        <Container>
            {videoId ? (
                <VideoContainer>
                    <div id="youtube-player"></div>
                    <StartButton onClick={startVideo}>▶ 영상 시작</StartButton>
                    <StopButton onClick={stopVideo}>■ 영상 중지</StopButton>
                </VideoContainer>
            ) : (
                <p>영상을 불러오는 중입니다...</p>
            )}
            <Button onClick={() => navigate('/listening')}>음성인식</Button>

            {showEndModal && (
                <ModalOverlay>
                    <ModalContent>
                        <h2>영상이 종료되었습니다</h2>
                        <p>비슷한 영상을 계속해서 틀까요?</p>
                        <CountdownText>{countdown}초 후 자동으로 다음 영상이 재생됩니다.</CountdownText>
                        <ModalButton onClick={handleContinuePlayback}>예</ModalButton>
                        <ModalButton onClick={handleEndSession}>아니오</ModalButton>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
};

export default YouTubeScreen;