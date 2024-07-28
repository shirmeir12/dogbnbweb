import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import { getAuth, signInWithPopup } from "firebase/auth";
import { UserContext } from "../App";
import { logOut } from "./Config";
import logo from '../images/logo.png'; 

const provider = new GoogleAuthProvider();

function Home() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogOut = async () => {
        await logOut();
        setUser(null);
    }

    const onSignIn = () => {
        const auth = getAuth();
        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;            
            const additionalInfo = getAdditionalUserInfo(result);
            
            console.log({ user, isNewUser: additionalInfo.isNewUser })
            setUser({ user, isNewUser: additionalInfo.isNewUser, details: null });
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
    }

    useEffect(() => {
        if (user && user.isNewUser !== true && user.details !== null) {
            navigate('/feed');
        }
    }, [user, navigate]);

    if (user === null) {
        return (
            <div style={{ backgroundColor: '#d3d3d3', minHeight: '100vh', textAlign: 'center', padding: '20px' }}>
                <img src={logo} alt="Company Logo" style={{ width: '150px' }} />
                <p style={{ fontSize: '40px', fontStyle: 'italic', fontFamily: 'Caveat, cursive' }}>Welcome to Dogbnb!</p>
                <p>On our website you can find a solution for your dog while you are in reserve</p>
                <p>And amazing dog-loving volunteers who will take care of your dog</p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button onClick={onSignIn} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', width: '200px', margin: '0 auto' }}>
                        Sign in with Google
                    </button>
                </div>
            </div>
        );
    }
    

    if (user.isNewUser === true || user.details === null) {
        return (
        <div style={{ backgroundColor: '#d3d3d3', minHeight: '100vh', textAlign: 'center', padding: '20px' }}>
            <img src={logo} alt="Company Logo" style={{ width: '150px', marginBottom: '30px' }} />
            
            <p style={{ fontSize: '40px', fontStyle: 'italic', fontFamily: 'Caveat, cursive' }}>Paws and duty – we've got both covered!</p>

            <Link to='reserved' style={{ textDecoration: 'none' }}>
              <button style={{ display: 'block', margin: '10px auto', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', width: '200px', backgroundColor: "#8BBBAA" }}>
                Reserved
              </button>
            </Link>
            
            <Link to='volunteer' style={{ textDecoration: 'none' }}>
              <button style={{ display: 'block', margin: '10px auto', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', width: '200px', backgroundColor: "#8BBBAA" }}>
                Volunteer
              </button>
            </Link>
            
            <button onClick={handleLogOut} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', width: '200px', display: 'block', margin: '10px auto' }}>
              Log out
            </button>

        </div>
        );
    }
    

    return (
        <div>
            Welcome back!
            <button onClick={handleLogOut}>Log out</button>
        </div>
    );
}

export default Home;