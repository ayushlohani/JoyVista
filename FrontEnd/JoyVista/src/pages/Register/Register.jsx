/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendDataToapi } from "../../utils/api";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import "./Register.scss";
import Loader from "../../components/Loader/Loader";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        bio: '',
        dob: '',
        email: '',
        phoneno: '',
        password: ''
    });
    const [profilepic, setProfilepic] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setProfilepic(e.target.files[0]); // Store the file object
    };

    const validate = () => {
        const { name, username, password, phoneno, bio, email, dob } = formData;
        if ([name, username, password, phoneno, profilepic, bio, email, dob].some(field => typeof field === 'string' && field.trim() === '')) {
            setError('All fields are required');
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Invalid email format');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('username', formData.username);
            formDataToSend.append('bio', formData.bio);
            formDataToSend.append('dob', formData.dob);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phoneno', formData.phoneno);
            formDataToSend.append('password', formData.password);

            if (profilepic) {
                formDataToSend.append('profilepic', profilepic); // Append the file
            }

            setLoading(true);

            sendDataToapi("/users/register", formDataToSend).then((res) => {
                setLoading(false);
                if (res.data.statusCode === 200) setSuccess(true);
                console.log(res);
            }).catch((err) => {
                setLoading(false);
                console.log(err);
            });
        }
    };

    useEffect(() => {
        if (success) {
            setLoading(true);
            const logindata = {
                email: formData.email,
                password: formData.password
            };
            const logindatatosend = JSON.stringify(logindata);
            sendDataToapi("/users/login", logindatatosend, 'application/json')
                .then((res) => {
                    setLoading(false);
                    console.log(res);
                    if (res.data.statusCode === 200) navigate("/home");
                })
                .catch((err) => {
                    setLoading(false);
                    setError("Incorrect Email or Username or Password");
                });
        }
    }, [success, navigate, formData.email, formData.password]);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="register">
            <div className="left-register">
                <img src="/register.gif" alt="" />
            </div>
            <div className="right-register">
                <h2>Register</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="row">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter Your Full Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter Username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="row">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            id="phoneno"
                            name="phoneno"
                            placeholder="Phone Number"
                            value={formData.phoneno}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="row">
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            placeholder="Date Of Birth"
                            className="file-inp"
                            value={formData.dob}
                            onChange={handleChange}
                        />
                        <input
                            type="file"
                            id="profilepic"
                            name="profilepic"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="full-row">
                        <input
                            type="text"
                            id="bio"
                            name="bio"
                            placeholder="Bio"
                            value={formData.bio}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="full-row">
                        <div className="password-container">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <div className="eye-icon" onClick={togglePasswordVisibility}>
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                    </div>
                    <div className="full-row">
                        <button type="submit" id="submit">Register</button>
                    </div>
                </form>
                {error && <div className="err">*{error}</div>}
                <Link className="login" to={"/login"}>Already Have Account(Login)</Link>
                {loading && <Loader/>}
            </div>
        </div>
    );
};

export default Register;
