import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dogProfile from '../images/dog_profile.png';
import styles from '../styles/FormSection.module.css';
import { DB } from './Config';
import { setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link } from 'react-router-dom';
import { UserContext } from '../App';

let registrationType = "reserve";
function FormSection() {
  const { user, updateUserDetails } = useContext(UserContext);
  const currentUser = user.firebaseUser;
  const [profilePic, setProfilePic] = useState('');
  const [formData, setFormData] = useState({
    name: currentUser.displayName,
    dogName: '',
    mobile: '',
    address: '',
    registrationType: registrationType
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const previewImage = (event) => {
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
    const profilePicFile = new FormData(event.target).get('profilePic');
    const storage = getStorage();
    const storageRef = ref(storage, `profile_pics/${currentUser.uid}`);

    await uploadBytes(storageRef, profilePicFile);
    const profilePicURL = await getDownloadURL(storageRef);

    const updatedFormData = {
      ...formData,
      profilePic: profilePicURL
    };

    await updateUserDetails(updatedFormData);
    navigate('/mydogprofile'); // Redirect to the user's dog profiles after submission
  };

  return (
    <div className={styles["form-section"]}>
      <p className={styles["intro"]} style={{ fontSize: '40px', fontStyle: 'italic', fontFamily: 'Caveat, cursive' }}>
        Thank you for your service! Let's get started
      </p>
      <form id="signup-form" onSubmit={handleSubmit}>
        <div className={styles["profile-picture"]}>
          <label htmlFor="profilePic" className={styles["profile-pic-label"]}>
            <img src={profilePic || dogProfile} alt="Form section illustration" id="profilePicPreview" />
          </label>
          <input type="file" id="profilePic" name="profilePic" accept="image/*" style={{ display: 'none' }} onChange={previewImage} />
        </div>
        <input type="text" name="name" value={formData.name} placeholder="Enter your full name" required onChange={handleInputChange} />
        <input type="text" name="mobile" placeholder="Enter your phone number" required onChange={handleInputChange} />
        <input type="text" name="dogName" placeholder="Enter your dog name" required onChange={handleInputChange} />
        <input type="text" name="address" placeholder="Enter your city address" required onChange={handleInputChange} />
        <input type="hidden" name="registrationType" value="reserve" />
        <button type="submit">Sign up</button>
      </form>

      <Link to='/volunteer'>Are you a volunteer? click here to sign up!</Link>
    </div>
  );
}

export { registrationType };
export default FormSection;