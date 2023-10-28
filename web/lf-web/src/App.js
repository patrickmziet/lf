import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Notes from './components/Notes';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notes" component={Notes} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;