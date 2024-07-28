// src/components/MainLayout.js
import React from 'react';
import NavBar from '../components/NavBar';

const MainLayout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <div>{children}</div>
    </div>
  );
}

export default MainLayout;