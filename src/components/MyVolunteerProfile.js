import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { FaWhatsapp } from 'react-icons/fa';
import { UserContext } from '../App';
import pawPrint from '../images/pawprint5.svg';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {  doc, getDoc, updateDoc, arrayRemove} from 'firebase/firestore';
import { DB } from './Config';



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
  padding: 20px;
  background-color: #CBD5D0;
  box-shadow: none;
  border-radius: 10px;
  margin-bottom: 20px;
  min-height: 200px; /* גובה קבוע לחלק העליון */
`;

const ProfileImage = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfilePic = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
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
  font-family: 'Quicksand', sans-serif;
  font-size: 3rem;
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
  font-size: 1.2rem;
  margin: 5px 0;
  color: var(--TEXT_COLOR_H1);
`;

const InnerText = styled.p`
  font-family: 'Quicksand', sans-serif;
  font-size: 1 rem;
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

const DetailValue = styled.span`
  align: left;
  display: flex;
  color: #666;
`;

const EditButton = styled.button`
  font-family: 'Quicksand', sans-serif;
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

const ReviewsContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
`;

const ReviewCard = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  width: 100%;
  background-color: #EFEFEF;
`;

const RequestItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer; /* Added cursor to indicate clickability */
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
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
  font-size: 1.5rem;
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

const Button = styled.button`
  background-color: ${props => props.primary ? '#4C7572' : '#B05D5D'};
  font-family: 'Quicksand', sans-serif;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: box-shadow 0.3s ease-in-out;
  min-width: 25px; /* מגדיר רוחב מינימלי אחיד לכפתורים */
  height: 25px; /* מגדיר גובה אחיד לכפתור המחק */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 10px; /* מוסיף מרווח מימין לכפתור */

  &:hover {
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.5);
    background-color: ${props => props.primary ? '#4C7572' : '#A04B4B'};
  }
`;

