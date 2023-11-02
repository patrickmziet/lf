import React, { useState, useContext } from 'react';
import apiService from '../services/apiService';
import { AuthContext } from '../contexts/AuthContext';

function Register(props) {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    apiService.post('/dj-rest-auth/registration/', {
      username,
      password1,
      password2,
    })
    .then(response => {
      console.log(response.data);
      // handle successful registration
      setIsAuthenticated(true);
      props.history.push('/notes');
    })
    .catch(error => {
      console.error(error);
      // handle error
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password1} onChange={e => setPassword1(e.target.value)} />
      </label>
      <label>
        Confirm Password:
        <input type="password" value={password2} onChange={e => setPassword2(e.target.value)} />
      </label>
      <input type="submit" value="Register" />
    </form>
  );
}

export default Register;