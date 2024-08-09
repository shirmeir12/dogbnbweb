import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilter, FaPlus } from 'react-icons/fa';
import { addDoc, collection, doc, getDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { DB } from './Config';
import { UserContext } from '../App';
import '../styles/Feed.css';

const Feed = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [showFilter, setShowFilter] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [posts, setPosts] = useState([]);

  const [filterCity, setFilterCity] = useState('');
  const [filterDuration, setFilterDuration] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterNeedsGarden, setFilterNeedsGarden] = useState('');
  const [filterImmune, setFilterImmune] = useState('');
  const [filterNeutered, setFilterNeutered] = useState('');
  const [filterFriendlyToChildren, setFilterFriendlyToChildren] = useState('');

  const [tempFilterCity, setTempFilterCity] = useState('');
  const [tempFilterDuration, setTempFilterDuration] = useState('');
  const [tempFilterGender, setTempFilterGender] = useState('');
  const [tempFilterNeedsGarden, setTempFilterNeedsGarden] = useState('');
  const [tempFilterImmune, setTempFilterImmune] = useState('');
  const [tempFilterNeutered, setTempFilterNeutered] = useState('');
  const [tempFilterFriendlyToChildren, setTempFilterFriendlyToChildren] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(DB, 'posts'), async (snapshot) => {
      const updatedPosts = await Promise.all(snapshot.docs.map(async (post) => fillOwnerDetails(post)));
      const sortedPosts = updatedPosts.sort((a, b) => {
        const aStartDate = new Date(a.startDate.split('/').reverse().join('-'));
        const bStartDate = new Date(b.startDate.split('/').reverse().join('-'));
        return aStartDate - bStartDate;
      });
      setPosts(sortedPosts);
    });

    return () => unsubscribe();
  }, []);

  const fillOwnerDetails = async (post) => {
    const postData = post.data();
    const postOwnerDetails = (await getDoc(doc(DB, 'users', postData.postOwnerUid))).data();

    return {
      id: post.id,
      ownerUid: postData.postOwnerUid,
      image: postOwnerDetails.profilePic,
      name: postOwnerDetails.dogName,
      city: postOwnerDetails.address,
      description: postOwnerDetails.dogDetails,
      startDate: postData.startDate,
      endDate: postData.endDate,
      gender: postOwnerDetails.dogGender || '',
      needsGarden: postOwnerDetails.suitableFor?.includes('House with yard') || postOwnerDetails.suitableFor === '' ? 'yes' : postOwnerDetails.suitableFor?.includes('apartment') ? 'no' : '',
      immune: postOwnerDetails.dogImmune || '',
      neutered: postOwnerDetails.dogNeutered || '',
      friendlyToChildren: postOwnerDetails.friendlyWithChildren !== undefined ? (postOwnerDetails.friendlyWithChildren.toLowerCase() === 'yes' ? 'yes' : 'no') : ''
    };
  };

  const uploadPost = async (post) => {
    await addDoc(collection(DB, 'posts'), post);
  };

  const reformatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year.substring(2)}`;
  };

  const addPost = async (e) => {
    e.preventDefault();
    const profile = user.details;
    if (!profile) {
      return;
    }

    const newPost = {
      postOwnerUid: user.firebaseUser.uid,
      startDate: reformatDate(e.target.elements.startDate.value),
      endDate: reformatDate(e.target.elements.endDate.value),
    };

    await uploadPost(newPost);
    setShowAddPost(false);
  };

  const calculateDurationInDays = (startDate, endDate) => {
    const [startDay, startMonth, startYear] = startDate.split('/').map(Number);
    const [endDay, endMonth, endYear] = endDate.split('/').map(Number);
    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(DB, 'posts', postId));
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const isMyPost = (postOwnerUid) => {
    return postOwnerUid === user.firebaseUser.uid;
  };

  const handleMoreInfoClick = (post) => {
    if (post.ownerUid === user.firebaseUser.uid) {
      navigate('/my-profile');
    } else {
      navigate(`/dog-profile/${post.ownerUid}`, {
        state: { startDate: post.startDate, endDate: post.endDate },
      });
    }
  };

  const filteredPosts = posts.filter(post => {
    const durationDays = calculateDurationInDays(post.startDate, post.endDate);
    return (
      (filterCity === '' || post.city.toLowerCase().includes(filterCity.toLowerCase())) &&
      ((filterDuration === '1-6' && durationDays >= 1 && durationDays <= 6) ||
        (filterDuration === '7-14' && durationDays >= 7 && durationDays <= 14) ||
        (filterDuration === '14+' && durationDays > 14) ||
        (filterDuration === '')) &&
      (filterGender === '' || post.gender.toLowerCase() === filterGender.toLowerCase() || post.gender === '') &&
      (filterNeedsGarden === '' || post.needsGarden.toLowerCase() === filterNeedsGarden.toLowerCase() || post.needsGarden === '') &&
      (filterImmune === '' || post.immune.toLowerCase() === filterImmune.toLowerCase() || post.immune === '') &&
      (filterNeutered === '' || post.neutered.toLowerCase() === filterNeutered.toLowerCase() || post.neutered === '') &&
      (filterFriendlyToChildren === '' || post.friendlyToChildren.toLowerCase() === filterFriendlyToChildren.toLowerCase() || post.friendlyToChildren === '' ||
        (filterFriendlyToChildren === 'yes' && post.friendlyToChildren === '') || (filterFriendlyToChildren === 'no' && post.friendlyToChildren === ''))
    );
  });

  // Sort filtered posts by startDate
  filteredPosts.sort((a, b) => {
    const aStartDate = new Date(a.startDate.split('/').reverse().join('-'));
    const bStartDate = new Date(b.startDate.split('/').reverse().join('-'));
    return aStartDate - bStartDate;
  });

  const clearFilters = () => {
    setFilterCity('');
    setFilterDuration('');
    setFilterGender('');
    setFilterNeedsGarden('');
    setFilterImmune('');
    setFilterNeutered('');
    setFilterFriendlyToChildren('');

    setTempFilterCity('');
    setTempFilterDuration('');
    setTempFilterGender('');
    setTempFilterNeedsGarden('');
    setTempFilterImmune('');
    setTempFilterNeutered('');
    setTempFilterFriendlyToChildren('');
  };

  const toggleFilter = () => {
    if (showAddPost) setShowAddPost(false);
    setShowFilter(!showFilter);
  };

  const toggleAddPost = () => {
    if (showFilter) setShowFilter(false);
    setShowAddPost(!showAddPost);
  };

  const applyFilterChanges = () => {
    setFilterCity(tempFilterCity);
    setFilterDuration(tempFilterDuration);
    setFilterGender(tempFilterGender);
    setFilterNeedsGarden(tempFilterNeedsGarden);
    setFilterImmune(tempFilterImmune);
    setFilterNeutered(tempFilterNeutered);
    setFilterFriendlyToChildren(tempFilterFriendlyToChildren);
    setShowFilter(false);
  };

  return (
    <div className="container">
      <div className="header-buttons">
        <button onClick={toggleFilter}><FaFilter /> Filter</button>
        {user.details.registrationType !== 'volunteer' && (
          <button onClick={toggleAddPost}><FaPlus /> Add Post</button>
        )}
      </div>

      {showFilter && (
        <div className="filter-overlay">
          <div className="filter-container" style={{ maxWidth: '300px', padding: '10px' }}>
            <button className="exit-filters" onClick={toggleFilter}>X</button>
            <div className="filter-options">
            <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={tempFilterCity}
                onChange={(e) => setTempFilterCity(e.target.value)}
                style={{ width: '100%' }}
              />
              <label htmlFor="duration">Duration</label>
              <select
                id="duration"
                name="duration"
                value={tempFilterDuration}
                onChange={(e) => setTempFilterDuration(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Any</option>
                <option value="1-6">1-6 days</option>
                <option value="7-14">7-14 days</option>
                <option value="14+">14+ days</option>
              </select>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={tempFilterGender}
                onChange={(e) => setTempFilterGender(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <label htmlFor="needsGarden">Needs Garden</label>
              <select
                id="needsGarden"
                name="needsGarden"
                value={tempFilterNeedsGarden}
                onChange={(e) => setTempFilterNeedsGarden(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Any</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <label htmlFor="immune">Immune</label>
              <select
                id="immune"
                name="immune"
                value={tempFilterImmune}
                onChange={(e) => setTempFilterImmune(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Any</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <label htmlFor="neutered">Neutered</label>
              <select
                id="neutered"
                name="neutered"
                value={tempFilterNeutered}
                onChange={(e) => setTempFilterNeutered(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Any</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <label htmlFor="friendlyToChildren">Friendly to Children</label>
              <select
                id="friendlyToChildren"
                name="friendlyToChildren"
                value={tempFilterFriendlyToChildren}
                onChange={(e) => setTempFilterFriendlyToChildren(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Any</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="apply-button-container">
              <button className="apply-button" onClick={applyFilterChanges}>Apply</button>
              <button className="clear-button" onClick={clearFilters}>Clear</button>
            </div>
          </div>
        </div>
      )}

      {showAddPost && (
        <div className="add-post-overlay">
          <div className="new-post-form add-post-container">
            <button className="close-button" onClick={toggleAddPost}>X</button>
            <p>Make sure you complete all details about your dog in "My Profile" for the best outcomes to your post</p>
            <form onSubmit={addPost}>
              <label htmlFor="startDate">Start Date</label>
              <input type="date" id="startDate" name="startDate" required style={{ width: '100%' }} />
              <label htmlFor="endDate">End Date</label>
              <input type="date" id="endDate" name="endDate" required style={{ width: '100%' }} />
              <button type="submit" className="post-button" style={{ width: '100%' }}>Post</button>
            </form>
          </div>
        </div>
      )}

      <div className="post-grid">
        {filteredPosts.map(post => (
          <div key={post.id} className="post" style={{ position: 'relative' }}>
            {isMyPost(post.ownerUid) && (
              <button 
                type="button" 
                className="delete-post" 
                onClick={() => deletePost(post.id)}
              >
                delete
              </button>
            )}
            <img src={post.image} alt={post.name} />
            <h2>{post.name}</h2>
            <p>{post.city}</p>
            <p>{post.startDate} - {post.endDate}</p>
            <p>{post.description}</p>
            <button 
              type="button" 
              className="more-info" 
              onClick={() => handleMoreInfoClick(post)}
            >
              more info
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;