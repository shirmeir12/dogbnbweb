// src/components/MainLayout.js
import React from 'react';
import styled from 'styled-components';
import NavBar from '../components/NavBar';

const ContentWrapper = styled.div`
  padding-top: 40px; /* Adjust the padding to match the height of your NavBar */
  background-color: var(--BACKGROUND_COLOR); /* Optional: background color */
`;

const MainLayout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <ContentWrapper>
        {children}
      </ContentWrapper>
    </div>
  );
}

export default MainLayout;