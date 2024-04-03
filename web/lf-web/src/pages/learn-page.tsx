// Page which serves as the HQ for a topic, containts links to flashcards, chat, 
// and test pages. It also has a button to add more documents.
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { jsPDF } from "jspdf";
import { GoTriangleRight, GoTriangleDown } from "react-icons/go";
import { getTopicDocuments } from "../services/document.service";
import { getTopicFlashCards, getTopic, createMoreFlashCards, updateLastViewed } from "../services/message.service";
import { PageLayout } from "../components/page-layout";
import { ColorRingSpinner } from '../components/ColorRingSpinner';
import PDFGenerator from '../components/generate-pdf';
import { Document } from "../models/document";
import { Flashcard } from "../models/flashcard";
import { useDeleteTopic } from "../hooks/useDeleteTopic";

export const LearnPage: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [dueFlashcards, setDueFlashcards] = useState<Flashcard[]>([]);
    const [isInfoOpen, setInfoOpen] = useState<boolean>(false);
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { title: string };
    const [title, setTitle] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
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
        const updateTopicLastViewed = async () => {
            console.log('Entered updateTopicLastViewed');
            if (!topicId) return;
            const accessToken = await getAccessTokenSilently();
            const response = await updateLastViewed(accessToken, topicId);
            console.log('updateLastViewed response:', response); // Debug: print response
        };

        updateTopicLastViewed();
    }, []); // Empty dependency array


    useEffect(() => {
        const fetchDocuments = async () => {
            if (!topicId) return;
            const accessToken = await getAccessTokenSilently();
            const { data } = await getTopicDocuments(accessToken, topicId);
            setDocuments(data);
        };

        const fetchFlashcards = async () => {
            if (!topicId) return;
            const accessToken = await getAccessTokenSilently();
            const { data } = await getTopicFlashCards(accessToken, topicId);
            if (data && Array.isArray(data)) {
                setFlashcards(data);
            }
        };

        fetchDocuments();
        fetchFlashcards();
    }, [topicId]);

    useEffect(() => {
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const endOfDayInSeconds = Math.floor(endOfDay.getTime() / 1000);
        const dueFlashcards = flashcards.filter(card => card.due_date < endOfDayInSeconds);
        setDueFlashcards(dueFlashcards);
    }, [flashcards]);


    const navigateToRapid = (topicId: string) => {
        navigate(`/rapid/${topicId}`, { state: { flashcards, title } });
    };

    const navigateToFlashcards = (topicId: string) => {
        navigate(`/cards/${topicId}`, { state: { flashcards, title } });
    };

    const toggleInfo = () => {
        setInfoOpen(!isInfoOpen);
    };

    // Create more flashcards
    const handleCreateMoreCards = async () => {
        if (!topicId) return;
        const rapidAttemptedCards = flashcards.filter(card => card.rapid_attempts > 0);
        if (rapidAttemptedCards.length < 5) {
            alert("You must study at least 5 cards in rapid mode before more cards can be created.");
            return;
        }
        const accessToken = await getAccessTokenSilently();
        setIsLoading(true);
        try {
            const response = await createMoreFlashCards(accessToken, topicId, flashcards);
            if (response.error) {
                throw new Error(response.error.message);
            }
            if (response.data && Array.isArray(response.data)) {
                setFlashcards(response.data);
            }
        } catch (error) {
            const err = error as Error;
            alert(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageLayout>
            <div className="content-layout">
                <div className="content__header">
                    <button className="back-to-topics-button" onClick={() => navigate('/topics')}>
                        {"<< Topics"}
                    </button>

                    <button className="delete-topic-button" onClick={handleDeleteTopic}>
                        Delete Topic
                    </button>
                    {isLoading ? (
                        <div className="create-more-cards-loading">
                            <ColorRingSpinner height='25' width='25' />
                        </div>
                    ) : (
                        <button className={`create-more-cards-button ${isLoading ? '-loading' : ''}`} onClick={handleCreateMoreCards}>
                            Create More Cards
                        </button>
                    )}
                </div>
                <div className="content__body">
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
                        <PDFGenerator flashcards={flashcards} title={title || "practice"} />
                        <div className={`drop-down-container ${isInfoOpen ? 'open' : ''}`}>
                            <p onClick={toggleInfo}>
                                {isInfoOpen ? <GoTriangleDown /> : <GoTriangleRight />} Learn more about Rapid, Gradual and Cheat Sheet
                            </p>
                            {isInfoOpen && (
                                <ul>
                                    <li>Rapid: Get up to speed fast by studying cards in sessions of 10</li>
                                    <li>Gradual: Learn cards as they become due with <a
                                        href="https://en.wikipedia.org/wiki/Spaced_repetition" target="_blank" rel="noopener noreferrer">spaced repition</a> over days and weeks</li>
                                    <li>Cheat Sheet: Make and AI-generated pdf which focuses on cards you're struggling with to take with you when you're not using LearnFast</li>
                                </ul>
                            )}
                        </div>
                        {/*                         <div>
                            <h1 className="learn__title">
                                Statistics
                            </h1>
                            <p>Total cards: {flashcards.length}</p>
                            <h4 className="learn__title">
                                Rapid
                            </h4>
                            <h4 className="learn__title">
                                Gradual
                            </h4>
                        </div>
 */}                        <div className="resources-container">
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