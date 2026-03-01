import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', color = 'gold', fullPage = false }) => {
    return (
        <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
            <div className={`spinner ${size} ${color}`}></div>
        </div>
    );
};

export default Loader;
