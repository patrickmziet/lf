// Page which serves as the HQ for a topic, containts links to flashcards, chat, 
// and test pages. It also has a button to add more documents.

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { jsPDF } from "jspdf";
import { getTopicDocuments } from "../services/document.service";
import { getTopicFlashCards, deleteTopic, getTopic } from "../services/message.service";
import { PageLayout } from "../components/page-layout";
import { Document } from "../models/document";
import { Flashcard } from "../models/flashcard";
import { useDeleteTopic } from "../hooks/useDeleteTopic";

export const LearnPage: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { title: string };
    const [title, setTitle] = useState<string | null>(null);
    const handleDeleteTopic = useDeleteTopic(topicId || "");

    useEffect(() => {
        const fetchTopic = async () => {
          if (!topicId) return;
          const accessToken = await getAccessTokenSilently();
          const { data } = await getTopic(accessToken, topicId); // Replace with your actual API call
          if (data) {
            setTitle(data.title);
          }
        };
    
        if (state && state.title) {
          setTitle(state.title);
        } else {
          fetchTopic();
        }
      }, [topicId, state]);
    
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

    /* const handleDeleteTopic = async () => {
        if (!topicId) return;
        const isConfirmed = window.confirm('Are you sure you want to delete this topic?');
        if (isConfirmed) {
            const accessToken = await getAccessTokenSilently();
            const response = await deleteTopic(accessToken, topicId);
            if (response.status === 204) {
                // Handle successful deletion, e.g., navigate back to the topics list
                navigate('/topics');
            }
        }
      }; */
    
    const navigateToRapid = (topicId: string) => {
        navigate(`/rapid/${topicId}`, { state: { flashcards, title } });
    };  

    const navigateToFlashcards = (topicId: string) => {
        navigate(`/cards/${topicId}`, { state: { flashcards, title } });
    };  


    const generatePDF = (flashcards: Flashcard[]) => {
        const doc = new jsPDF();
        flashcards.forEach((card, index) => {
            doc.text(index + 1 + ". " + "Question: " + card.question, 10, 20 + index * 20);
            doc.text("Answer: " + card.answer, 10, 30 + index * 20);
        });
        doc.save(title + "-flashcards.pdf");
    };
    
    const handleGeneratePDF = () => {
        generatePDF(flashcards);
    };  

    
    return (
        <PageLayout>
            <div className="content-layout">
                <div className="content__body">
                    <button className="back-to-topics-button" onClick={() => navigate('/topics')}>
                            {"<< Topics"}
                    </button>
                    <button className="delete-topic-button" onClick={handleDeleteTopic}>
                        Delete Topic
                    </button>
                    <div className="learn-grid">
                        <h1 className="learn__title">
                                {title || "Loading..."}
                        </h1>
                        <div className="learn-item" onClick={() => topicId && navigateToRapid(topicId)}>
                            <h4 className="content__title">Rapid</h4>
                        </div>
                        <div className="learn-item" onClick={() => topicId && navigateToFlashcards(topicId)}>
                            <h4 className="content__title">Gradual - {dueFlashcards.length} due</h4>
                        </div>
                        <div className="learn-item" onClick={handleGeneratePDF}>
                            <h4 className="content__title">Cheat Sheet</h4>
                        </div>
                        <div className="resources-container">
                            <h1 className="learn__title">
                                Resources
                            </h1>
                            <ul className="resources-list">
                            {documents.filter(doc => !doc.document.includes("combined_file")).map((doc, index) => (
                                    <li key={index}>{doc.document.split("/").pop()}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>   
        </PageLayout>
    );
};