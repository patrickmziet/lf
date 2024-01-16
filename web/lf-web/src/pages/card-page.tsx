import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { PageLayout } from "../components/page-layout";
import { getTopicFlashCards, updateFlashCards } from "../services/message.service";
import { Flashcard } from "../models/flashcard";
import { useAuth0 } from "@auth0/auth0-react";

export const CardPage: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const { getAccessTokenSilently } = useAuth0();
    const [time, setTime] = useState(Math.floor(Date.now() / 1000));
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const [endOfDayInSeconds, setEndOfDayInSeconds] = useState(Math.floor(endOfDay.getTime() / 1000));

    useEffect(() => {
        let isMounted = true;

        const fetchFlashcards = async () => {
            if (!topicId) return;
            const token = await getAccessTokenSilently();
            const { data } = await getTopicFlashCards(token, topicId);

            if (isMounted && data && Array.isArray(data)) {
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

    useEffect(() => { 
        const interval = setInterval(() => {
            setTime(Math.floor(Date.now() / 1000));

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            setEndOfDayInSeconds(Math.floor(endOfDay.getTime() / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleCorrect = () => {
        if (currentCardIndex >= flashcards.length) return;

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
        const dueFlashcards = updatedFlashcards.filter(card => card.due_date < endOfDayInSeconds);
        dueFlashcards.sort(() => Math.random() - 0.5); // Randomize order
        setFlashcards(dueFlashcards);
        setCurrentCardIndex(currentCardIndex);
        setShowAnswer(false);
    };

    const handleIncorrect = () => {
        if (currentCardIndex >= flashcards.length) return;

        const updatedFlashcards = [...flashcards];
        const updatedCard = { ...updatedFlashcards[currentCardIndex] };
        updatedCard.record += "0";
        updatedCard.repetitions = 0;
        updatedCard.interval = 60;
        updatedCard.due_date = time + updatedCard.interval;
        updatedCard.updated_at = time;

        updatedFlashcards[currentCardIndex] = updatedCard;
        const dueFlashcards = updatedFlashcards.filter(card => card.due_date < endOfDayInSeconds);
        dueFlashcards.sort(() => Math.random() - 0.5); // Randomize order
        setFlashcards(dueFlashcards);
        setCurrentCardIndex(currentCardIndex);
        setShowAnswer(false);
    };

    const handleFinish = async () => {
        if (!topicId) return;
        const token = await getAccessTokenSilently();
        await updateFlashCards(token, flashcards, topicId);
    };

    return (
        <PageLayout>
            <div className="content-layout">
                <h1 id="page-title" className="content__title">
                    Flashcards for topic {topicId}
                </h1>
                <p>Current time in seconds: {time}</p>
                <p>End of day in seconds: {endOfDayInSeconds}</p>
                {currentCardIndex < flashcards.length ? (
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
                    </div>
                ) : (
                    <div>
                        <p>No more flashcards for this session</p>
                        <button onClick={handleFinish}>Finish Session</button>
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