import React, { useState } from 'react';
import axios from 'axios';

const SubmitForm = () => {
    const [link, setLink] = useState('');
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/check', { link });
            setResult(response.data);
        } catch (error) {
            console.error('Error checking the link:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter Telegram Link"
            />
            <button type="submit">Check</button>
            {result && <div>{result}</div>}
        </form>
    );
};

export default SubmitForm;
