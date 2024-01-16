// Page which serves as the HQ for a topic, containts links to flashcards, chat, 
// and test pages. It also has a button to add more documents.

import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getTopicDocuments } from "../services/document.service";
import { PageLayout } from "../components/page-layout";
import { Document } from "../models/document";

export const LearnPage: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const [documents, setDocuments] = useState<Document[]>([]);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchDocuments = async () => {
            if (!topicId) {
                return;
            }
            const accessToken = await getAccessTokenSilently();
            const { data } = await getTopicDocuments(accessToken, topicId);
            setDocuments(data);
        };

        fetchDocuments();
    }, [topicId]);
    

    return (
        <PageLayout>
            <div className="content-layout">
                <h1 id="page-title" className="content__title">
                    Documents for topic {topicId}
                </h1>
                <ul>
                    {documents.map((doc, index) => (
                        <li key={index}>{doc.document.split("/").pop()}</li>
                    ))}
                </ul>
                <Link to={`/cards/${topicId}`}>Study Flashcards</Link>
            </div>   
        </PageLayout>
    );
};