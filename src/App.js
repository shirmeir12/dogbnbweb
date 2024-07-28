import { Route, Routes, Navigate } from 'react-router-dom';
import React, { useEffect, useState, createContext } from 'react';
import './App.css';
import Home from './components/Home';
import RegisterReserved from './components/RegisterReserved';
import About from './components/About';
import DogProfilesExpansion from './components/DogProfilesExpansion';
import ImageSection from './components/ImageSection';
import MyDogProfiles from './components/MyDogProfiles';
import VolunteerProfilesExpansion from './components/VolunteerProfilesExpansion';
import FormSection from './components/FormSection';
import { getAuth } from 'firebase/auth';
import Feed from './components/Feed';
import MainLayout from './layouts/MainLayout';
import Volform from './components/Volform';
import RegisterVolunteer from './components/Volregister';
import MyVolunteerProfile from './components/MyVolunteerProfile';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { DB } from './components/Config';
import { auth, logOut } from './components/Config';


export const UserContext = createContext(null);

// InitializeFirebase();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const updateUserDetails = async (details) => {
    console.log(details);
    const currentUser = getAuth(getApp()).currentUser;
    await setDoc(doc(DB, 'users', currentUser.uid), details);

    setUser((prev) => ({ ...prev, details }));
  };

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser) {
        setIsLoading(false);
        return;
      }

      const getCurrentUserDetails = async () => {
        const currentUser = getAuth(getApp()).currentUser;
        const docRef = doc(DB, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          return data;
        }
        return null;
      };

      getCurrentUserDetails().then((details) => {
        setUser({ firebaseUser, isNewUser: false, details });
        setIsLoading(false);
      });
    });
  }, []);

  if (isLoading) {
    return (
      <div style={{ height: '100%', width: '100%', display: 'grid', placeItems: 'center' }}>
        <img className='center' src="https://media.tenor.com/ivCA1wKA0WEAAAAi/pixel-pug-dog.gif" alt="Loading" />
      </div>
    );
  }

  const isLoggedIn = user != null;

  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser, updateUserDetails }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {isLoggedIn && (
            <>
              <Route path="feed" element={<MainLayout><Feed /></MainLayout>} />
              <Route path="about" element={<MainLayout><About /></MainLayout>} />
              <Route path="my-profile" element={<MainLayout><MyDogProfiles /></MainLayout>} />
              <Route path="reserved" element={<RegisterReserved />} />
              <Route path="dogProfiles" element={<MainLayout><DogProfilesExpansion /></MainLayout>} />
              <Route path="formSection" element={<MainLayout><FormSection /></MainLayout>} />
              <Route path="imageSection" element={<MainLayout><ImageSection /></MainLayout>} />
              <Route path="volProfile" element={<MainLayout><MyVolunteerProfile /></MainLayout>} />
              <Route path="volFormSection" element={<MainLayout><Volform /></MainLayout>} />  
              <Route path="dog-profile/:uid" element={<MainLayout><DogProfilesExpansion /></MainLayout>} />
              <Route path="volunteer-profile/:uid" element={<MainLayout><VolunteerProfilesExpansion /></MainLayout>} />
              <Route path="myDogProfile" element={<MainLayout><MyDogProfiles /></MainLayout>} />
              <Route path="volunteer" element={<RegisterVolunteer />} />
            </>
          )}
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
