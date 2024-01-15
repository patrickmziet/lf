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

    return (
        <PageLayout>
            <div className="content-layout">
                <h1 id="page-title" className="content__title">
                    Flashcards for topic {topicId}
                </h1>
                <ul>
                    {Array.isArray(flashcards) && flashcards.length > 0 ? (
                        flashcards.map(flashcard => (
                            <li key={flashcard.id}>
                                <p>{flashcard.question}</p>  // replace with actual fields
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