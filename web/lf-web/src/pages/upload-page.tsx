// Page to upload documents for a topic.
import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useParams, useNavigate } from "react-router-dom";
import { uploadDocuments } from "../services/document.service";
import { PageLayout } from 'src/components/page-layout';

export const UploadPage: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    //const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const { getAccessTokenSilently } = useAuth0();
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
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

    const removeFile = (index: number) => {
        setSelectedFiles(currentFiles => currentFiles.filter((_, i) => i !== index));
    };
    

    return (
        <PageLayout>
            <div className="content-layout">
                <h1 id="page-title" className="content__title">
                    Upload documents
                </h1>
                <div className="content__body">
                    <p id="page-description">
                        <span>
                            Upload documents to be used for this topic.
                        </span>
                    </p>
                    <form onSubmit={handleUpload}>
                    <input type="file" multiple onChange={handleFileChange} />
                    <button type="submit">Upload</button>
                    </form>
                    <div>
                        <h3>Selected Files:</h3>
                        {selectedFiles.length === 0 ? (
                            <p>No files selected.</p>
                        ) : (
                            <ul>
                                {selectedFiles.map((file, index) => (
                                    <li key={index}>
                                        {file.name}
                                        <button onClick={() => removeFile(index)}>Remove</button>
                                    </li>
                                ))}
                            </ul>
                            )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};