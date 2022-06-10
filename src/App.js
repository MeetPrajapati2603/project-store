import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import Spinner from './components/Spinner/Spinner';

import './App.css';
import { auth, getUserFromDatabase } from './firebase';
import { async } from '@firebase/util';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const fetchUserDetails = async (uid)=>{
    const userDetails = await getUserFromDatabase(uid);
    setUserDetails(userDetails);
    setIsDataLoaded(true);
  };

  useEffect(()=>{
    const listener = auth.onAuthStateChanged((user)=>{
      if(!user) {
        setIsDataLoaded(true);
        return;
      }

      setIsAuthenticated(true);
      fetchUserDetails(user.uid);

      });
    return () => listener();
  },[]);

  return (
    <div className="App">
      <Router>
        {isDataLoaded ? (
          <Routes>
            {!isAuthenticated && (
              <>
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth signup />} />
              </>
            )}
            <Route path='/account' element={<h1>Account</h1>} />
            <Route path="/" element={<Home auth={isAuthenticated} />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <div className="spinner">
            <Spinner />
          </div>
        )}
      </Router>
    </div>
  );
  
}

export default App;