const RequestDOS = ({ requests, setApprovedRequests, userId }) => {
  const navigate = useNavigate();

  const handleItemClick = (id) => {
    navigate(`/dog-profile/${id}`);
  };

  const onDelete = async (index, requestToDelete) => {
    try {
      // Update Firebase
      const userRef = doc(DB, 'users', userId);
      await updateDoc(userRef, {
        approvedRequests: arrayRemove(requestToDelete)
      });

      // Update local state
      const updatedRequests = requests.filter((_, i) => i !== index);
      setApprovedRequests(updatedRequests);
    } catch (error) {
      console.error("Error deleting request:", error);
      // Optionally, add user feedback here (e.g., error message)
    }
  };
  
  return (
    <Card>
      <TitleSection>
        <TitleWithIcon>
          <img src={pawPrint} alt="Paw Print" />
          <SubTitle>Approved Requests</SubTitle>
        </TitleWithIcon>
      </TitleSection>
      {requests.length === 0 ? (
        <DetailValue>No approved requests at the moment</DetailValue> // הודעה במקרה שאין בקשות מאושרות
      ) : (
        requests.map((request, index) => (
          <RequestItem key={index} onClick={() => handleItemClick(request.uid)}>
            <Avatar src={request.profilePic || '../images/default-avatar.jpg'} alt={request.name} />
            <Info>
              <Name>{request.name}</Name>
              <Date>{request.date}</Date>
            </Info>
            <PhoneButton href={`https://wa.me/${request.mobile}`} target="_blank">
              <FaWhatsapp />
            </PhoneButton>
            <Button onClick={(e) => {
                e.stopPropagation(); // למנוע לחיצה על הבקשה כאשר לוחצים על ה-X
                onDelete(index, request);
            }}>X</Button> {/* כפתור מחיקה */}
          </RequestItem>
        ))
      )}
    </Card>
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
          <DetailLabel><strong>Name:</strong></DetailLabel>
          <input className="detail-value" name="name" value={formData.name} onChange={handleChange} />
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>Address:</strong></DetailLabel>
          <input className="detail-value" name="address" value={formData.address} onChange={handleChange} />
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>Age:</strong></DetailLabel>
          <input className="detail-value" name="age" value={formData.age} onChange={handleChange} />
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>Gender:</strong></DetailLabel>
          <div>
            <label>
              <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} />
              Male
            </label>
            <label>
              <input type="radio" name="gender"               value="Female" checked={formData.gender === 'Female'} onChange={handleChange} />
              Female
            </label>
          </div>
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>Number of Adoptions:</strong></DetailLabel>
          <input className="detail-value" name="numberOfAdoptions" value={formData.numberOfAdoptions} onChange={handleChange} />
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>Animal Experience:</strong></DetailLabel>
          <div>
            <label>
              <input type="radio" name="animalExperience" value="Yes" checked={formData.animalExperience === 'Yes'} onChange={handleChange} />
              Yes
            </label>
            <label>
              <input type="radio" name="animalExperience" value="No" checked={formData.animalExperience === 'No'} onChange={handleChange} />
              No
            </label>
          </div>
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>Additional Animals At Home:</strong></DetailLabel>
          <div>
            <label>
              <input type="radio" name="additionalAnimalsAtHome" value="Yes" checked={formData.additionalAnimalsAtHome === 'Yes'} onChange={handleChange} />
              Yes
            </label>
            <label>
              <input type="radio" name="additionalAnimalsAtHome" value="No" checked={formData.additionalAnimalsAtHome === 'No'} onChange={handleChange} />
              No
            </label>
          </div>
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>A House with a Yard:</strong></DetailLabel>
          <div>
            <label>
              <input type="radio" name="yard" value="Yes" checked={formData.yard === 'Yes'} onChange={handleChange} />
              Yes
            </label>
            <label>
              <input type="radio" name="yard" value="No" checked={formData.yard === 'No'} onChange={handleChange} />
              No
            </label>
          </div>
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>Children at Home:</strong></DetailLabel>
          <div>
            <label>
              <input type="radio" name="childrenAtHome" value="Yes" checked={formData.childrenAtHome === 'Yes'} onChange={handleChange} />
              Yes
            </label>
            <label>
              <input type="radio" name="childrenAtHome" value="No" checked={formData.childrenAtHome === 'No'} onChange={handleChange} />
              No
            </label>
          </div>
        </DetailRow>
      </>
    ) : (
      <>
        <DetailRow>
          <DetailLabel><strong>Name:</strong></DetailLabel>
          <DetailValue>{profile.name}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>Address:</strong></DetailLabel>
          <DetailValue>{profile.address}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>Age:</strong></DetailLabel>
          <DetailValue>{profile.age}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>Gender:</strong></DetailLabel>
          <DetailValue>{profile.gender}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>Number of Adoptions:</strong></DetailLabel>
          <DetailValue>{profile.numberOfAdoptions}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>Animal Experience:</strong></DetailLabel>
          <DetailValue>{profile.animalExperience}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>Additional Animals At Home:</strong></DetailLabel>
          <DetailValue>{profile.additionalAnimalsAtHome}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>A House with a Yard:</strong></DetailLabel>
          <DetailValue>{profile.yard}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel><strong>Children at Home:</strong></DetailLabel>
          <DetailValue>{profile.childrenAtHome}</DetailValue>
        </DetailRow>
      </>
    )}
  </Card>
);

const AboutMe = ({ profile, isEditing, formData, handleChange }) => (
  <Card>
    <TitleSection>
      <TitleWithIcon>
        <img src={pawPrint} alt="Paw Print" />
        <SubTitle>A Little About Me</SubTitle>
      </TitleWithIcon>
    </TitleSection>
    {isEditing ? (
      <textarea
        className="detail-value"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows="4"
      />
    ) : (
      <DetailValue>{profile.description}</DetailValue>
    )}
  </Card>
);

const Reviews = ({ reviews }) => (
  <Card>
    <TitleSection>
      <TitleWithIcon>
        <img src={pawPrint} alt="Paw Print" />
        <SubTitle>Reviews</SubTitle>
      </TitleWithIcon>
    </TitleSection>
    <ReviewsContainer>
      {reviews && reviews.length > 0 ? (
        reviews.map((review, index) => (
          <ReviewCard key={index}>
            <DetailLabel><strong>{review.reviewerName}:</strong></DetailLabel>
            <InnerText>{review.text}</InnerText>
          </ReviewCard>
        ))
      ) : (
        <DetailValue>No reviews available</DetailValue>
      )}
    </ReviewsContainer>
  </Card>
);


