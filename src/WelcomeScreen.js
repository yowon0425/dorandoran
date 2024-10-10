import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
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

const VideoFeed = styled.video`
  display: none;
`;

const Canvas = styled.canvas`
  display: none;
`;

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [motionDetected, setMotionDetected] = useState(false);
  const [motionDuration, setMotionDuration] = useState(0);
  const motionStartTimeRef = useRef(null);

  const handleClick = useCallback(() => {
    navigate('/listening');
  }, [navigate]);

  const navigateToYoutube2 = useCallback(() => {
    navigate('/youtube2');
  }, [navigate]);

  useEffect(() => {
    let stream = null;
    let rafId = null;
    let lastProcessTime = 0;

    const setupCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play().catch(e => console.error("Error playing video:", e));
            };
          }
        } catch (err) {
          console.error("Error accessing the camera:", err);
        }
      };

      const detectMotion = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
      
        let previousImageData = null;
      
        const processFrame = (timestamp) => {
            if (timestamp - lastProcessTime < 100) {
              rafId = requestAnimationFrame(processFrame);
              return;
            }
            lastProcessTime = timestamp;
          
            if (video.readyState === video.HAVE_ENOUGH_DATA && !video.paused && !video.ended) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
              if (previousImageData) {
                const diffPixels = pixelDiff(imageData, previousImageData, 30);
                
                // Clear previous drawings
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw the current video frame
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Highlight areas with motion
                ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                diffPixels.forEach(pixel => {
                  ctx.fillRect(pixel.x, pixel.y, 1, 1);
                });
          
                if (diffPixels.length > 1000) { // Adjust this threshold as needed
                  if (!motionStartTimeRef.current) {
                    motionStartTimeRef.current = Date.now();
                  }
                  const currentDuration = (Date.now() - motionStartTimeRef.current) / 1000;
                  setMotionDuration(currentDuration);
                  setMotionDetected(true);
          
                  if (currentDuration >= 3) {
                    navigateToYoutube2();
                    return;
                  }
                } else {
                  setMotionDetected(false);
                  motionStartTimeRef.current = null;
                  setMotionDuration(0);
                }
              }
          
              previousImageData = imageData;
            }
          
            rafId = requestAnimationFrame(processFrame);
          };
      
        rafId = requestAnimationFrame(processFrame);
      };

      const pixelDiff = (imageData1, imageData2, threshold) => {
        const data1 = imageData1.data;
        const data2 = imageData2.data;
        const width = imageData1.width;
        const height = imageData1.height;
        const diffPixels = [];
      
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const diff = Math.abs(data1[i] - data2[i]);
            if (diff > threshold) {
              diffPixels.push({ x, y });
            }
          }
        }
      
        return diffPixels;
      };

    setupCamera().then(() => {
      detectMotion();
    });

    return () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
  }, [navigateToYoutube2]);

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
      <VideoFeed ref={videoRef} />
      <Canvas ref={canvasRef} width="320" height="240" />
    </Container>
  );
};

export default WelcomeScreen;