import React from 'react';
import { useParams } from "react-router-dom";
import { PageLayout } from "../components/page-layout";

export const CardPage: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();

    return (
        <PageLayout>
            <div className="content-layout">
                <h1 id="page-title" className="content__title">
                    Flashcards for topic {topicId}
                </h1>
                <p>This is a placeholder for the flashcards content.</p>
            </div>   
        </PageLayout>
    );
};