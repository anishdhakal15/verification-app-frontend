import React, { useState, useRef } from 'react';
import axios from 'axios';
import './styles.css';
require('dotenv').config();

import { useNavigate } from 'react-router-dom';

const CodeInput = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    if (/^\d?$/.test(value)) {
      let newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.includes('') || code.some(digit => !/^\d$/.test(digit))) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    try {
      const response = await axios.post(process.env.SERVER_PATH, { code: code.join('') });
      if (response.data.success) {
        navigate('/success');
      }
    } catch (err) {
      setError('Verification Error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {code.map((digit, index) => (
          <input
            key={index}
            type="text"
            value={digit}
            onChange={(e) => handleInputChange(e, index)}
            maxLength="1"
            ref={(el) => inputsRef.current[index] = el}
            style={{ border: digit === '' || !/^\d$/.test(digit) ? '2px solid red' : '1px solid black' }}
          />
        ))}
      </div>
      <button type="submit">Submit</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default CodeInput;
