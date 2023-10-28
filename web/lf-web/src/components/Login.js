import React, { useState } from 'react';
import apiService from '../services/apiService';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    apiService.post('/dj-rest-auth/login/', {
      username,
      password,
    })
    .then(response => {
      console.log(response.data);
      // handle successful login
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
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <input type="submit" value="Login" />
    </form>
  );
}

export default Login;