// Page which serves as the HQ for a topic, containts links to flashcards, chat, 
// and test pages. It also has a button to add more documents.

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getTopicDocuments } from "../services/document.service";
import { getTopicFlashCards, deleteTopic } from "../services/message.service";
import { PageLayout } from "../components/page-layout";
import { Document } from "../models/document";
import { Flashcard } from "../models/flashcard";

export const LearnPage: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { title: string };

    useEffect(() => {
        const fetchDocuments = async () => {
            if (!topicId) return;
            const accessToken = await getAccessTokenSilently();
            const { data } = await getTopicDocuments(accessToken, topicId);
            setDocuments(data);
        };
        
        const fetchFlashcards = async () => {
            if (!topicId) {
                return;
            }
            const accessToken = await getAccessTokenSilently();
            const { data } = await getTopicFlashCards(accessToken, topicId);
            if (data && Array.isArray(data)) {
                setFlashcards(data);
            }
        };

        fetchDocuments();
        fetchFlashcards();
    }, [topicId]);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const endOfDayInSeconds = Math.floor(endOfDay.getTime() / 1000);
    const dueFlashcards = flashcards.filter(card => card.due_date < endOfDayInSeconds);

    const handleDeleteTopic = async () => {
        if (!topicId) return;
        const accessToken = await getAccessTokenSilently();
        const response = await deleteTopic(accessToken, topicId);
        if (response.status === 204) {
          // Handle successful deletion, e.g., navigate back to the topics list
          navigate('/topics');
        }
      };
    
    const navigateToFlashcards = (topicId: string) => {
        navigate(`/cards/${topicId}`, { state: { flashcards } });
    };  
    
    return (
        <PageLayout>
            <div className="content-layout">
                <div className="content__body">
                    <div className="learn-grid">
                        <h1 className="learn__title">
                                {state.title || "Default Title"}
                        </h1>
                        <div className="learn-item" onClick={() => topicId && navigateToFlashcards(topicId)}>
                            <p>{dueFlashcards.length} flashcards are due</p>
                        </div>
                        
                        <button onClick={handleDeleteTopic}>Delete Topic</button>
                        <button onClick={() => navigate('/topics')}>
                            Back to Topics
                        </button>
                        <h1 id="page-title" className="content__title">
                            Resources
                        </h1>
                        <ul>
                            {documents.map((doc, index) => (
                                <li key={index}>{doc.document.split("/").pop()}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>   
        </PageLayout>
    );
};