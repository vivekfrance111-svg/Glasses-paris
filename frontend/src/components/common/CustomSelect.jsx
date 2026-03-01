import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import './CustomSelect.css';

const CustomSelect = ({ value, options, onChange, placeholder = 'Select...', className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const selectedLabel = options.find(o => o.value === value || o.value.toString() === value?.toString())?.label || placeholder;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div className={`custom-select ${isOpen ? 'open' : ''} ${className}`} ref={ref}>
            <button
                className="custom-select-trigger"
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <span className={value !== undefined && value !== null && value !== '' ? '' : 'placeholder'}>
                    {selectedLabel}
                </span>
                <FiChevronDown className={`select-arrow ${isOpen ? 'rotated' : ''}`} />
            </button>
            {isOpen && (
                <ul className="custom-select-options glass">
                    {options.map(opt => (
                        <li
                            key={opt.value}
                            className={`custom-select-option ${value.toString() === opt.value.toString() ? 'active' : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
