import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const CodeInput = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Auto-focus the first input when the component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (event, index) => {
    const value = event.target.value;

    // Only allow single-digit numeric input
    if (/^\d$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if not the last one
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === '') {
      // Allow the user to clear the input field
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
    }

    if (errorMessage) setErrorMessage('');
  };

  const handleKeyPress = (event) => {
    // Prevent non-numeric keys
    if (!/^\d$/.test(event.key) && event.key !== 'Backspace') {
      event.preventDefault();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();  // Prevent the default paste action
    const pasteData = event.clipboardData.getData('Text');
    const digits = pasteData.split('').filter(char => /^\d$/.test(char)).slice(0, 6);

    if (digits.length > 0) {
      const newCode = [...code];
      digits.forEach((digit, i) => {
        newCode[i] = digit;
      });
      setCode(newCode);
      // Move focus to the next available input or the last one
      const nextFocusIndex = Math.min(digits.length - 1, 5);
      inputRefs.current[nextFocusIndex].focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (code.includes('') || code.some(digit => !/^\d$/.test(digit))) {
      setErrorMessage('Please enter a valid 6-digit code.');
      return;
    }

    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_PATH, { code: code.join('') });
      if (response.data.success) {
        navigate('/success');
      }
    } catch (error) {
      setErrorMessage('Verification Error.');
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
            onKeyPress={handleKeyPress}
            onPaste={handlePaste}
            maxLength="1"
            ref={(el) => (inputRefs.current[index] = el)}
            aria-label={`Digit ${index + 1}`}
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
