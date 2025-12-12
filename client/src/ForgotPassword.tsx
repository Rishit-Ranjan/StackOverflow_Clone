// src/ForgotPassword.tsx
import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import './ForgotPassword.css'; // We'll create this for styling

// Get the API URL from environment variables.
// For frameworks like Next.js or Create React App, variables must be prefixed.
// Example for Next.js: NEXT_PUBLIC_API_BASE_URL
// Example for CRA: REACT_APP_API_BASE_URL
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/forgot-password`;

function ForgotPassword() {
    const [identifier, setIdentifier] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            // Make the API call to our server
            const response = await axios.post<{ message: string }>(API_URL, {
                identifier,
            });
            setMessage(response.data.message);
        } catch (err: unknown) {
            // Handle errors, including the rate-limiting error (status 429)
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form">
                <h2>Forgot Your Password?</h2>
                <p>Enter your email address or phone number and we'll send you a new password.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="identifier">Email or Phone Number</label>
                        <input
                            type="text"
                            id="identifier"
                            value={identifier}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
                            placeholder="e.g., user@example.com or 1112223333"
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Reset Password'}
                    </button>
                </form>
                {message && <p className="message success">{message}</p>}
                {error && <p className="message error">{error}</p>}
            </div>
        </div>
    );
}

export default ForgotPassword;
