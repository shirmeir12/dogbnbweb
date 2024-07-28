import React from 'react';
import styles from '../styles/RegisterReserved.module.css';
import Volform from './Volform';
import ImageSection from './ImageSection';



function RegisterVolunteer() {
  return (
    <div className={styles.container}>
      <ImageSection />
      <Volform />
    </div>
  );
} 

export default RegisterVolunteer;
