import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "../components/page-layout";
import { getTopicFlashCards, updateFlashCards, createMoreFlashCards, deleteFlashCard } from "../services/message.service";
import { Flashcard } from "../models/flashcard";
import { useAuth0 } from "@auth0/auth0-react";
import { EditFlashcard } from '../components/edit-flashcard';

export const CardPage: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const [masterFlashcards, setMasterFlashcards] = useState<Flashcard[]>([]);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const { getAccessTokenSilently } = useAuth0();
    const [time, setTime] = useState(Math.floor(Date.now() / 1000));
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const [endOfDayInSeconds, setEndOfDayInSeconds] = useState(Math.floor(endOfDay.getTime() / 1000));
    const navigate = useNavigate();
    const location = useLocation();
    const flashcardsFromPreviousPage = location.state?.flashcards;
    const [isEditing, setIsEditing] = useState<boolean>(false);
    //const [isEditing, setIsEditing] = useState(false);
    //const [editedCard, setEditedCard] = useState<Flashcard | null>(null);

    // Fetch flashcards
    useEffect(() => {
        let isMounted = true;

        const fetchFlashcards = async () => {
            if (!topicId) return;
            const token = await getAccessTokenSilently();
            let data;
            if (flashcardsFromPreviousPage) {
                console.log("Flashcards from previous page");
                data = flashcardsFromPreviousPage;
            } else {
                console.log("Flashcards from API");
                const response = await getTopicFlashCards(token, topicId);
                data = response.data;
            }

            if (isMounted && data && Array.isArray(data)) {
                setMasterFlashcards(data);
                const dueFlashcards = data.filter(card => card.due_date < endOfDayInSeconds);
                dueFlashcards.sort(() => Math.random() - 0.5); // Randomize order
                setFlashcards(dueFlashcards);
            }
        };

        fetchFlashcards();

        return () => {
            isMounted = false;
        };
    }, [topicId, getAccessTokenSilently]);

    // Update time every second
    useEffect(() => { 
        const interval = setInterval(() => {
            setTime(Math.floor(Date.now() / 1000));

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            setEndOfDayInSeconds(Math.floor(endOfDay.getTime() / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'j':
                    if (!showAnswer) {
                        setShowAnswer(true);
                    } else {
                        handleCorrect();
                    }
                    break;
                case 'l':
                    handleIncorrect();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showAnswer]); 
    

    // Debug flashcards
    useEffect(() => {
        console.log("Flashcards update:", flashcards);
        console.log("Master flashcards update:", masterFlashcards);
    }, [flashcards, masterFlashcards]);


    // Create more flashcards
    const handleCreateMoreCards = async () => {
        if (!topicId) return;
        const token = await getAccessTokenSilently();
        const { data } = await createMoreFlashCards(token, topicId, masterFlashcards);
        console.log("Response:", data);
        if (data && Array.isArray(data)) {
            setMasterFlashcards(data);
            const dueFlashcards = data.filter(card => card.due_date < endOfDayInSeconds);
            dueFlashcards.sort(() => Math.random() - 0.5); // Randomize order
            setFlashcards(dueFlashcards);
        }
    };

    // Handle back button
    const handleBack = async () => {
        if (!topicId) return;
        const token = await getAccessTokenSilently();
        console.log("Master flashcards:", masterFlashcards);
        const response = await updateFlashCards(token, masterFlashcards);
        console.log("Response:", response);
        navigate(`/learn/${topicId}`);
    };

    const handleCorrect = () => {
        if (currentCardIndex >= flashcards.length) return;

        const updatedMasterFlashcards = [...masterFlashcards];
        const updatedFlashcards = [...flashcards];
        const updatedCard = { ...updatedFlashcards[currentCardIndex] };
        updatedCard.record += "1";
        updatedCard.repetitions += 1;

        if (updatedCard.repetitions === 1) {
            updatedCard.interval = 300;
        } else if (updatedCard.repetitions === 2) {
            updatedCard.interval = 600;
        } else if (updatedCard.repetitions === 3) {
            updatedCard.interval = 24 * 60 * 60;
        } else if (updatedCard.repetitions === 4) {
            updatedCard.interval = 3 * 24 * 60 * 60;
        } else if (updatedCard.repetitions >= 5) {
            updatedCard.interval = Math.round(updatedCard.interval * updatedCard.easiness);
        }

        updatedCard.due_date = time + updatedCard.interval;
        updatedCard.updated_at = time;

        updatedFlashcards[currentCardIndex] = updatedCard;
        updatedMasterFlashcards[updatedMasterFlashcards.findIndex(card => card.id === updatedCard.id)] = updatedCard;

        const dueFlashcards = updatedFlashcards.filter(card => card.due_date < endOfDayInSeconds);
        dueFlashcards.sort(() => Math.random() - 0.5); // Randomize order
        setFlashcards(dueFlashcards);
        setMasterFlashcards(updatedMasterFlashcards);
        setCurrentCardIndex(currentCardIndex);
        setShowAnswer(false);
    };

    const handleIncorrect = () => {
        if (currentCardIndex >= flashcards.length) return;

        const updatedMasterFlashcards = [...masterFlashcards];
        const updatedFlashcards = [...flashcards];
        const updatedCard = { ...updatedFlashcards[currentCardIndex] };
        updatedCard.record += "0";
        updatedCard.repetitions = 0;
        updatedCard.interval = 60;
        updatedCard.due_date = time + updatedCard.interval;
        updatedCard.updated_at = time;

        updatedFlashcards[currentCardIndex] = updatedCard;
        updatedMasterFlashcards[updatedMasterFlashcards.findIndex(card => card.id === updatedCard.id)] = updatedCard;

        const dueFlashcards = updatedFlashcards.filter(card => card.due_date < endOfDayInSeconds);
        dueFlashcards.sort(() => Math.random() - 0.5); // Randomize order
        setFlashcards(dueFlashcards);
        setMasterFlashcards(updatedMasterFlashcards);
        setCurrentCardIndex(currentCardIndex);
        setShowAnswer(false);
    };
    

    const handleEdit = (cardIndex: number) => {
        setIsEditing(true);
        setCurrentCardIndex(cardIndex);
    };

    const handleSave = (updatedCard: Flashcard) => {
        const updatedFlashcards = flashcards.map((card, index) => 
            index === currentCardIndex ? updatedCard : card
        );
        setFlashcards(updatedFlashcards);
        setIsEditing(false);
    };


    // Add the handleDelete function in your component
const handleDelete = async (cardId: number) => {
    const cardToDelete = flashcards.find(card => card.id === cardId);
    if (!cardToDelete) {
        console.error('Card not found');
        return;
    }
    // Optimistically remove the card from local state
    setMasterFlashcards(masterFlashcards.filter(card => card.id !== cardId));
    setFlashcards(flashcards.filter(card => card.id !== cardId));

    try {
        // Make the API request to delete the card
        const token = await getAccessTokenSilently();
        await deleteFlashCard(token, cardId);
    } catch (error) {
        // If the request fails, revert the change in local state and inform the user
        console.error(error);
        setMasterFlashcards([...masterFlashcards, cardToDelete]);
        setFlashcards([...flashcards, cardToDelete]);
        alert('Failed to delete the card. Please try again.');
    }
};

    return (
        <PageLayout>
            <div className="content-layout">
                <button onClick={handleBack}>Back to Learn Page</button>
                <button onClick={handleCreateMoreCards}>Create More Cards</button>
                <h1 id="page-title" className="content__title">
                    Flashcards for topic {topicId}
                </h1>
                <p>Current time in seconds: {time}</p>
                <p>End of day in seconds: {endOfDayInSeconds}</p>
                {currentCardIndex < flashcards.length ? (
                    isEditing ? (
                        <EditFlashcard card={flashcards[currentCardIndex]} onSave={handleSave} />
                    ) : (
                    <div>
                        <p>{flashcards[currentCardIndex].question}</p>
                        {showAnswer && <p>{flashcards[currentCardIndex].answer}</p>}
                        {showAnswer && <p>Due date: {flashcards[currentCardIndex].due_date}</p>}
                        {showAnswer && <p>Interval: {flashcards[currentCardIndex].interval}</p>}
                        {showAnswer && <p>Record: {flashcards[currentCardIndex].record}</p>}
                        {!showAnswer && <button onClick={() => setShowAnswer(true)}>Show Answer</button>}
                        {showAnswer && (
                            <>
                                <button onClick={handleCorrect}>Correct</button>
                                <button onClick={handleIncorrect}>Incorrect</button>
                            </>
                        )}
                        <button onClick={() => handleEdit(currentCardIndex)}>Edit</button>
                        <button onClick={() => handleDelete(flashcards[currentCardIndex].id)}>Delete</button>
                    </div>
                    )
                ) : (
                    <div>
                        <p>No more flashcards for this session</p>
                        <button onClick={handleBack}>Finish Session</button>
                    </div>
                )}
                {/* Upcoming flashcards */}
                <div>
                <h2>Upcoming Flashcards</h2>
                {flashcards.slice(currentCardIndex + 1).map((card, index) => (
                    <div key={index}>
                        <p>Order in queue: {index + 1}</p>  
                        <p>Question: {card.question}</p>
                        <p>Answer: {card.answer}</p>
                        <p>Due date: {card.due_date}</p>
                        <p>Interval: {card.interval}</p>
                        <p>Record: {card.record}</p>
                    </div>
                ))}
            </div>
            </div>   
        </PageLayout>
    );
};