// Page to upload documents for a topic.
import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { uploadDocuments } from "../services/document.service";
import { PageLayout } from 'src/components/page-layout';
import { ColorRingSpinner } from '../components/ColorRingSpinner';
import { useDeleteTopic } from '../hooks/useDeleteTopic';

export const UploadPage: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
    const { getAccessTokenSilently } = useAuth0();
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const handleDeleteTopic = useDeleteTopic(topicId || "");
    const location = useLocation();
    const title = location.state.title;

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

        // Check for unique file names
        const fileNames = selectedFiles.map(file => file.name);
        console.log("Filenames: ", fileNames);
        const uniqueFileNames = new Set(fileNames);

        if (uniqueFileNames.size !== selectedFiles.length) {
            alert("Please remove duplicate files. File names must be unique. Extensions are included in file names, so 'file.pdf' and 'file.docx' are considered unique.");
            return;
        }

        setIsLoading(true);
        const accessToken = await getAccessTokenSilently();

        try {
            await uploadDocuments(accessToken, topicId, selectedFiles);
            navigate(`/learn/${topicId}`);
        } catch (error) {
            console.error("Error uploading documents:", error);
            alert("An error occurred during the upload. Please try again.");
        } finally {
            setIsLoading(false);
        }


    };

    const removeFile = (index: number) => {
        setSelectedFiles(currentFiles => currentFiles.filter((_, i) => i !== index));
    };


    return (
        <PageLayout>
            <div className="content-layout">
                <h1 id="page-title" className="content__title">
                    Upload documents for {title}
                </h1>
                <div className="content__body">
                    <p id="page-description">
                        <span>
                            Upload any .pdf or .docx files.
                        </span>
                    </p>

                    <form onSubmit={handleUpload}>
                        <input type="file" multiple onChange={handleFileChange} />
                        <div>
                            <h3>Selected Files:</h3>
                            {selectedFiles.length === 0 ? (
                                <p>No files selected.</p>
                            ) : (
                                <ul>
                                    {selectedFiles.map((file, index) => (
                                        <li key={index} className="file-item">
                                            {file.name}
                                            <div className="remove-button-container">
                                                <button className="remove-button" onClick={() => removeFile(index)}>
                                                    Remove
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {selectedFiles.length > 0 && (
                                isLoading ? (
                                    <ColorRingSpinner />
                                ) : (
                                    <button className="upload-button" type="submit">
                                        Upload {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""}
                                    </button>
                                )
                            )}
                        </div>
                    </form>
                    {!isLoading && (
                        <button className="cancel-topic-button" onClick={handleDeleteTopic}>
                            Cancel Topic
                        </button>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};