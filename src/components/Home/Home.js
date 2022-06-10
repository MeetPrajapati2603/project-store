import React from 'react';
import designIcon from '../../assets/designer.svg';
import { ArrowRight } from 'react-feather';
import { useNavigate } from 'react-router-dom';

import styles from './Home.module.css';

function Home(props) {
    const navigate = useNavigate();
    const isAuthenticated = props.auth ? true : false;

    const handleNextButtonClick = ()=> {
        if(isAuthenticated)
        navigate("/account");
        else
        navigate("/login");
    };
  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <div className={styles.left}>
                <p className={styles.heading}>Projects Store</p>
                <p className={styles.subHeading}>Store the information of all the software projects at one place</p>
                <button onClick={handleNextButtonClick} className={styles.button}>
                    {isAuthenticated ? "Manage Your Projects" : "Get Started"}{""}
                    <ArrowRight />{""}
                    </button>
            </div>
            <div className={styles.right}>
                <img src={designIcon} alt="Projects" />
            </div>
        </div>
    </div>
  )
}

export default Home;
