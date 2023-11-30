// Page to upload documents for a topic.
import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useParams, useNavigate } from "react-router-dom";
import { uploadDocuments } from "../services/document.service";

export const UploadPage: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const { getAccessTokenSilently } = useAuth0();
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.target.files);
    };

    const handleUpload = async (e: React.FormEvent) => {
        if (!topicId || !selectedFiles) {
            return;
        }
        e.preventDefault();
        const accessToken = await getAccessTokenSilently();
        await uploadDocuments(accessToken, topicId, selectedFiles);
        navigate(`/learn/${topicId}`);
    };

    return (
        <form onSubmit={handleUpload}>
            <input type="file" multiple onChange={handleFileChange} />
            <button type="submit">Upload</button>
        </form>
    );
};