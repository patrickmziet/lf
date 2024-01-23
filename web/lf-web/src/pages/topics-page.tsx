// Topics page: Web page which lists all existing topics.  Each topic is a link to the topic page 
// as well as the option to make a new topic which takes you to a "new topic" page.  The new topic
// page has a form to create a new topic and upload documents. Existing topics are displayed as a 
// numbered list.

import React, { useEffect, useState, FormEvent } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, Link } from "react-router-dom";
import { PageLayout } from "../components/page-layout";
import { getUserTopics, createTopic, deleteTopic } from "../services/message.service";
import { Topic } from "../models/topic";

export const TopicsPage: React.FC = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [newTopic, setNewTopic] = useState({ title: ''});
    const { user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const fetchTopics = async () => {
            if (!user) return;
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
            navigate(`/upload/${data.id}`);
        }
    };

    const navigateToLearnPage = (topicId: number) => {
        navigate(`/learn/${topicId}`);
    };


    return (
        <PageLayout>
            <div className="content-layout">
                <div className="content__body">
                    <div className="topics-grid">
                        <div className="topic-item add-new-topic">
                            <form onSubmit={handleCreateTopic}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="title"
                                        className="new-topic-input"
                                        value={newTopic.title}
                                        onChange={handleNewTopicChange}
                                        placeholder="Enter Topic Title..."
                                    />
                                </div>
                                <button type="submit" className="create-topic-button">
                                    Create Topic
                                </button>
                            </form>
                        </div>
                        {Array.isArray(topics) && topics.length > 0 && topics.map(topic => (
                            <div key={topic.id} className="topic-item" onClick={() => navigateToLearnPage(topic.id)}>
                                <h3 className="content__title">{topic.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};
