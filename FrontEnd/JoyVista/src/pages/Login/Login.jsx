/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendDataToapi } from "../../utils/api";
import "./Login.scss"

const Login = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        emailUsername: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const validate = () => {
        const { emailUsername, password } = data;
        if (emailUsername === '' || password === '') {
            setError('All fields are required');
            return false;
        }
        setError('');
        return true;
    }

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const formData = {
                email: data.emailUsername,
                username: data.emailUsername,
                password: data.password
            }
            const formDataToSend = JSON.stringify(formData);
            console.log(formDataToSend);
            setLoading(true);
            sendDataToapi("/users/login", formDataToSend,'application/json')
                .then((res) => {
                    setLoading(false);
                    console.log(res);
                    if(res.data.statusCode === 200) navigate("/home");
                })
                .catch((err) => {
                    setLoading(false);
                    setError("Incorrect Email or Username or Password");
                });
        }
    }

    return (
        <div className="login">
            <div className="left-login">
                <img src="/register.gif" alt="Register Animation" />
            </div>
            <div className="right-login">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="emailUsername"
                        name="emailUsername"
                        placeholder="Enter Your Email or Username"
                        value={data.emailUsername}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter Password"
                        value={data.password}
                        onChange={handleChange}
                    />
                    <button type="submit" id="submit">Login</button>
                </form>
                {error && <div className="err">{error}</div>}
                <Link className="login-link" to="/register">New User(Register)</Link>
                {loading && <div>Loading...</div>}
            </div>
        </div>
    );
}

export default Login;
