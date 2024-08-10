/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./Register.scss";
import { Link } from "react-router-dom";
import { sendDataToapi } from "../../utils/api";

const Register = () => {
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
    const [loading,setloading] = useState(false);

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

            setloading(true);

            sendDataToapi("/users/register",formDataToSend).then((res)=>{
                setloading(false);
                console.log(res);
            }).catch((err)=>{
                setloading(false);
                console.log(err);
            })
        }
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
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="full-row">
                    <button type="submit" id="submit">Register</button>
                </div>
            </form>
            <Link className="login" to={"/login"}>Already Have Account(Login)</Link>
            {error && <div className="err">{error}</div>}
            {loading && <div>Loading...</div>}
            </div>
        </div>
    );
};

export default Register;
