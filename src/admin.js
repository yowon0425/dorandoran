import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import warehouse1 from './img/warehouse1.png';  // 이미지 파일 경로를 적절히 수정해주세요
import warehouse2 from './img/warehouse2.png';  // 이미지 파일 경로를 적절히 수정해주세요
import motion1 from './img/motion1.jpg';
import video1 from './img/video1.png';
import video2 from './img/video2.png';
import doran from './img/doran.jpg';

const Container = styled.div`
  height: 100vh;
  background-color: #F7F9EB;
  display: flex;
`;

const Section = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-right: 1px solid #ccc;
  overflow-y: auto;
  position: relative;  // 추가: 상대 위치 설정

  &:last-child {
    border-right: none;
  }
`;

const Title = styled.h2`
  font-size: 34px;
  color: #007B2D;
  margin-bottom: 20px;
`;

const AnswerList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
`;

const AnswerItem = styled.li`
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const AnswerText = styled.p`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
`;

const AnswerTime = styled.p`
  font-size: 14px;
  color: #666;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const WarehouseImage = styled.img`
  width: 90%;
  max-width: 500px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
`;

const MotionImage = styled.img`
  width: 90%;
  max-width: 500px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  cursor: pointer;
`;

const VideoImage = styled.img`
  width: 90%;
  max-width: 500px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  cursor: pointer;
`;

const DoranImage = styled.img`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 300px;  // 100px에서 200px로 변경
  height: auto;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);  // 그림자 효과도 약간 강화
`;

const Admin = () => {
  const [answers, setAnswers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchAnswers = async () => {
      const db = getFirestore();
      const answersCollection = collection(db, 'answer');
      const q = query(answersCollection, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const answerList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAnswers(answerList);
    };

    fetchAnswers();
  }, []);

  const openModal = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <Container>
      <Section>
        <Title>영상 분석</Title>
        <ImageContainer>
          <VideoImage 
            src={video1} 
            alt="Video 1" 
            onClick={() => openModal(video1)}
          />
          <VideoImage 
            src={video2} 
            alt="Video 2" 
            onClick={() => openModal(video2)}
          />
        </ImageContainer>
        <AnswerList>
          {answers.map(answer => (
            <AnswerItem key={answer.id}>
              <AnswerText>{answer.text}</AnswerText>
              <AnswerTime>{answer.timestamp.toDate().toLocaleString()}</AnswerTime>
            </AnswerItem>
          ))}
        </AnswerList>
      </Section>
      <Section>
        <Title>대화 분석</Title>
        <ImageContainer>
          <WarehouseImage 
            src={warehouse1} 
            alt="Warehouse 1" 
            onClick={() => openModal(warehouse1)}
          />
          <WarehouseImage 
            src={warehouse2} 
            alt="Warehouse 2" 
            onClick={() => openModal(warehouse2)}
          />
        </ImageContainer>
      </Section>
      <Section>
        <Title>모션 인식</Title>
        <ImageContainer>
          <MotionImage 
            src={motion1} 
            alt="Motion 1" 
            onClick={() => openModal(motion1)}
          />
        </ImageContainer>
        <DoranImage src={doran} alt="Doran" />
      </Section>
      {selectedImage && (
        <Modal onClick={closeModal}>
          <ModalImage src={selectedImage} alt="Enlarged image" />
          <CloseButton onClick={closeModal}>&times;</CloseButton>
        </Modal>
      )}
    </Container>
  );
};

export default Admin;