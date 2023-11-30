import React, { useState, useEffect } from 'react';  
import { useFormik } from 'formik';
import * as Yup from 'yup';  
import { useNavigate } from 'react-router-dom';  


const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email') 
        .required('Required') 
        .test('at-symbol', 'Email must contain "@"', value => value.includes('@')),  
    password: Yup.string()
        .required('Required') 
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one digit')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
});

function Login({ onLoginSuccess }) { 
    const navigate = useNavigate();  
    const [csrfToken, setCsrfToken] = useState(null);  

    useEffect(() => {
        async function fetchCsrfToken() {
            try {
                const response = await fetch('/csrf_token');  
                const data = await response.json();  
                setCsrfToken(data.token); 
            } catch (error) {
                alert("Error fetching CSRF token: " + error);  
            }
        }
        fetchCsrfToken();  
    }, []);  

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: LoginSchema, 
        onSubmit: async (values) => {  
            if (!csrfToken) {
                alert("CSRF token is missing. Please refresh and try again.");
                return;
            }

            try {
                const response = await fetch('/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    body: JSON.stringify(values),
                    credentials: 'include'
                });

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json(); 

                    if (response.ok) {
                        const userResponse = await fetch('/auth', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': csrfToken
                            },
                            credentials: 'include'
                        });

                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            sessionStorage.setItem('userId', userData.id);
                            sessionStorage.setItem('userEmail', userData.email);
                            onLoginSuccess(userData.email);  
                            alert("Login successful!");
                            navigate('/'); 
                        } else {
                            alert("Error fetching user details.");
                        }
                    } else {
                        alert("Login error: " + data.message);
                    }
                } else {
                    alert("An error occurred: Server did not return a JSON response.");
                }
            } catch (error) {
                alert("An error occurred: " + error);
            }
        }
    });

    return (
        <div className="login-page">
            <h2>Login</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        name="email"
                        onChange={formik.handleChange} 
                        onBlur={formik.handleBlur} 
                        value={formik.values.email}  
                    />
                    {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
                </div>
                
                <div className="form-group">
                    <label>Password:</label>
                    <input 
                        type="password" 
                        name="password"
                        onChange={formik.handleChange}  
                        onBlur={formik.handleBlur}  
                        value={formik.values.password}  
                    />
                    {formik.touched.password && formik.errors.password ? <div className="error">{formik.errors.password}</div> : null}
                </div>

                <div className="form-group">
                    <input type="submit" value="Login" />
                </div>
            </form>
        </div>
    );
}

export default Login; 
