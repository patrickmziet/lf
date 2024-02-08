// Page which serves as the HQ for a topic, containts links to flashcards, chat, 
// and test pages. It also has a button to add more documents.

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { jsPDF } from "jspdf";
import { GoTriangleRight, GoTriangleDown } from "react-icons/go";
import { getTopicDocuments } from "../services/document.service";
import { getTopicFlashCards, getTopic, createMoreFlashCards } from "../services/message.service";
import { PageLayout } from "../components/page-layout";
import { ColorRingSpinner } from '../components/ColorRingSpinner';
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

    const generatePDF = (flashcards: Flashcard[]) => {
        const doc = new jsPDF();
        const margins = { left: 30, top: 20, right: 30, bottom: 20 };
        const titleFont = "Helvetica";
        const titleSize = 24;
        const titleMarginBottom = 10;
        const bodyFont = "Times";
        const bodySize = 12;
        const padding = 5;

        const pageWidth = doc.internal.pageSize.getWidth();
        const ttl = title + " Cheat Sheet";
        const titleWidth = doc.getStringUnitWidth(ttl) * titleSize / doc.internal.scaleFactor;
        const titleX = (pageWidth - titleWidth) / 2;

        doc.setFont(titleFont);
        doc.setFontSize(titleSize);
        doc.text(ttl, titleX, margins.top);

        let yPos = margins.top + titleMarginBottom;
        doc.setFont(bodyFont);
        doc.setFontSize(bodySize);

        flashcards.forEach((card) => {
            // Text wrapping and dynamic height calculation
            const maxLineWidth = pageWidth - margins.left - margins.right - (padding * 2);
            const questionLines = doc.splitTextToSize(card.question, maxLineWidth);
            const answerLines = doc.splitTextToSize(card.answer, maxLineWidth);
            const lineHeight = 7;
            const cardHeight = (questionLines.length + answerLines.length + 1) * lineHeight + (padding * 3);

            // New page if card doesn't fit
            if (yPos + cardHeight > doc.internal.pageSize.getHeight() - margins.bottom) {
                doc.addPage();
                yPos = margins.top;
            }

            // Draw flashcard rectangle
            doc.roundedRect(margins.left, yPos, pageWidth - margins.left - margins.right, cardHeight, 3, 3, "S");

            // Text y-position inside flashcard
            let textYPos = yPos + lineHeight;

            // Print question lines
            questionLines.forEach((line: string) => {
                doc.text(line, margins.left + padding, textYPos);
                textYPos += lineHeight;
            });
            textYPos -= lineHeight; // Remove the last line's height

            // Draw separating line
            textYPos += lineHeight / 2; // Space before the line
            doc.line(margins.left + padding, textYPos, pageWidth - margins.right - padding, textYPos);
            textYPos += lineHeight; // Space after the line

            // Print answer lines
            answerLines.forEach((line: string) => {
                doc.text(line, margins.left + padding, textYPos);
                textYPos += lineHeight;
            });

            // Update yPos for the next flashcard
            yPos += cardHeight + padding; // Space between cards
        });

        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl);
        doc.save(`${title}-cheatsheet.pdf`);
    };

    const handleGeneratePDF = () => {
        generatePDF(flashcards);
    };

    const toggleInfo = () => {
        setInfoOpen(!isInfoOpen);
    };

    // Create more flashcards
    const handleCreateMoreCards = async () => {
        if (!topicId) return;
        const accessToken = await getAccessTokenSilently();
        setIsLoading(true);
        try {
            const { data } = await createMoreFlashCards(accessToken, topicId, flashcards);
            if (data && Array.isArray(data)) {
                setFlashcards(data);
            }
        } catch (error) {
            console.error("Error creating more flashcards:", error);
            alert("An error occurred during the creation. Please try again.");
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
                        <div className="learn-item" onClick={handleGeneratePDF}>
                            <h4 className="content__title">Cheat Sheet</h4>
                        </div>

                        <div className={`drop-down-container ${isInfoOpen ? 'open' : ''}`}>
                            <p onClick={toggleInfo}>
                                {isInfoOpen ? <GoTriangleDown /> : <GoTriangleRight />} Learn more about Rapid, Gradual and Cheat Sheet
                            </p>
                            {isInfoOpen && (
                                <ul>
                                    <li>Rapid: Get up to speed fast by studying cards in sessions of 10</li>
                                    <li>Gradual: Learn cards as they become due over with <a
                                        href="https://en.wikipedia.org/wiki/Spaced_repetition" target="_blank" rel="noopener noreferrer">spaced repition</a> over days and weeks</li>
                                    <li>Cheat Sheet: Make and AI-generated pdf which focuses on cards you're struggling with to take with you when you're not using LearnFast</li>
                                </ul>
                            )}
                        </div>
                        <div>
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