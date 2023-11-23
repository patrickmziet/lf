export interface Note {
    id: number;           // Unique identifier for the note
    title: string;        // Title of the note
    content: string;      // Content of the note
    createdAt: Date;      // Timestamp when the note was created
    updatedAt: Date;      // Timestamp when the note was last updated
  }
  