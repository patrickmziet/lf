import React from 'react';
import { jsPDF } from "jspdf";
import { Flashcard } from "../models/flashcard";

interface PDFGeneratorProps {
    flashcards: Flashcard[];
    title: string;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ flashcards, title }) => {
    const generatePDF = () => {
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

    return (
        <div className="learn-item" onClick={generatePDF}>
            <h4 className="content__title">Cheat Sheet</h4>
        </div>
    );
};

export default PDFGenerator;