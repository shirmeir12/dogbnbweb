import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { DB } from './Config';
import dog1 from '../images/dog1.jpg';
import dog2 from '../images/dog2.jpg';
import pawPrint from '../images/pawprint5.svg';
import { getAuth } from 'firebase/auth'; // Ensure this import is present
import { collection, query, where, getDocs } from 'firebase/firestore';

const GlobalStyle = createGlobalStyle`
  :root {
    --TITLE_FONT: 'Source Serif Pro', serif;
    --TEXT_FONT: 'Quicksand', sans-serif;
    --TITLE_COLOR_H1: #4C7572;
    --BACKGROUND_COLOR: #F0EDEB;
    --TEXT_COLOR_H1: #46454A;
    --BUTTON_COLOR_H1: #628991;
  }

  body {
    font-family: var(--TEXT_FONT);
    direction: ltr;
    margin: 0;
    padding: 0;
    background-color: var(--BACKGROUND_COLOR);
    color: var(--TEXT_COLOR_H1);
    height: 100vh;
    width: 100%;
    box-sizing: border-box;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }
`;



const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 20px auto;
  text-align: left;
  background: var(--BACKGROUND_COLOR);
`;

const ProfileSectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Section = styled.div`
  flex: 1;
  margin: 20px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  padding: 20px;
  background-color: #CBD5D0;
  box-shadow: none;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-left: 20px;
  z-index: 2;
`;

const BasicInfo = styled.div`
  text-align: left;
  flex-grow: 1;
`;

const VolunteerName = styled.h2`
  font-family: 'Quicksand', sans-serif;
  font-size: 4rem;
  margin: 5px 0;
  color: #555;
`;

const SubTitle = styled.h2`
  font-family: var(--TEXT_FONT);
  font-size: 1.5rem;
  margin: 5px 0;
  color: #555;
`;

const Text = styled.p`
  font-family: 'Quicksand', sans-serif;
  font-size: 1.2rem; /* הגדלת הפונט */
  margin: 5px 0;
  color: var(--TEXT_COLOR_H1);
`;

const BoldTextInline = styled.span`
  font-weight: bold;
  font-size: 1rem; /* הגדלת הפונט */
`;

const Card = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  border: 1px solid #ddd;
  width: 100%;
`;

const DetailRow = styled.div`
  text-align: left;
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const DetailLabel = styled.label`
  font-weight: bold;
  color: #333;
`;

const DogIdLabel = styled(DetailLabel)`
  text-decoration: underline;
`;

const DetailValue = styled.span`
  align: left;
  display: flex;
  color: #666;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  background-color: #DCE2E4;
  padding: 10px;
  border-radius: 10px 10px 0 0;
  margin: -20px -20px 20px -20px;
`;

const TitleWithIcon = styled.div`
  display: flex;
  align-items: center;

  img {
    margin-right: 10px;
    width: 24px;
    height: 24px;
  }
`;

const GalleryCard = styled(Card)`
  width: 100%;
`;

const ContactButton = styled.button`
  background-color: var(--BUTTON_COLOR_H1);
  font-family: var(--TEXT_FONT);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.5);
  }
`;

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  font-family: 'Quicksand', sans-serif;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #8A89AC;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const PopupMessage = styled.p`
  color: #46454A;
  font-size: 1.2rem;
  margin: 10;
`;

const CloseButton = styled.button`
  background-color: #B05D5D;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  position: absolute;
  top: 10px;
  right: 10px;

  &:hover {
    background-color: #A04B4B;
  }
`;



const GalleryImage = styled.img`
  width: 150px;
  height: 150px;
  margin: 10px;
  border-radius: 10px;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  border-radius: 10px;
`;

const ArrowButton = styled.button`
  background-color: #628991;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.5rem;
  margin: 0 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1001;

  &:hover {
    background-color: #527882;
  }
