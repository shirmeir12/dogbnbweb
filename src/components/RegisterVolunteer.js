import React, { useContext, useState } from 'react';
import styles from '../styles/RegisterVolunteer.module.css';
import defaultProfile from '../images/profile.jpg'; // Import the profile image
import ImageSection from './ImageSection';
import { Link } from 'react-router-dom';
import { DB } from './Config';
import { setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { UserContext } from '../App';



const RegisterVolunteer = () => {
    const { user } = useContext(UserContext);
    const [profilePic, setProfilePic] = useState('');
    const [name, setName] = useState(user.firebaseUser.displayName);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(event.target))

        const {profilePic} = formData;
        const storage = getStorage();
        const storageRef = ref(storage, user.firebaseUser.uid);
        
        await uploadBytes(storageRef, profilePic);

        delete formData['profilePic'];
        await setDoc(doc(DB(), "users", user.firebaseUser.uid), {...formData, 'type': 'volunteer'});
    };

    const handleNameChanged = (event) => {
        setName(event.target.value)
    }

    return (
        <div className={styles.container}>
            <ImageSection />
            <div className={styles.formSection}>
                <h1>Thank you for joining us,<br />some details about you:</h1>
                <p className={styles.intro}>Let's get started</p>
                <form id="signup-form" onSubmit={handleSubmit}>
                    <div className={styles.profilePicture}>
                        <label htmlFor="profilePic" className={styles.profilePicLabel}>
                            <img src={profilePic || defaultProfile} alt="Volunteer profile picture" id="profilePicPreview" />
                        </label>
                        <input type="file" id="profilePic" name="profilePic" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                    </div>
                    <input type="text" value={name} name="name" placeholder="Enter your full name" required onChange={handleNameChanged} />
                    <input type="text" name="mobile" placeholder="Enter your phone number" required />
                    <input type="text" name="address" placeholder="Please enter your address" required />
                    {/* Additional Form Fields Here */}
                    <button type="submit">Sign up</button>
                </form>
                <Link to='/reserved'>Are you a reserved? click here to sign up!</Link>
            </div>
        </div>
    );
};

export default RegisterVolunteer;