import React from 'react';
import './ErrorMessage.css'; // Import CSS file

interface ErrorMessageProps {
    message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return (
        <p className="error-message">
            {message}
        </p>
    );
};

export default ErrorMessage;
