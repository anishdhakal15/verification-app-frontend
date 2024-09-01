import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';
require('dotenv').config();

const CodeInput = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleInputChange = (event, index) => {
    const value = event.target.value;

    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }

    if (errorMessage) setErrorMessage('');
  };

  const handlePaste = (event) => {
    const pasteData = event.clipboardData.getData('Text');
    const digits = pasteData.split('').filter(char => /^\d$/.test(char)).slice(0, 6);

    if (digits.length === 6) {
      setCode(digits);
      inputRefs.current[5].focus();  // Automatically focus the last input
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (code.includes('') || code.some(digit => !/^\d$/.test(digit))) {
      setErrorMessage('Please enter a valid 6-digit code.');
      return;
    }

    try {
      const response = await axios.post(process.env.SERVER_PATH, { code: code.join('') });
      if (response.data.success) {
        navigate('/success');
      }
    } catch (error) {
      setErrorMessage('Verification Error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="code-input-form">
      <div className="input-group">
        {code.map((digit, index) => (
          <input
            key={index}
            type="text"
            value={digit}
            onChange={(e) => handleInputChange(e, index)}
            onPaste={handlePaste}
            maxLength="1"
            ref={(el) => (inputRefs.current[index] = el)}
            className={`code-input ${digit === '' || !/^\d$/.test(digit) ? 'error' : ''}`}
          />
        ))}
      </div>
      <button type="submit" className="submit-button">Submit</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
};

export default CodeInput;
