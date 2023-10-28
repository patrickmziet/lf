import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';

function Notes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    apiService.get('/api/notes/')
      .then(response => {
        setNotes(response.data);
      });
  }, []);

  return (
    <div>
      {notes.map(note => (
        <div key={note.id}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Notes;