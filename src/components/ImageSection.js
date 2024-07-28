import React from 'react';
import styles from '../styles/ImagesSection.module.css';
import newImage from '../images/cover2.png'; // make sure to import the image

function ImageSection() {
  return (
    <div className={styles["image-section"]}>
      <img src={newImage} alt="Happy Dog" />
    </div>
  );
}

export default ImageSection;
