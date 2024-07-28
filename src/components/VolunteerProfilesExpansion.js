import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { doc, getDoc } from 'firebase/firestore';
import { DB } from './Config';
import person1 from '../images/person1.jpg';
import pawPrint from '../images/pawprint5.svg';
import { updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Ensure this import is present


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

const ReviewsContainer = styled(Card)`
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

const PawPrint = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px; 
`;


const VolProfile = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    addres: '',
    age: '',
    additionalAnimalsAtHome: '',
    animalExperience: '',
    childrenAtHome: '',
    description: '',
    gender: '',
    mobile: '',
    numberOfAdoptions: '',
    profilePic: '',
    yard: '',
    reviews: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setProfile(data);
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
      // You might want to show an error message to the user or redirect to login
      return;
    }

  };
  

    
  return (
    <Container>
      <GlobalStyle />
      <Header>
        <BasicInfo>
          <VolunteerName>{profile.name}</VolunteerName>
          <Text>{profile.address}</Text>
        </BasicInfo>
        <ProfileImage src={profile.profilePic || person1} alt={`${profile.name}`} />
      </Header>
      <ProfileSectionWrapper>
        <Section>
          <Card>
            <TitleSection>
              <PawPrint src={pawPrint} alt="Paw Print" />
              <SubTitle>Volunteer I.D</SubTitle>
            </TitleSection>
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
          </Card>
          <Card>
            <TitleSection>
              <PawPrint src={pawPrint} alt="Paw Print" />
              <SubTitle>A Little About Me</SubTitle>
            </TitleSection>
            <Text>{profile.description}</Text>
          </Card>
        </Section>
        <Section>
          <ReviewsContainer>
            <TitleSection>
              <PawPrint src={pawPrint} alt="Paw Print" />
              <SubTitle>Reviews</SubTitle>
            </TitleSection>
            {Array.isArray(profile.reviews) && profile.reviews.map((review, index) => (
              <ReviewCard key={index}>
                <DetailLabel><strong>{review.reviewer}:</strong></DetailLabel>
                <DetailValue>{review.date}, {review.location}</DetailValue>
                <Text>{review.text}</Text>
              </ReviewCard>
            ))}
          </ReviewsContainer>
        </Section>
      </ProfileSectionWrapper>
    </Container>
  );
};



// const VolProfile = () => {
//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     const exampleProfile = {
//       name: "John Doe",
//       address: "123 Main St, Anytown, USA",
//       age: 30,
//       gender: "Male",
//       adoptions: 5,
//       animalExperience: "Yes",
//       additionalAnimals: "Yes",
//       yard: "Yes",
//       children: "Yes",
//       description: "I am a dedicated animal lover with years of experience in taking care of pets.",
//       reviews: [
//         {
//           reviewer: "Jane Smith",
//           date: "2023-06-01",
//           location: "Anytown, USA",
//           text: "John was fantastic! He took great care of our dog."
//         },
//         {
//           reviewer: "Emily Johnson",
//           date: "2023-07-15",
//           location: "Anytown, USA",
//           text: "Very reliable and good with animals."
//         }
//       ],
//       photo: person1 
//     };
//     setProfile(exampleProfile);
//   }, []);

//   if (!profile) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <VolProfileCard profile={profile} />
//     </div>
//   );
// };

export default VolProfile;
