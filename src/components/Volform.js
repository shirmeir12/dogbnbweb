import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profile from '../images/profile.jpg'; // Import the profile image
import styles from '../styles/FormSection.module.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link } from 'react-router-dom'; // Import Link
import { UserContext } from '../App';

let registrationType2 = "volunteer"
function VolFormSection() {
  const {user, updateUserDetails} = useContext(UserContext);
  const [profilePic, setProfilePic] = useState('');
  const [formData, setFormData] = useState({
    name: user.firebaseUser.displayName,
    mobile: '',
    address: '',
    registrationType: registrationType2
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
    const storageRef = ref(storage, `profile_pics/${user.firebaseUser.uid}`);

    await uploadBytes(storageRef, profilePicFile);
    const profilePicURL = await getDownloadURL(storageRef);

    const updatedFormData = {
      ...formData,
      profilePic: profilePicURL
    };

    // Ensure the document reference has an even number of segments (e.g., 'users/{uid}')
    await updateUserDetails(updatedFormData);
    navigate('/VolProfile'); // Redirect to the user's profile after submission
  };

  return (
    <div className={styles["form-section"]}>
      {/* <h1>Thank you for joining DogBNB,<br />some details about you:</h1> */}
      <p className={styles["intro"]} style={{ fontSize: '40px', fontStyle: 'italic', fontFamily: 'Caveat, cursive' }}>
      Thank you for joining DogBNB! Let's get started
      </p>
      <form id="signup-form" onSubmit={handleSubmit}>
        <div className={styles["profile-picture"]}>
          <label htmlFor="profilePic" className={styles["profile-pic-label"]}>
            <img src={profilePic || profile} alt="Form section illustration" id="profilePicPreview" />
          </label>
          <input type="file" id="profilePic" name="profilePic" accept="image/*" style={{ display: 'none' }} onChange={previewImage} />
        </div>
        <input type="text" name="name" value={formData.name} placeholder="Enter your full name" required onChange={handleInputChange} />
        <input type="text" name="mobile" placeholder="Enter your phone number" required onChange={handleInputChange} />
        <input type="text" name="address" placeholder="Please enter your address" required onChange={handleInputChange} />
        <input type="hidden" name="registrationType" value="volunteer" />
        <button type="submit">Sign up</button>
      </form>

      <Link to='/reserved'>Are you a reserved? click here to sign up!</Link>
    </div>
  );
}
export {registrationType2};
export default VolFormSection;
