export interface Flashcard {
    id: number;           // Unique identifier for the flashcard
    question: string;     // Flashcard question
    answer: string;       // Flashcard answer
    easiness: number;     // Easiness level of flashcard
    interval: number;     // Time between views
    repetitions: number;  // Total times correct in a row
    consecutive_correct: number; // Total times correct in a row for use in Rapid study
    rapid_attempts: number; // Total attempts in Rapid study
    rapid_correct: number;  // Total correct in Rapid study
    record: string;       // Record of success/failure
    due_date: number;     // Due date of the card
    created_at: number;      // Timestamp when the note was created
    updated_at: number;      // Timestamp when the note was last updated
} 