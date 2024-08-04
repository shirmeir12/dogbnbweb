import React, { useState, useContext, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import pawPrint from '../images/pawprint5.svg';
import { UserContext } from '../App';
import { DB } from './Config';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, writeBatch } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const GlobalStyle = createGlobalStyle`
  :root {
    --TITLE_FONT: 'Source Serif Pro', serif;
    --TEXT_FONT: Arial, sans-serif;
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

const ProfileImageWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-left: 20px;
  z-index: 2;
`;

const ProfileUploadButton = styled.button`
  background-color: #6591A4;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  width: 30px;
  height: 30px;
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.5);
  }
`;

const BasicInfo = styled.div`
  text-align: left;
  flex-grow: 1;
`;

const VolunteerName = styled.h2`
  font-family: arial;
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
  font-family: var(--TEXT_FONT);
  font-size: 1.2rem;
  margin: 5px 0;
  color: var(--TEXT_COLOR_H1);
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

const EditButton = styled.button`
  background-color: #628991;
  color: #ffffff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  transition: box-shadow 0.3s ease-in-out;
  display: inline-block;
  width: auto;

  &:hover {
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.5);
    background-color: #628991;
  }
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

const RequestItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
  cursor: pointer;
`;

const Info = styled.div`
  flex-grow: 1;
`;

const Name = styled.div`
  font-weight: bold;
  cursor: pointer;
`;

const Date = styled.div`
  color: grey;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px; /* רווח בין הכפתורים אם רצוי */
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#4C7572' : '#B05D5D'};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: box-shadow 0.3s ease-in-out;
  min-width: 90px; /* מגדיר רוחב מינימלי אחיד לכפתורים */
  height: 40px;

  &:hover {
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.5);
    background-color: ${props => props.primary ? '#4C7572' : '#B05D5D'};
  }
`;

const PhoneButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #25D366;
  color: white;
  padding: 5px;
  border-radius: 50%;
  text-decoration: none;
  text-align: center;
  transition: box-shadow 0.3s ease-in-out;
  width: 40px;
  height: 40px;

  &:hover {
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.5);
  }

  svg {
    font-size: 20px;
  }
`;

const GalleryCard = styled(Card)`
  width: 100%;
`;

const UploadButton = styled.button`
  background-color: #628991;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  transition: box-shadow 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.5);
  }
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

const MessageContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  z-index: 1000;
`;

const Message = styled.p`
  color: white;
  font-size: 1.5rem;
  margin: 0;
`;

const GalleryImage = styled.img`
  width: 150px;
  height: 150px;
  margin: 10px;
  border-radius: 10px;
  cursor: pointer;
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

const RadioGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5px;
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
  white-space: nowrap; /* Prevents line breaks */
`;

const PopupMessage = styled.div`
  color: #46454A !important; /* Ensures the color is applied */
  font-size: 1.2rem !important; /* Ensures the font size is applied */
  margin: 10px !important; /* Ensures the margin is applied */
`;