const VolProfileCard = ({ profile, onSave, approvedRequests, setApprovedRequests, user, reviews }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    await onSave({
      ...formData,
      profilePic: formData.profilePic,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const localURL = URL.createObjectURL(file);
      setFormData({
        ...formData,
        profilePic: localURL,
      });

      const storage = getStorage();
      const storageRef = ref(storage, `profile_pics/${user.firebaseUser.uid}`);

      try {
        await uploadBytes(storageRef, file);
        const profilePicURL = await getDownloadURL(storageRef);

        setFormData(prevData => ({
          ...formData,
          profilePic: profilePicURL,
        }));

        URL.revokeObjectURL(localURL);
      } catch (error) {
        console.error("Error uploading image:", error);
        setFormData(prevData => ({
          ...prevData,
          profilePic: profile.profilePic,
        }));
      }
    }
  };

  return (
    <Container>
      <GlobalStyle />
      <Header>
        <BasicInfo>
          <VolunteerName>{formData.name}</VolunteerName>
          <Text>{formData.address}</Text>
        </BasicInfo>
        <ProfileImage>
          <ProfilePic src={formData.profilePic} alt={`${profile.name}`} onError={(e) => {
    console.error("Error loading profile picture:", e);
    e.target.src = 'path/to/default/image.jpg'; // Fallback to a default image
  }}/>
          <ProfileUploadButton onClick={() => document.getElementById('profileImageUpload').click()}>+</ProfileUploadButton>
          <input
            type="file"
            id="profileImageUpload"
            style={{ display: 'none' }}
            onChange={handleProfileImageUpload}
          />
        </ProfileImage>
      </Header>
            <ProfileSectionWrapper>
        <Section>
          <PersonalDetails profile={profile} isEditing={isEditing} formData={formData} handleChange={handleChange} />
          <AboutMe profile={profile} isEditing={isEditing} formData={formData} handleChange={handleChange} />
          {isEditing ? (
            <EditButton onClick={handleSaveClick}>Save Profile</EditButton>
          ) : (
            <EditButton onClick={handleEditClick}>Edit Profile</EditButton>
          )}
        </Section>
        <Section>
          <Reviews reviews={reviews} />
          <RequestDOS requests={approvedRequests} setApprovedRequests={setApprovedRequests} userId={user.firebaseUser.uid} /> {/* העברת setApprovedRequests */}
        </Section>
      </ProfileSectionWrapper>
    </Container>
  );
};


const checkUserDetails = (details) => {
  const requiredFields = [
    'name', 'address', 'age', 'gender', 'numberOfAdoptions', 'animalExperience', 'additionalAnimalsAtHome', 'yard', 'childrenAtHome'
  ];
  return requiredFields.every(field => details[field]);
};

const VolProfile = () => {
  const { user, updateUserDetails } = useContext(UserContext);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);


  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        const docRef = doc(DB, 'users', user.firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setApprovedRequests(data.approvedRequests || []);
          setReviews(data.reviews || []);
          if (!checkUserDetails(data)) {
            setShowDetailsPopup(true);
          }
        } else {
          setApprovedRequests([]);
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setApprovedRequests([]);
        setReviews([]);
      }
    };

    fetchApprovedRequests();
  }, [user.firebaseUser.uid]);

  // const dummyProfile = {
  //   ...user.details,
  //   reviews: [
  //     {
  //       reviewer: 'Alice',
  //       date: '2023-01-01',
  //       location: 'New York',
  //       text: 'Great volunteer! Very reliable and kind.'
  //     },
  //     {
  //       reviewer: 'Bob',
  //       date: '2023-02-15',
  //       location: 'Los Angeles',
  //       text: 'Took excellent care of the animals.'
  //     },
  //     {
  //       reviewer: 'Charlie',
  //       date: '2023-03-10',
  //       location: 'Chicago',
  //       text: 'Would definitely recommend!'
  //     }
  //   ]
  // };

  return (
    <div>
      {showDetailsPopup && (
        <PopupContainer>
          <PopupMessage>
            Don't forget to fill all your details :)<br />
          </PopupMessage>
          <CloseButton onClick={() => setShowDetailsPopup(false)}>X</CloseButton>
        </PopupContainer>
      )}
      <VolProfileCard
        profile={user.details}
        onSave={updateUserDetails}
        approvedRequests={approvedRequests}
        setApprovedRequests={setApprovedRequests}  // העברת הפונקציה כ- prop
        user={user}
        reviews={reviews}
      />
    </div>
  );
};

export default VolProfile;
