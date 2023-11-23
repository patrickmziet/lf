import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState, FormEvent } from "react";
import { getUserNotes, createNote } from "../services/message.service";
import { PageLayout } from "../components/page-layout";
import { Note } from "../models/note"; // Make sure you have a Note model defined

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    let isMounted = true;

    const fetchNotes = async () => {
      const accessToken = await getAccessTokenSilently();
      const { data } = await getUserNotes(accessToken);

      if (isMounted && data) {
        setNotes(data.notes); // Ensure your API returns an object with a `notes` key
      }
    };

    fetchNotes();

    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently]);

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
        <h1 className="content__title">Notes</h1>
        <form onSubmit={handleCreateNote}>
          <input
            type="text"
            name="title"
            placeholder="Note title"
            value={newNote.title}
            onChange={handleNewNoteChange}
            required
          />
          <textarea
            name="content"
            placeholder="Note content"
            value={newNote.content}
            onChange={handleNewNoteChange}
            required
          />
          <button type="submit">Create Note</button>
        </form>
        <div className="content__body">
          {notes.map(note => (
            <div key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
