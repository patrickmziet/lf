// Topics page: Web page which lists all existing topics.  Each topic is a link to the topic page 
// as well as the option to make a new topic which takes you to a "new topic" page.  The new topic
// page has a form to create a new topic and upload documents. Existing topics are displayed as a 
// numbered list.

import React, { useEffect, useState, FormEvent } from "react";
import { PageLayout } from "../components/page-layout";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserTopics, createTopic } from "../services/message.service";
import { Topic } from "../models/topic";

export const TopicsPage: React.FC = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [newTopic, setNewTopic] = useState({ title: ''});
    const { user, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        let isMounted = true;

        const fetchTopics = async () => {
            if (!user) {
                return;
            }

            const token = await getAccessTokenSilently();
            const { data } = await getUserTopics(token);

            if (isMounted && data && Array.isArray(data)) {
                setTopics(data);
            }
        };

        fetchTopics();

        return () => {
            isMounted = false;
        };
    }, [user, getAccessTokenSilently]);

    const handleNewTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTopic({
            ...newTopic,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateTopic = async (e: FormEvent) => {
        e.preventDefault();
        const accessToken = await getAccessTokenSilently();
        const { data } = await createTopic(accessToken, newTopic);

        if (data) {
            setTopics([...topics, data]); // Add the new topic to the local state to update the list
            setNewTopic({ title: '' }); // Reset the input after successful creation
        }
    };

    return (
        <PageLayout>
            <div className="content-layout">
                <h1 id="page-title" className="content__title">
                    Topics
                </h1>
                <div className="content__body">
                    <p id="page-description">
                        <span>
                            This is a notes page.  
                        </span>
                    </p>
                    <form onSubmit={handleCreateTopic}>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={newTopic.title}
                                onChange={handleNewTopicChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Create Topic
                        </button>
                    </form>
                    <ol>
                        {Array.isArray(topics) && topics.length > 0 ? (
                            topics.map(topic => (
                                <li key={topic.id}>
                                    <a href={`/topics/${topic.id}`}>{topic.title}</a>
                                </li>
                            ))                            
                        ) : (
                            <p>No topics found</p>
                        )}
                    </ol>
                </div>
            </div>
        </PageLayout>
    );
};
