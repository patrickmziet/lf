import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState, FormEvent } from "react";
import { getUserNotes, createNote } from "../services/message.service";
import { PageLayout } from "../components/page-layout";
import { Note } from "../models/note"; 
import { CodeSnippet } from "../components/code-snippet";

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    let isMounted = true;

    const fetchNotes = async () => {
      if (!user) {
        return;
      }

      const token = await getAccessTokenSilently();      
      const { data } = await getUserNotes(token);

      console.log('Data from API:', data);
      
      if (isMounted && data && Array.isArray(data.notes)) {
        setNotes(data.notes); // Ensure your API returns an object with a `notes` key
      }

      console.log('Notes from API:', notes);
    };

    fetchNotes();
    console.log('Notes from API after fetching:', notes);
    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently, notes]);

  const handleNewNoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewNote({
      ...newNote,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateNote = async (e: FormEvent) => {
    e.preventDefault();
    const accessToken = await getAccessTokenSilently();
    const { data } = await createNote(accessToken, newNote);

    if (data) {
      setNotes([...notes, data]); // Add the new note to the local state to update the list
      setNewNote({ title: '', content: '' }); // Reset the input after successful creation
    }
  };

  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          Notes
        </h1>
        <div className="content__body">
        <p id="page-description">
          <span>
            This is a notes page.  
          </span>
        </p>
        <form onSubmit={handleCreateNote} className="note-form">
          <input
            type="text"
            name="title"
            placeholder="Note title"
            value={newNote.title}
            onChange={handleNewNoteChange}
            required
            className="note-input"
          />
          <textarea
            name="content"
            placeholder="Note content"
            value={newNote.content}
            onChange={handleNewNoteChange}
            required
            className="note-textarea"
          />
          <button type="submit" className="note-button">Create Note</button>
        </form>
        <h2 className="content__header">Previous notes</h2>
          {Array.isArray(notes) && notes.length > 0 ? (
            notes.map(note => (
              <CodeSnippet key={note.id} title={note.title} code={JSON.stringify(note, null, 2)} />
            ))
          ) : (
          <p>No previous notes</p>
          )}       
        </div>
      </div>
    </PageLayout>
  );
};
