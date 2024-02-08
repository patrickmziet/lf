import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { deleteTopic } from "../services/message.service";

export const useDeleteTopic = (topicId: string) => {
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

    const handleDeleteTopic = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
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
    };

    return handleDeleteTopic;
};