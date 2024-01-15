export interface Flashcard {
    id: number;           // Unique identifier for the flashcard
    question: string;     // Flashcard question
    answer: string;       // Flashcard answer
    easiness: number;     // Easiness level of flashcard
    interval: number;     // Time between views
    repetitions: number;  // Total number of views
    record: string;       // Record of success/failure
    due_date: number;     // Due date of the card
    createdAt: Date;      // Timestamp when the note was created
    updatedAt: Date;      // Timestamp when the note was last updated
} 