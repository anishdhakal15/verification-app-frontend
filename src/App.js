import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CodeInput from './components/CodeInput';
import SuccessPage from './components/SuccessPage'; // Assuming you have a success page component

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CodeInput />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
