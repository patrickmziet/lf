import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "../components/page-layout";
import { getTopicFlashCards, updateFlashCards, deleteFlashCard, getTopic } from "../services/message.service";
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
    const titleFromState = location.state?.title;
    const [title, setTitle] = useState<string | null>(titleFromState);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [sessionElapsedTime, setSessionElapsedTime] = useState(0);
    const [sessionEnded, setSessionEnded] = useState(false);
    const [totalCardsDue, setTotalCardsDue] = useState(0);
    const [filteredCardsCount, setFilteredCardsCount] = useState(0);

    // Start timer
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch topic title
    useEffect(() => {
        const fetchTopic = async () => {
            if (!topicId) return;
            const accessToken = await getAccessTokenSilently();
            const { data } = await getTopic(accessToken, topicId);
            if (data) {
                setTitle(data.title);
            }
        };

        if (!titleFromState) {
            fetchTopic();
        }
    }, [topicId, getAccessTokenSilently, titleFromState]);

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
                setTotalCardsDue(dueFlashcards.length);
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
                    if (showAnswer) {
                        handleIncorrect();
                    }
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
        if (dueFlashcards.length < updatedFlashcards.length) {
            setFilteredCardsCount(prevCount => prevCount + 1);
        }

        dueFlashcards.sort(() => Math.random() - 0.5); // Randomize order
        setFlashcards(dueFlashcards);
        setMasterFlashcards(updatedMasterFlashcards);
        setCurrentCardIndex(currentCardIndex);
        setShowAnswer(false);

        if (dueFlashcards.length === 0) {
            setSessionElapsedTime(elapsedTime);
            setSessionEnded(true);
        }
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
        // Update the current session flashcards
        const updatedFlashcards = flashcards.map((card, index) =>
            index === currentCardIndex ? updatedCard : card
        );

        // Find and update the edited card in masterFlashcards
        const updatedMasterFlashcards = masterFlashcards.map(card =>
            card.id === updatedCard.id ? updatedCard : card
        );

        setFlashcards(updatedFlashcards);
        setMasterFlashcards(updatedMasterFlashcards);
        setIsEditing(false);
    };


    // Add the handleDelete function in your component
    const handleDelete = async (cardId: number) => {
        const cardToDelete = flashcards.find(card => card.id === cardId);
        if (!cardToDelete) {
            console.error('Card not found');
            return;
        }
        const confirmDelete = window.confirm("Are you sure you want to delete the card?");
        if (confirmDelete) {
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
            setShowAnswer(false);
        }
    };

    const calculateProgress = () => {
        return (filteredCardsCount / totalCardsDue) * 100;
    };

    return (
        <PageLayout>
            <div className="content-layout">
                <div className="content__header">
                    <button className="back-to-topics-button" onClick={handleBack}>
                        {"<< Learn"}
                    </button>
                </div>
                <div className="content__body">
                    <h1 className="learn__title">
                        {title || "Flashcards for topic {topicId}"}
                    </h1>
                    {currentCardIndex < flashcards.length && (
                        <div className="stopwatch">
                            <h3 className="learn__title">
                                {elapsedTime < 3600 ?
                                    `${String(Math.floor(elapsedTime / 60)).padStart(2, '0')}:${String(elapsedTime % 60).padStart(2, '0')}` :
                                    "> 1hr"
                                }
                            </h3>
                        </div>
                    )}
                    {sessionEnded && (
                        <h3 className="learn__title">
                            {sessionElapsedTime < 3600 ?
                                `${String(Math.floor(sessionElapsedTime / 60)).padStart(2, '0')}:${String(sessionElapsedTime % 60).padStart(2, '0')}` :
                                "> 1hr"
                            }
                        </h3>
                    )}
                    <h3 className="card-count__title">
                        {filteredCardsCount} out of {totalCardsDue}
                    </h3>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${calculateProgress()}%` }}></div>
                    </div>
                    {currentCardIndex < flashcards.length ? (
                        isEditing ? (
                            <EditFlashcard card={flashcards[currentCardIndex]} onSave={handleSave} />
                        ) : (
                            <div className="card-container">
                                <p className="card-question">{flashcards[currentCardIndex].question}</p>
                                {showAnswer && (
                                    <>
                                        <div className="answer-separator"></div>
                                        <div className="answer-container">
                                            <p>{flashcards[currentCardIndex].answer}</p>
                                        </div>
                                    </>
                                )}

                                {!showAnswer && <button className="show-answer-button" onClick={() => setShowAnswer(true)}>
                                    Show Answer
                                </button>
                                }
                                {showAnswer && (
                                    <div className="button-container">
                                        <button className="correct-button" onClick={handleCorrect}>
                                            Correct
                                        </button>
                                        <button className="incorrect-button" onClick={handleIncorrect}>
                                            Incorrect
                                        </button>
                                        <button className="edit-card-button" onClick={() => handleEdit(currentCardIndex)}>
                                            Edit
                                        </button>
                                        <button className="delete-card-button" onClick={() => handleDelete(flashcards[currentCardIndex].id)}>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    ) : (
                        <h4 className="learn__title">
                            No more flashcards due today
                        </h4>
                    )}
                    {/* Upcoming flashcards */}
                    {/*                     <div>
                        {showAnswer && <p>Due date: {flashcards[currentCardIndex].due_date}</p>}
                        {showAnswer && <p>Interval: {flashcards[currentCardIndex].interval}</p>}
                        {showAnswer && <p>Record: {flashcards[currentCardIndex].record}</p>}
                        <p>Current time in seconds: {time}</p>
                        <p>End of day in seconds: {endOfDayInSeconds}</p>
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
 */}                </div>
            </div>
        </PageLayout>
    );
};