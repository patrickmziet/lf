import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "../components/page-layout";
import { getTopicFlashCards, updateFlashCards, deleteFlashCard, getTopic } from "../services/message.service";
import { Flashcard } from "../models/flashcard";
import { useAuth0 } from "@auth0/auth0-react";
import { EditFlashcard } from '../components/edit-flashcard';

export const RapidPage: React.FC = () => {
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
    const [sessionGroups, setSessionGroups] = useState<Flashcard[][]>([]);
    const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
    const group_size = 5; // Group size
    const consec_limit = 3; // Consecutive correct limit
    const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [sessionEnded, setSessionEnded] = useState(false);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [correctAttempts, setCorrectAttempts] = useState(0);
    const [sessionHitRates, setSessionHitRates] = useState<number[]>([]);
    const [filteredCardsCount, setFilteredCardsCount] = useState(0);

    // Start session timer
    useEffect(() => {
        const start = Date.now();
        setSessionStartTime(start);
    
        const timer = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - start) / 1000));
        }, 1000);
    
        return () => clearInterval(timer);
    }, []); // Empty dependency array means this effect runs once when the component mounts
    

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

    // Group flashcards
    const groupFlashcards = (flashcards: Flashcard[], groupSize: number): Flashcard[][] => {
        const groups: Flashcard[][] = [];
        for (let i = 0; i < flashcards.length; i += groupSize) {
            groups.push(flashcards.slice(i, i + groupSize));
        }
        return groups;
    };

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
                const flashcardGroups = groupFlashcards(data, group_size); 
                setSessionGroups(flashcardGroups);
                setFlashcards(flashcardGroups[0] || []);
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
        setTotalAttempts(prevTotalAttempts => prevTotalAttempts + 1);
        setCorrectAttempts(prevCorrectAttempts => prevCorrectAttempts + 1);

        const updatedFlashcards = [...flashcards];
        const updatedCard = { ...updatedFlashcards[currentCardIndex] };
        updatedCard.consecutive_correct += 1;
        updatedFlashcards[currentCardIndex] = updatedCard;
        const dueFlashcards = updatedFlashcards.filter(card => card.consecutive_correct < consec_limit);        

        // Check if a card has been filtered out and increment filteredCardsCount
        if (dueFlashcards.length < updatedFlashcards.length) {
            setFilteredCardsCount(prevCount => prevCount + 1);
        }

        dueFlashcards.sort(() => Math.random() - 0.5); // Randomize order
        setFlashcards(dueFlashcards);
        setCurrentCardIndex(currentCardIndex);
        setShowAnswer(false);
    };

    const handleIncorrect = () => {
        if (currentCardIndex >= flashcards.length) return;

        setTotalAttempts(prevTotalAttempts => prevTotalAttempts + 1);

        const updatedFlashcards = [...flashcards];
        const updatedCard = { ...updatedFlashcards[currentCardIndex] };
        updatedCard.consecutive_correct = 0;

        updatedFlashcards[currentCardIndex] = updatedCard;
        updatedFlashcards.sort(() => Math.random() - 0.5); // Randomize order
        setFlashcards(updatedFlashcards);
        setCurrentCardIndex(currentCardIndex);
        setShowAnswer(false);
    };
    
    const handleNextSession = () => {
        const nextSessionIndex = currentSessionIndex + 1;
        if (nextSessionIndex < sessionGroups.length) {
            setSessionEnded(true);
            // Calculate hit rate for the session
            const hitRate = (correctAttempts / totalAttempts) * 100;
            // Add hit rate to the list
            setSessionHitRates(prevHitRates => [...prevHitRates, hitRate]);
            // Set all cards consecutive_correct to 0
            const updatedMasterFlashcards = masterFlashcards.map(card => ({ ...card, consecutive_correct: 0 }));
            setMasterFlashcards(updatedMasterFlashcards);
            setCurrentSessionIndex(nextSessionIndex);
            setFlashcards(sessionGroups[nextSessionIndex]);
            setTotalAttempts(0);
            setCorrectAttempts(0);
            setFilteredCardsCount(0);
        } else {
            // Handle the case where there are no more sessions
            console.log("No more sessions");
        }
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

        // Update state to reflect changes in both flashcards and masterFlashcards
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
    /* YOU ARE HERE: NOW FIX TIME ELAPSED AND THE END SCREEN WHEN SESSIONS ARE COMPLETED */
    const calculateProgress = () => {
        const totalPossibleCorrects = (flashcards.length + filteredCardsCount) * consec_limit;
        console.log("Flashcards length:", flashcards.length);
        console.log("Filtered cards count:", filteredCardsCount);
        console.log("Total possible corrects:", totalPossibleCorrects);
        const sumOfCorrects = flashcards.reduce((acc, card) => acc + card.consecutive_correct, 0) + filteredCardsCount * consec_limit;
        console.log("Sum of corrects:", sumOfCorrects);
        return (sumOfCorrects / totalPossibleCorrects) * 100;
    };
    

    return (
        <PageLayout>
            <div className="content-layout">
                <div className="content__body"> 
                    <button className="back-to-topics-button" onClick={handleBack}>
                        {"<< Learn"}
                    </button>
                     <h1 className="learn__title">
                        {title || "Flashcards for topic {topicId}"}
                    </h1>
                    <div className="stopwatch">
                        {elapsedTime < 3600 ? 
                            `${String(Math.floor(elapsedTime / 60)).padStart(2, '0')}:${String(elapsedTime % 60).padStart(2, '0')}` : 
                            "> 1hr"
                        }
                    </div>
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
                    <>
                        <h4 className="learn__title">
                            No more flashcards
                        </h4>
                        {sessionGroups.length > currentSessionIndex + 1 && (
                            <button className="next-session-button" onClick={handleNextSession}>
                                Next Session
                            </button>
                        )}
                    </>
                    )}
                    {sessionEnded && (
                        <div className="session-stats">
                            <p>Session Time: {elapsedTime < 3600 ? 
                                `${String(Math.floor(elapsedTime / 60)).padStart(2, '0')}:${String(elapsedTime % 60).padStart(2, '0')}` : 
                                "> 1hr"
                            }</p>
                            // Display hit rates for past sessions
                            {sessionHitRates.map((hitRate, index) => (
                                <p key={index}>Session {index + 1} Hit Rate: {hitRate.toFixed(2)}%</p>
                            ))}
                        </div>
                    )}    
                    {/* Upcoming flashcards */}
                    <div>
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
                                <p>Consecutive: {card.consecutive_correct}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>   
        </PageLayout>
    );
};