`;

const DogProfiles = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    dogType: '',
    dogAge: '',
    dogSize: '',
    address: '',
    datesForBBsitting: '',
    photoUrl: '',
    dogName: '',
    dogType: '',
    dogAge: '',
    dogGender: '',
    dogSize: '',
    dogImmune: '',
    dogNeutered: '',
    suitableFor: '',
    friendlyWithChildren: '',
    dogDetails: '',
    careInstructions: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessage, setShowMessage] = useState(false); // New state for message

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        console.log("Fetching profile for UID:", uid);
        const docRef = doc(DB, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched profile data:", data);
          setProfile(prevProfile => ({
            ...prevProfile,
            ...data,
            galleryImages: data.galleryImages || [] // Ensure galleryImages is included
          }));
  
          // Fetch post data
          const postsRef = collection(DB, 'posts');
          const q = query(postsRef, where("postOwnerUid", "==", uid));
          const querySnapshot = await getDocs(q);
          let datesForBBsitting = '';
          querySnapshot.forEach((doc) => {
            const postData = doc.data();
            console.log("Fetched post data:", postData);
            datesForBBsitting += `${postData.startDate} to ${postData.endDate}\n`;
          });
          setProfile(prevProfile => ({
            ...prevProfile,
            datesForBBsitting: datesForBBsitting.trim()
          }));
        } else {
          console.log("No such document!");
          setError("No such document!");
        }
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Error fetching document: " + err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [uid]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>No profile data found</div>;

  const handleContactClick = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error("No user is signed in");
      return;
    }
  
    try {
      const userDocRef = doc(DB, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        console.error("User document does not exist");
        return;
      }
  
      const userData = userDocSnap.data();
      const connectionRequest = {
        userId: currentUser.uid,
        name: userData.name || 'Anonymous',
        profilePic: userData.profilePic
      };
  
      console.log("Sending connection request:", connectionRequest);
      
      const recipientDocRef = doc(DB, 'users', uid); 
      await updateDoc(recipientDocRef, {
        connectionRequests: arrayUnion(connectionRequest)
      });
  
      console.log("Connection request sent successfully");
      setShowMessage(true);
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };
  
  const handleCloseMessage = () => {
    setShowMessage(false);
  };
  
  
  {showMessage && (
    <PopupContainer>
      <PopupMessage>
        Thank you for reaching out!<br />
        Your request has been sent
      </PopupMessage>
      <CloseButton onClick={handleCloseMessage}>X</CloseButton>
    </PopupContainer>
  )}
  

  return (
    <Container>
      <GlobalStyle />
      <Header>
        <BasicInfo>
          <VolunteerName>{profile.dogName}</VolunteerName>
          <Text>{profile.dogType}, {profile.dogAge}, {profile.dogSize}</Text>
          <Text>{profile.address}</Text>
          <div>
            <BoldTextInline>Dates for BBsitting:</BoldTextInline> {profile.datesForBBsitting}
          </div>
          <ContactButton onClick={handleContactClick}>Connect</ContactButton>
        </BasicInfo>

        <ProfileImage src={profile.profilePic || dog1} alt={`${profile.name}`} />
      </Header>
      <ProfileSectionWrapper>
        <Section>
          <PersonalDetails profile={profile} />
        </Section>
        <Section>
          <Gallery images={profile.galleryImages} /> 
        </Section>
      </ProfileSectionWrapper>
      {showMessage && (
        <PopupContainer>
          <PopupMessage>Thank you for reaching out! Your request has been sent</PopupMessage>
          <CloseButton onClick={handleCloseMessage}>X</CloseButton>
        </PopupContainer>
      )}
    </Container>
  );
};

const Gallery = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const openModal = (index) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const showPrevImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const showNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <GalleryCard>
      <TitleSection>
        <TitleWithIcon>
          <img src={pawPrint} alt="Paw Print" />
          <SubTitle>Gallery</SubTitle>
        </TitleWithIcon>
      </TitleSection>
      {images && images.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {images.map((image, index) => (
            <GalleryImage
              key={index}
              src={image}
              alt={`gallery-${index}`}
              onClick={() => openModal(index)}
            />
          ))}
        </div>
      ) : (
        <p>No images available</p>
      )}
      {selectedImageIndex !== null && images && images.length > 0 && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ArrowButton style={{ left: 0 }} onClick={showPrevImage}>
              &lt;
            </ArrowButton>
            <ModalImage src={images[selectedImageIndex]} alt={`gallery-${selectedImageIndex}`} />
            <ArrowButton style={{ right: 0 }} onClick={showNextImage}>
              &gt;
            </ArrowButton>
            <CloseButton onClick={closeModal}>X</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </GalleryCard>
  );
};
const PersonalDetails = ({ profile }) => (
  <Card>
    <TitleSection>
      <TitleWithIcon>
        <img src={pawPrint} alt="Paw Print" />
        <SubTitle>Personal Details</SubTitle>
      </TitleWithIcon>
    </TitleSection>
    <DetailRow>
      <DetailLabel><strong>Owner Name:</strong></DetailLabel>
      <DetailValue>{profile.name || ''}</DetailValue>
    </DetailRow>
    <DetailRow>
      <DetailLabel><strong>Address:</strong></DetailLabel>
      <DetailValue>{profile.address || ''}</DetailValue>
    </DetailRow>
    <div style={{ marginBottom: '20px' }}></div> {/* Additional spacing */}
    <DetailRow>
      <DogIdLabel><strong>Dog I.D</strong></DogIdLabel>
    </DetailRow>
    <Card>
      <DetailRow>
        <DetailLabel><strong>Name:</strong></DetailLabel>
        <DetailValue>{profile.dogName || ''}</DetailValue>
      </DetailRow>
      <DetailRow>
        <DetailLabel><strong>Breed:</strong></DetailLabel>
        <DetailValue>{profile.dogType || ''}</DetailValue>
      </DetailRow>
      <DetailRow>
        <DetailLabel><strong>Age:</strong></DetailLabel>
        <DetailValue>{profile.dogAge || ''}</DetailValue>
      </DetailRow>
      <DetailRow>
        <DetailLabel><strong>Gender:</strong></DetailLabel>
        <DetailValue>{profile.dogGender || ''}</DetailValue>
      </DetailRow>
      <DetailRow>
        <DetailLabel><strong>Size:</strong></DetailLabel>
        <DetailValue>{profile.dogSize || ''}</DetailValue>
      </DetailRow>
      <DetailRow>
        <DetailLabel><strong>Immune:</strong></DetailLabel>
        <DetailValue>{profile.dogImmune || ''}</DetailValue>
      </DetailRow>
      <DetailRow>
        <DetailLabel><strong>Neutered:</strong></DetailLabel>
        <DetailValue>{profile.dogNeutered || ''}</DetailValue>
      </DetailRow>
      <DetailRow>
        <DetailLabel><strong>Suitable For:</strong></DetailLabel>
        <DetailValue>{profile.suitableFor || ''}</DetailValue>
      </DetailRow>
      <DetailRow>
        <DetailLabel><strong>Friendly with children:</strong></DetailLabel>
        <DetailValue>{profile.friendlyWithChildren || ''}</DetailValue>
      </DetailRow>
    </Card>
    <DetailRow>
      <DetailLabel><strong>A Little About Me</strong></DetailLabel>
    </DetailRow>
    <Card>
      {profile.dogDetails || ''}
    </Card>
    <DetailRow>
      <DetailLabel><strong>Care Instructions</strong></DetailLabel>
    </DetailRow>
    <Card>
      {profile.careInstructions || ''}
    </Card>
  </Card>
);

export default DogProfiles;