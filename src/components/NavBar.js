import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { logOut } from '../components/Config'; // Adjust this import path if necessary

const NavbarContainer = styled.nav`
  background-color: #96C3BB;
  padding: 1rem;
  position: fixed; /* Makes the navbar fixed at the top */
  top: 0; /* Ensures it's at the top */
  width: 100%; /* Ensures it spans the full width */
  z-index: 1000; /* Ensures it stays on top of other elements */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Adds a subtle shadow for better separation */
`;


const NavbarList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: space-around;
  margin: 0;
  padding: 0;
`;

const NavbarItem = styled.li`
  margin: 0 1rem;
`;

const linkStyles = css`
  color: white;
  text-decoration: none;
  font-size: 1em;
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  font-family: 'Roboto', sans-serif; /* Ensure consistent font */
  
  &:hover {
    text-decoration: underline;
  }
`;

const NavbarLink = styled(Link)`
  ${linkStyles}
`;

const LogoutButton = styled.button`
  ${linkStyles}
`;

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const getProfileLink = () => {
    if (!user || !user.details) {
      return '/';
    }

    if (user.details.registrationType === 'reserve') {
      return '/myDogProfile';
    } else if (user.details.registrationType === 'volunteer') {
      return '/volProfile';
    } else {
      return '/volProfile';
    }
  };

  const handleLogOut = async () => {
    try {
      await logOut(); // Call the logOut function from your Config file
      setUser(null); // Reset the user state
      navigate('/'); // Navigate to the Welcome page
    } catch (error) {
      console.error("Logout failed", error);
      // Optionally, you can show an error message to the user here
    }
  };

  return (
    <NavbarContainer>
      <NavbarList>
        <NavbarItem><NavbarLink to="/feed">Home</NavbarLink></NavbarItem>
        <NavbarItem><NavbarLink to="/about">About Us</NavbarLink></NavbarItem>
        <NavbarItem><NavbarLink to={getProfileLink()}>My Profile</NavbarLink></NavbarItem>
        <NavbarItem>
          <LogoutButton onClick={handleLogOut}>Log Out</LogoutButton>
        </NavbarItem>
      </NavbarList>
    </NavbarContainer>
  );
};

export default Navbar;
