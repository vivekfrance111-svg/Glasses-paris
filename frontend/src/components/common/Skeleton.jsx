import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, borderRadius = '4px', className = '', style = {} }) => {
    const combinedStyle = {
        width,
        height,
        borderRadius,
        ...style
    };

    return <div className={`skeleton-base ${className}`} style={combinedStyle}></div>;
};

export default Skeleton;
