import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { PageLayout } from "../components/page-layout";
import { getTopicFlashCards } from "../services/message.service";
import { Flashcard } from "../models/flashcard";
import { useAuth0 } from "@auth0/auth0-react";

export const CardPage: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const { getAccessTokenSilently } = useAuth0();
    const [time, setTime] = useState(Math.floor(Date.now() / 1000));

    useEffect(() => {
        let isMounted = true;

        const fetchFlashcards = async () => {
            if (!topicId) {
                return;
            }
            const token = await getAccessTokenSilently();
            const { data } = await getTopicFlashCards(token, topicId);

            if (isMounted && data && Array.isArray(data)) {
                setFlashcards(data);
            }
        };

        fetchFlashcards();

        return () => {
            isMounted = false;
        };
    }, [topicId, getAccessTokenSilently]);

    useEffect(() => { // Add this effect hook
        const interval = setInterval(() => {
            setTime(Math.floor(Date.now() / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <PageLayout>
            <div className="content-layout">
                <h1 id="page-title" className="content__title">
                    Flashcards for topic {topicId}
                </h1>
                <p>Current time in secoonds: {time}</p>
                <ul>
                    {Array.isArray(flashcards) && flashcards.length > 0 ? (
                        flashcards.map(flashcard => (
                            <li key={flashcard.id}>
                                <p>{flashcard.question}</p>  // replace with actual fields
                                <p>{flashcard.answer}</p>
                                <p>{flashcard.easiness}</p>
                                <p>{flashcard.interval}</p>
                                <p>{flashcard.repetitions}</p>
                                <p>{flashcard.record}</p>
                                <p>{flashcard.due_date}</p>
                                {/*Check whether current time is greater than due date*/}
                                {time > flashcard.due_date ? (
                                    <p>Due date is passed</p>
                                ) : (
                                    <p>Due date is not passed</p>
                                )}
                            </li>
                        ))                            
                    ) : (
                        <p>No flashcards found for this topic</p>
                    )}
                </ul>
            </div>   
        </PageLayout>
    );
};