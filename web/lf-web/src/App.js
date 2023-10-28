export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Notes from './components/Notes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/notes" component={Notes} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}