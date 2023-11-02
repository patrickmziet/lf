import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    apiService.get('/api/notes/')
      .then(response => {
        setNotes(response.data);
      });
  }, []);

  const handleInputChange = (event) => {
    setNewNote({
      ...newNote,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    apiService.post('/api/notes/', newNote)
      .then(response => {
        setNotes([...notes, response.data]);
        setNewNote({ title: '', content: '' });
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" value={newNote.title} onChange={handleInputChange} />
        </label>
        <label>
          Content:
          <textarea name="content" value={newNote.content} onChange={handleInputChange} />
        </label>
        <input type="submit" value="Add Note" />
      </form>
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