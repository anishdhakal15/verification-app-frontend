import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CodeInput from './components/CodeInput';
import SuccessPage from './components/SuccessPage';
import './styles/styles.css';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<CodeInput />} />
      <Route path="/success" element={<SuccessPage />} />
    </Routes>
  </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));