const Gallery = ({ images, onUpload }) => {
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await onUpload(file);
    }
  };

  return (
    <GalleryCard>
      <TitleSection>
        <SubTitle>Gallery</SubTitle>
      </TitleSection>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <UploadButton onClick={() => document.getElementById('imageUpload').click()}>
          +
        </UploadButton>
        {images.map((image, index) => (
          <GalleryImage
            key={index}
            src={image}
            alt={`gallery-${index}`}
            onClick={() => openModal(index)}
          />
        ))}
      </div>
      <input
        type="file"
        id="imageUpload"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
      {selectedImageIndex !== null && (
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

const PersonalDetails = ({ profile, isEditing, formData, handleChange }) => (
  <Card>
    <TitleSection>
      <TitleWithIcon>
        <img src={pawPrint} alt="Paw Print" />
        <SubTitle>Personal Details</SubTitle>
      </TitleWithIcon>
    </TitleSection>
    {isEditing ? (
      <>
        <DetailRow>
          <DetailLabel><strong>Owner Name:</strong></DetailLabel>
          <input className="detail-value" name="name" value={formData.name} onChange={handleChange} />
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>Address:</strong></DetailLabel>
          <input className="detail-value" name="address" value={formData.address} onChange={handleChange} />
        </DetailRow>
      </>
    ) : (
      <>
        <DetailRow>
          <DetailLabel><strong>Owner Name:</strong></DetailLabel>
          <DetailValue>{profile.name}</DetailValue>
        </DetailRow>
        <DetailRow style={{ marginBottom: '20px' }}>
          <DetailLabel><strong>Address:</strong></DetailLabel>
          <DetailValue>{profile.address}</DetailValue>
        </DetailRow>
      </>
    )}
    <DetailRow>
      <DogIdLabel><strong>Dog I.D</strong></DogIdLabel>
    </DetailRow>
    <Card>
      {isEditing ? (
        <>
          <DetailRow>
            <DetailLabel><strong>Name:</strong></DetailLabel>
            <input className="detail-value" name="dogName" value={formData.dogName} onChange={handleChange} />
          </DetailRow>
          <DetailRow>
            <DetailLabel><strong>Breed:</strong></DetailLabel>
            <input className="detail-value" name="dogType" value={formData.dogType} onChange={handleChange} />
          </DetailRow>
          <DetailRow>
            <DetailLabel><strong>Age:</strong></DetailLabel>
            <input className="detail-value" name="dogAge" value={formData.dogAge} onChange={handleChange} />
          </DetailRow>
          <DetailRow>
            <DetailLabel><strong>Gender:</strong></DetailLabel>
            <RadioGroup>
              <label>
                <input type="radio" name="dogGender" value="Male" checked={formData.dogGender === 'Male'} onChange={handleChange} />
                Male
              </label>
              <label>
                <input type="radio" name="dogGender" value="Female" checked={formData.dogGender === 'Female'} onChange={handleChange} />
                Female
              </label>
            </RadioGroup>
          </DetailRow>
          <DetailRow>
            <DetailLabel><strong>Size:</strong></DetailLabel>
            <RadioGroup>
              <label>
                <input type="radio" name="dogSize" value="Small" checked={formData.dogSize === 'Small'} onChange={handleChange} />
                Small
              </label>
              <label>
                <input type="radio" name="dogSize" value="Medium" checked={formData.dogSize === 'Medium'} onChange={handleChange} />
                Medium
              </label>
              <label>
                <input type="radio" name="dogSize" value="Large" checked={formData.dogSize === 'Large'} onChange={handleChange} />
                Large
              </label>
            </RadioGroup>
          </DetailRow>
          <DetailRow>
            <DetailLabel><strong>Immune:</strong></DetailLabel>
            <RadioGroup>
              <label>
                <input type="radio" name="dogImmune" value="Yes" checked={formData.dogImmune === 'Yes'} onChange={handleChange} />
                Yes
              </label>
              <label>
                <input type="radio" name="dogImmune" value="No" checked={formData.dogImmune === 'No'} onChange={handleChange} />
                No
              </label>
            </RadioGroup>
          </DetailRow>
          <DetailRow>
            <DetailLabel><strong>Neutered:</strong></DetailLabel>
            <RadioGroup>
              <label>
                <input type="radio" name="dogNeutered" value="Yes" checked={formData.dogNeutered === 'Yes'} onChange={handleChange} />
                Yes
              </label>
              <label>
                <input type="radio" name="dogNeutered" value="No" checked={formData.dogNeutered === 'No'} onChange={handleChange} />
                No
              </label>
            </RadioGroup>
          </DetailRow>
          <DetailRow>
            <DetailLabel><strong>Suitable For:</strong></DetailLabel>
            <RadioGroup>
              <label>
                <input type="radio" name="suitableFor" value="Apartment" checked={formData.suitableFor === 'Apartment'} onChange={handleChange} />
                Apartment
              </label>
              <label>
                <input type="radio" name="suitableFor" value="House with yard" checked={formData.suitableFor === 'House with yard'} onChange={handleChange} />
                House with yard
              </label>
            </RadioGroup>
          </DetailRow>
          <DetailRow>
            <DetailLabel><strong>Friendly with children:</strong></DetailLabel>
            <RadioGroup>
              <label>
                <input type="radio" name="friendlyWithChildren" value="Yes" checked={formData.friendlyWithChildren === 'Yes'} onChange={handleChange} />
                Yes
              </label>
              <label>
                <input type="radio" name="friendlyWithChildren" value="No" checked={formData.friendlyWithChildren === 'No'} onChange={handleChange} />
                No
              </label>
            </RadioGroup>
          </DetailRow>
        </>
            ) : (
              <>
                <DetailRow>
                  <DetailLabel><strong>Name:</strong></DetailLabel>
                  <DetailValue>{formData.dogName}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel><strong>Breed:</strong></DetailLabel>
                  <DetailValue>{formData.dogType}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel><strong>Age:</strong></DetailLabel>
                  <DetailValue>{formData.dogAge}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel><strong>Gender:</strong></DetailLabel>
                  <DetailValue>{formData.dogGender}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel><strong>Size:</strong></DetailLabel>
                  <DetailValue>{formData.dogSize}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel><strong>Immune:</strong></DetailLabel>
                  <DetailValue>{formData.dogImmune}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel><strong>Neutered:</strong></DetailLabel>
                  <DetailValue>{formData.dogNeutered}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel><strong>Suitable For:</strong></DetailLabel>
                  <DetailValue>{formData.suitableFor}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel><strong>Friendly with children:</strong></DetailLabel>
                  <DetailValue>{formData.friendlyWithChildren}</DetailValue>
                </DetailRow>
              </>
            )}
          </Card>
          <DetailRow>
            <DetailLabel><strong>A Little About Me</strong></DetailLabel>
          </DetailRow>
          <Card>
            {isEditing ? (
              <>
                <textarea
                  className="detail-value"
                  name="dogDetails"
                  value={formData.dogDetails}
                  onChange={handleChange}
                  rows="4"
                  style={{ width: '100%' }}
                />
              </>
            ) : (
              <Text>{profile.dogDetails}</Text>
            )}
          </Card>
          <DetailRow>
            <DetailLabel><strong>Care Instructions</strong></DetailLabel>
          </DetailRow>
          <Card>
            {isEditing ? (
              <>
                <textarea
                  className="detail-value"
                  name="careInstructions"
                  value={formData.careInstructions}
                  onChange={handleChange}
                  rows="4"
                  style={{ width: '100%' }}
                />
              </>
            ) : (
              <Text>{profile.careInstructions}</Text>
            )}
          </Card>
        </Card>
      );
      
      const RequestActions = ({ requests, onAccept, onDelete, isLoading }) => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const navigate = useNavigate();
      
        const handleNameClick = (id) => {
          navigate(`/volunteer-profile/${id}`);
        };
      
        return (
          <Card>
            <TitleSection>
              <TitleWithIcon>
                <img src={pawPrint} alt="Paw Print" />
                <SubTitle>Requests</SubTitle>
              </TitleWithIcon>
            </TitleSection>
            {isLoading ? (
              <p>Loading requests...</p>
            ) : !requests || requests.length === 0 ? (
              <p>No requests at this time.</p>
            ) : (
              requests.map((request, index) => (
                <RequestItem key={index}>
                  <Avatar src={request.profilePic} alt={request.name} onClick={() => handleNameClick(request.userId)} />
                  <Info>
                    <Name onClick={() => handleNameClick(request.userId)}>{request.name}</Name>
                    <Date>{request.date}</Date>
                  </Info>
                  <ActionButtons>
                    <Button onClick={() => onDelete(index)}>Delete</Button>
                    <Button primary onClick={() => onAccept(index)}>Accept</Button>
                  </ActionButtons>
                </RequestItem>
              ))
            )}
          </Card>
        );
      };
      
      
      const DogSitters = ({ sitters, onDelete, onAddReview }) => {
        const navigate = useNavigate();
        const [reviewIndex, setReviewIndex] = useState(null);
        const [reviewText, setReviewText] = useState('');
      
        const handleAddReview = (index) => {
          setReviewIndex(index);
        };
      
        const handleSaveReview = async () => {
          await onAddReview(reviewIndex, reviewText);
          setReviewIndex(null);
          setReviewText('');
        };
      
        const handleCloseReview = () => {
          setReviewIndex(null);
          setReviewText('');
        };
      
        const handleNameClick = (id) => {
          navigate(`/volunteer-profile/${id}`);
        };
      
        const formatPhoneNumber = (number) => {
          if (!number) return ''; // Return empty string if number is undefined
          return number.startsWith('0') ? `+972${number.substring(1)}` : number;
        };
      
        return (
          <Card>
            <TitleSection>
              <TitleWithIcon>
                <img src={pawPrint} alt="Paw Print" />
                <SubTitle>My Dog Sitters</SubTitle>
              </TitleWithIcon>
            </TitleSection>
            {sitters.map((sitter, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <RequestItem>
                  <Avatar src={sitter.profilePic} alt={sitter.name} onClick={() => handleNameClick(sitter.id)} />
                  <Info>
                    <Name onClick={() => handleNameClick(sitter.userId)}>{sitter.name}</Name>
                    <Date>{sitter.date}</Date>
                  </Info>
                  <ActionButtons>
                    <PhoneButton href={`https://wa.me/${formatPhoneNumber(sitter.mobile)}`} target="_blank">
                      <FaWhatsapp />
                    </PhoneButton>
                    <Button style={{ width: '80px' }} onClick={() => onDelete(index)}>Delete</Button>
                    <Button primary style={{ width: '110px' }} onClick={() => handleAddReview(index)}>Add Review</Button>
                  </ActionButtons>
                </RequestItem>
                {reviewIndex === index && (
                  <div style={{ position: 'relative', width: '100%' }}>
                    <button
                      onClick={handleCloseReview}
                      style={{
                        position: 'absolute',
                        top: '-15px',
                        left: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        color: '#B05D5D',
                        padding: '5',
                      }}
                    >
                      ×
                    </button>
                    <textarea
                      rows="4"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      style={{ width: 'calc(100% - 20px)', margin: '10px 10px 0 10px' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', marginLeft: '10px', marginRight: '10px' }}>
                      <Button
                        primary
                        style={{ backgroundColor: '#91cab6', color: '#fff' }}
                        onClick={handleSaveReview}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </Card>
        );
      };
      
      
      
      
      const DogProfileCard = ({ 
        profile, 
        onSave, 
        requests, 
        sitters, 
        handleRequestAccept,  
        handleRequestDelete,
        handleSitterDelete, 
        handleAddReview, 
        galleryImages, 
        onImageUpload,
        isLoading 
        
      }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [formData, setFormData] = useState(profile);
      
        const handleEditClick = () => {
          setIsEditing(true);
        };
      
        const handleSaveClick = async () => {
          setIsEditing(false);
          await onSave(formData);
        };
      
        const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData({
            ...formData,
            [name]: value,
          });
        };
      
        // Adding profile image upload functionality
        const handleProfileImageUpload = async (e) => {
          const file = e.target.files[0];
          if (file) {
            const localURL = URL.createObjectURL(file);
            setFormData({
              ...formData,
              profilePic: localURL,
            });
      
            const storage = getStorage();
            const storageRef = ref(storage, `profile_pics/${profile.uid}/${file.name}`);
      
            try {
              await uploadBytes(storageRef, file);
              const profilePicURL = await getDownloadURL(storageRef);
      
              await updateDoc(doc(DB, 'users', profile.uid), {
                profilePic: profilePicURL
              });
      
              setFormData({
                ...formData,
                profilePic: profilePicURL,
              });
      
              URL.revokeObjectURL(localURL);
            } catch (error) {
              console.error("Error uploading image:", error);
              setFormData({
                ...formData,
                profilePic: profile.profilePic,
              });
            }
          }
        };
      
        // Removing extra commas from the address
        const formattedAddress = formData.address?.replace(/,+/g, ',').replace(/^,|,$/g, '').trim();

        return (
          <Container>
            <GlobalStyle />
            <Header>
              <BasicInfo>
                <VolunteerName>{formData.name}</VolunteerName>
                <Text>{formData.dogName}</Text>
                <Text>{[formData.dogType, formData.dogAge, formData.dogSize].filter(Boolean).join(', ')}</Text>
                <Text>{formattedAddress}</Text>
              </BasicInfo>
              <ProfileImageWrapper>
                <ProfileImage src={formData.profilePic} alt={`${profile.name}`} />
                <ProfileUploadButton onClick={() => document.getElementById('profileImageUpload').click()}>+</ProfileUploadButton>
                <input
                  type="file"
                  id="profileImageUpload"
                  style={{ display: 'none' }}
                  onChange={handleProfileImageUpload}
                />
              </ProfileImageWrapper>
            </Header>
            <ProfileSectionWrapper>
              <Section>
                <PersonalDetails profile={profile} isEditing={isEditing} formData={formData} handleChange={handleChange} />
                {isEditing ? (
                  <EditButton onClick={handleSaveClick}>Save Profile</EditButton>
                ) : (
                  <EditButton onClick={handleEditClick}>Edit Profile</EditButton>
                )}
              </Section>
              <Section>
                <RequestActions
                  requests={requests}
                  onAccept={handleRequestAccept}
                  onDelete={handleRequestDelete}
                  isLoading={isLoading}
                />
                <DogSitters
                  sitters={sitters}
                  onDelete={handleSitterDelete}
                  onAddReview={handleAddReview}
                />
              </Section>
            </ProfileSectionWrapper>
            <Gallery images={galleryImages} onUpload={onImageUpload} />

          </Container>
        );
      };
      
      const MyProfile = () => {
        const { user, updateUserDetails } = useContext(UserContext);
        const [requests, setRequests] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [sitters, setSitters] = useState([]);
        const [galleryImages, setGalleryImages] = useState([user.details.profilePic]);
        const [showDetailsPopup, setShowDetailsPopup] = useState(false);
      
        useEffect(() => {
          const fetchUserData = async () => {
            try {
              setIsLoading(true);
              const docRef = doc(DB, 'users', user.firebaseUser.uid);
              const docSnap = await getDoc(docRef);
        
              if (docSnap.exists()) {
                const data = docSnap.data();
                setRequests(data.connectionRequests || []);
                setSitters(data.sitters || []);
                setGalleryImages(data.galleryImages || []); // Initialize with existing gallery images
        
                if (!checkUserDetails(data)) {
                  setShowDetailsPopup(true);
                }
              } else {
                setRequests([]);
                setSitters([]);
                setGalleryImages([]);
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
              setRequests([]);
              setSitters([]);
              setGalleryImages([]);
            } finally {
              setIsLoading(false);
            }
          };
        
          fetchUserData();
        }, [user.firebaseUser.uid]);
      
        const checkUserDetails = (details) => {
          const requiredFields = [
            'name', 'address', 'dogName', 'dogType', 'dogAge', 'dogGender', 'dogSize', 'dogImmune', 'dogNeutered', 'suitableFor', 'friendlyWithChildren'
          ];
          return requiredFields.every(field => details[field]);
        };
      
        const handleRequestAccept = async (index) => {
          const acceptedRequest = requests[index];
          const userDocRef = doc(DB, 'users', user.firebaseUser.uid);
          const volunteerDocRef = doc(DB, 'users', acceptedRequest.userId);
      
          try {
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
              console.log("User document does not exist!");
              return;
            }
      
            const userData = userDoc.data();
            const newConnectionRequests = userData.connectionRequests.filter(
              (request) => request.userId !== acceptedRequest.userId
            );
      
            const batch = writeBatch(DB);
            batch.update(userDocRef, {
              connectionRequests: newConnectionRequests,
              sitters: arrayUnion(acceptedRequest)
            });
      
            batch.update(volunteerDocRef, {
              approvedRequests: arrayUnion({
                uid: user.firebaseUser.uid,
                name: userData.name,
                profilePic: userData.profilePic,
                mobile: userData.mobile
              })
            });
      
            await batch.commit();
      
            setSitters((prevSitters) => [...prevSitters, acceptedRequest]);
            setRequests((prevRequests) => prevRequests.filter((_, i) => i !== index));
      
            console.log("Request accepted successfully");
          } catch (error) {
            console.error("Error accepting request:", error);
          }
        };
      
        const handleRequestDelete = async (index) => {
          try {
            const requestToDelete = requests[index];
            const userDocRef = doc(DB, 'users', user.firebaseUser.uid);
      
            await updateDoc(userDocRef, {
              connectionRequests: arrayRemove(requestToDelete)
            });
      
            setRequests(prevRequests => prevRequests.filter((_, i) => i !== index));
          } catch (error) {
            console.error("Error deleting request:", error);
          }
        };
      
        const handleSitterDelete = async (index) => {
          try {
            const sitterToDelete = sitters[index];
            const userDocRef = doc(DB, 'users', user.firebaseUser.uid);
      
            await updateDoc(userDocRef, {
              sitters: arrayRemove(sitterToDelete)
            });
      
            setSitters(prevSitters => prevSitters.filter((_, i) => i !== index));
          } catch (error) {
            console.error("Error deleting sitter:", error);
          }
        };
      
        const handleAddReview = async (index, reviewText) => {
          try {
            const sitterToUpdate = sitters[index];
            const userDocRef = doc(DB, 'users', user.firebaseUser.uid);
            const volunteerDocRef = doc(DB, 'users', sitterToUpdate.userId);
      
            const review = {
              reviewerId: user.firebaseUser.uid,
              reviewerName: user.details.name,
              text: reviewText,
            };
      
            await updateDoc(volunteerDocRef, {
              reviews: arrayUnion(review)
            });
      
            setSitters(prevSitters => prevSitters.map((sitter, i) =>
              i === index ? { ...sitter, review: reviewText } : sitter
            ));
          } catch (error) {
            console.error("Error adding review:", error);
          }
        };
      
        const handleImageUpload = async (file) => {
          try {
            console.log("Starting image upload...");
            const storage = getStorage();
            const storageRef = ref(storage, `gallery/${user.firebaseUser.uid}/${file.name}`);
            
            console.log("Uploading file to Firebase Storage...");
            await uploadBytes(storageRef, file);
            
            console.log("Getting download URL...");
            const downloadURL = await getDownloadURL(storageRef);
        
            console.log("Updating local state...");
            setGalleryImages(prevImages => [...prevImages, downloadURL]);
        
            console.log("Updating Firestore document...");
            const userDocRef = doc(DB, 'users', user.firebaseUser.uid);
            await updateDoc(userDocRef, {
              galleryImages: arrayUnion(downloadURL)
            });
        
            console.log("Image uploaded and saved successfully");
          } catch (error) {
            console.error("Error uploading image:", error.message);
            console.error("Error code:", error.code);
            console.error("Full error:", error);
          }
        };
        
        return (
          <div>
            {showDetailsPopup && (
              <PopupContainer>
                <PopupMessage>
                  Don't forget to fill all your details :)
                </PopupMessage>
                <CloseButton onClick={() => setShowDetailsPopup(false)}>X</CloseButton>
              </PopupContainer>
            )}
            <DogProfileCard
              profile={user.details}
              onSave={updateUserDetails}
              requests={requests}
              sitters={sitters}
              handleRequestAccept={handleRequestAccept}
              handleRequestDelete={handleRequestDelete}
              handleSitterDelete={handleSitterDelete}
              handleAddReview={handleAddReview}
              galleryImages={galleryImages}
              onImageUpload={handleImageUpload}
              isLoading={isLoading}
            />
          </div>
        );
      };
      
      export default MyProfile;
       