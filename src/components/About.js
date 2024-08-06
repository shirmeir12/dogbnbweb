import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import CustomRating from './CustomRating';
import dor from '../images/dor.png';
import itay from '../images/itay.png';
import yossi from '../images/yossi.jpg';
import yael from '../images/person2.jpg';
import trusted from '../images/trusted-community.png';
import seamless from '../images/seamless-coordination.png';
import personalized from '../images/personalized-care.png';
import galleryImage1 from '../images/lucky1.jpg';
import galleryImage2 from '../images/lucky2.jpg';
import galleryImage3 from '../images/lucky3.jpg';
import galleryImage4 from '../images/bulu1.jpg';
import galleryImage5 from '../images/dog5.jpg';
import galleryImage6 from '../images/dog6.jpg';

const GlobalStyle = createGlobalStyle`
  :root {
    --TITLE_FONT: 'Arial', sans-serif;
    --TEXT_FONT: Arial, sans-serif;
    --TITLE_COLOR_H1: #4C7572;
    --BACKGROUND_COLOR: #F0EDEB;
    --TEXT_COLOR_H1: #46454A;
    --BUTTON_COLOR_H1: #628991;
    --REVIEW_BG: #ffffff;
    --REVIEW_SHADOW: rgba(0, 0, 0, 0.1);
    --REVIEW_TITLE_COLOR: #605F85;
    --SECTION_BG_1: #DDE4E0;
    --SECTION_BG_2: #EFEFEF;
    --SECTION_BG_3: #D4D1D7;
    --SECTION_BG_4: #EFEFEF;
    --SECTION_BG_5: #D6DFE0;
  }

  body {
    background-color: var(--BACKGROUND_COLOR);
    font-family: var(--TEXT_FONT);
    margin: 0;
    padding: 0;
    color: var(--TEXT_COLOR_H1);
  }
`;

const MainAbout = styled.div`
  text-align: center;
`;

const Section = styled.div`
  padding: 40px 20px;
  background-color: ${(props) => props.bgColor || '#ffffff'};
`;

const AboutContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: left;

  p {
    margin: 10px 0;
    line-height: 1.5;
  }

  h1 {
    color: var(--TITLE_COLOR_H1);
    font-family: var(--TITLE_FONT);
  }
`;

const ReviewsSection = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Review = styled.div`
  background-color: var(--REVIEW_BG);
  padding: 20px;
  margin: 10px;
  border-radius: 10px;
  width: calc(25% - 40px);
  box-shadow: 0 4px 8px var(--REVIEW_SHADOW);
  text-align: left;

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    float: left;
    margin-right: 20px;
    object-fit: cover;
  }

  h3 {
    color: var(--REVIEW_TITLE_COLOR);
    margin-top: 0;
  }

  p {
    padding: 20px;  
    margin: 0;
    clear: both;
  }
`;

const RatingSection = styled.div`
  margin-top: 40px;
  font-size: 2em;
`;

const HowItWorksSection = styled.div`
  padding-bottom: 20px;
  background-color: ${(props) => props.bgColor || '#ffffff'};
  padding-top: 40px;
`;

const HowItWorks = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;

  div {
    flex: 1;
    margin: 20px;
  }
`;

const Feature = styled.div`
  text-align: center;
  flex: 1;
  margin: 0 20px;

  img {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
  }

  h3 {
    color: var(--TITLE_COLOR_H1);
  }

  p {
    color: var(--TEXT_COLOR_H1);
  }
`;

const GallerySection = styled.div`
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;

  img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
  }
`;

const main_about = () => {
  return (
    <MainAbout>
      <GlobalStyle />
      <Section bgColor="var(--SECTION_BG_1)">
        <AboutContent>
          <h1>About DogBNB</h1>
          <p>
            Welcome to DogBNB, a platform supporting Israel’s reserved duty soldiers ("miluim") during challenging times.
            We connect these brave individuals with compassionate volunteers eager to care for their dogs.
          </p>
          <p>
            Our mission is to provide peace of mind to our soldiers, ensuring their beloved pets are in good hands while
            they are away. By fostering a community of support, we aim to alleviate some burdens on our soldiers, allowing
            them to focus on their duties, knowing their furry friends are safe and cared for.
          </p>
          <h2>Join us making a difference, one dog at a time!</h2>
        </AboutContent>
      </Section>
      <Section bgColor="var(--SECTION_BG_2)">
        <ReviewsSection>
          <Review>
            <img src={dor} alt="Dor, Golani unit" />
            <h3>Dor, Golani unit</h3>
            <p>
              “I recently had to go on miluim and was worried about my dog, Max. Thankfully, I found DogBNB, and connected with Shira.
              She took such great care of Max. It was wonderful to get updates and see him happy and well taken care of. I am incredibly
              grateful for her kindness and the platform for making this possible. Thank you!”
            </p>
          </Review>
          <Review>
            <img src={itay} alt="Itay, Palsar and Nastya, volunteer" />
            <h3>Itay, Palsar Givati</h3>
            <p>
              “As a Palsar's soldeir in miluim, I was concerned about leaving my dog, Timothiy. I found DogBNB and connected with Nastya.
              She took great care of Timothiy and sent photos. It felt good to know my dog was in good hands. Thank you for making this
              possible.”
            </p>
          </Review>
          <Review>
            <img src={yossi} alt="Placeholder" />
            <h3>Yossi, Nahal Brigade</h3>
            <p>
              “DogBNB was a lifesaver! My dog, Luna, got the best care while I was on duty. Couldn't have asked for a better service. Highly recommend!”
            </p>
          </Review>
          <Review>
            <img src={yael} alt="Placeholder" />
            <h3>Yael, Volunteer</h3>
            <p>
              “I love helping out the soldiers by taking care of their pets. DogBNB makes it so easy to connect and ensure the pets are happy and well-cared for.”
            </p>
          </Review>
        </ReviewsSection>
      </Section>
      <HowItWorksSection bgColor="var(--SECTION_BG_3)">
        <h2>Why it works</h2>
        <HowItWorks>
          <Feature>
            <img src={trusted} alt="Trusted Community" />
            <h3>Trusted Community</h3>
            <p>Our platform connects soldiers with verified volunteers who are passionate about helping and have undergone thorough vetting processes.</p>
          </Feature>
          <Feature>
            <img src={seamless} alt="Seamless Coordination" />
            <h3>Seamless Coordination</h3>
            <p>We provide an easy-to-use platform for scheduling and communication between soldiers and volunteers, ensuring smooth coordination.</p>
          </Feature>
          <Feature>
            <img src={personalized} alt="Personalized Care" />
            <h3>Personalized Care</h3>
            <p>Volunteers offer personalized care tailored to the needs of each pet, providing peace of mind to soldiers while they serve.</p>
          </Feature>
        </HowItWorks>
      </HowItWorksSection>
      <Section bgColor="var(--SECTION_BG_4)">
        <GallerySection>
          <img src={galleryImage1} alt="Gallery" />
          <img src={galleryImage2} alt="Gallery" />
          <img src={galleryImage3} alt="Gallery" />
          <img src={galleryImage4} alt="Gallery" />
          <img src={galleryImage5} alt="Gallery" />
          <img src={galleryImage6} alt="Gallery" />
        </GallerySection>
      </Section>
      <Section bgColor="var(--SECTION_BG_5)">
        <RatingSection>
          <CustomRating />
        </RatingSection>
      </Section>
    </MainAbout>
  );
};

export default main_about;
