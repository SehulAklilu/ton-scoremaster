import { useEffect, useState } from "react";
import axios from "axios";

const Login = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get user data from Telegram WebApp
        const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

        if (!telegramUser) {
            console.error("Telegram authentication data not found.");
            return;
        }

        // Send user data to the backend for verification
        axios.post("http://localhost:5000/api/auth/telegram", telegramUser)
            .then(response => setUser(response.data.user))
            .catch(() => console.error("Authentication failed"));
    }, []);

    return (
        <div>
            {user ? (
                <h2>Welcome, {user.first_name}!</h2>
            ) : (
                <h2>Authenticating...</h2>
            )}
        </div>
    );
};

export default Login;
