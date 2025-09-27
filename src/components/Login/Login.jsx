// components/Login/Login.jsx

import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx'; // Use .jsx for consistency
import { CloseBtn } from '../../Buttons/Modal-Btns.jsx'; // Assuming you use a CloseBtn component

// 1. Component MUST accept 'onClose' prop from the parent that renders the modal.
export const Login = ({ onClose }) => { 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    // Destructure login function from the Auth context
    const { login } = useAuth(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Use username/email for the login function
            await login(username, password); 
            
            // 🔥 CRITICAL FIX: 
            // 1. Close the modal first (which hides the login popup)
            if (onClose) {
                onClose(); 
            }

            // 2. Then, navigate to the desired page (dashboard or /projects)
            // You can change '/dashboard' to '/projects' if that's where you manage the admin tasks
            navigate('/projects'); 

        } catch (err) {
            // Use Firebase's error message for better feedback, or a general message
            console.error("Login failed:", err.message);
            setError('Login failed. Check your credentials.'); 
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}> {/* Allows clicking outside to close */}
            {/* Prevent clicks on the content from closing the modal */}
            <div className="login-container modal-content" onClick={(e) => e.stopPropagation()}>
                
                {/* 2. Add the Close button */}
                {onClose && <CloseBtn onClick={onClose} />}

                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="username">Email</label> {/* Firebase uses email/password */}
                        <input
                            type="email" // Use type="email" for better browser support
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                            placeholder="Enter your email"
                            className="form-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            className="form-input"
                        />
                    </div>
                    
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
}