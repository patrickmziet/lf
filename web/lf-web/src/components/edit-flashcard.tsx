import React from 'react';
import { useFormik } from 'formik';
import { Flashcard } from '../models/flashcard';

interface EditFlashcardProps {
  card: Flashcard;
  onSave: (updatedCard: Flashcard) => void;
}

export const EditFlashcard: React.FC<EditFlashcardProps> = ({ card, onSave }) => {
    const formik = useFormik({
        initialValues: {
            question: card.question,
            answer: card.answer
        },
        onSubmit: values => {
            onSave({ ...card, ...values });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <input
                type="text"
                name="question"
                className="edit-input"
                onChange={formik.handleChange}
                value={formik.values.question}
            />
            <input
                type="text"
                name="answer"
                className="edit-input"
                onChange={formik.handleChange}
                value={formik.values.answer}
            />
            <div className="save-button-container">
                <button className="save-button" type="submit">
                    Save
                </button>
            </div>
        </form>
    );
};
