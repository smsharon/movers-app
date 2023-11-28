import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [csrfToken, setCsrfToken] = useState('');

    // Fetch CSRF token when component mounts
    useEffect(() => {
        fetch('/csrf_token')
            .then(response => response.json())
            .then(data => {
                if (!data.csrf_token) {
                    console.error('No CSRF token received');
                } else {
                    setCsrfToken(data.csrf_token);
                }
            })
            .catch(error => console.error('Error fetching CSRF token:', error));
    }, []);

    const counties = [
        'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa', 
        'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 
        'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 
        'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 
        'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 
        'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 
        'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
    ];

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirm_password: '',
            first_name: '',
            second_name: '',
            surname: '',
            address: '',
            phone_number: '',
            user_type: '',
            agree_terms: false
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
            confirm_password: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
            first_name: Yup.string().required('First name is required'),
            second_name: Yup.string(), // Validation for second name (optional field)
            surname: Yup.string().required('Surname is required'),
            phone_number: Yup.string().required('Phone number is required'),
            user_type: Yup.string().required('User type is required'),
            agree_terms: Yup.bool().oneOf([true], 'You must accept the terms and conditions'),
        }),

        onSubmit: (values, { setSubmitting }) => {
            if (!csrfToken) {
                alert('Error: CSRF token not available. Please refresh the page.');
                setSubmitting(false);
                return;
            }

            console.log('Submitting form with values:', values); // Debugging line

            fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(values)
            })
            .then(async response => {
                if (!response.ok) {
                    // Handle non-200 responses
                    const text = await response.text();
                    try {
                        const data = JSON.parse(text);
                        throw new Error(data.message || 'Signup failed');
                    } catch (error) {
                        throw new Error(text || 'Signup failed');
                    }
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
                navigate('/login');
            })
            .catch(error => {
                console.error('Signup error:', error);
                alert('Signup error: ' + error.message);
            })
            .finally(() => {
                setSubmitting(false);
            });
        },      
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            {/* Username */}
            <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={formik.handleChange}
                value={formik.values.username}
            />
            {/* Email */}
            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={formik.handleChange}
                value={formik.values.email}
            />
            {/* Password */}
            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={formik.handleChange}
                value={formik.values.password}
            />
            {/* Confirm Password */}
            <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                onChange={formik.handleChange}
                value={formik.values.confirm_password}
            />
            {/* First Name */}
            <input
                type="text"
                name="first_name"
                placeholder="First Name"
                onChange={formik.handleChange}
                value={formik.values.first_name}
            />
            {/* Second Name (optional) */}
            <input
                type="text"
                name="second_name"
                placeholder="Second Name"
                onChange={formik.handleChange}
                value={formik.values.second_name}
            />
            {/* Surname */}
            <input
                type="text"
                name="surname"
                placeholder="Surname"
                onChange={formik.handleChange}
                value={formik.values.surname}
            />
            {/* Phone Number */}
            <div>
                <label>+254</label>
                <input
                    type="text"
                    name="phone_number"
                    placeholder="Phone Number"
                    onChange={formik.handleChange}
                    value={formik.values.phone_number}
                />
            </div>
            {/* User Type */}
            <select
                name="user_type"
                onChange={formik.handleChange}
                value={formik.values.user_type}
            >
                <option value="">Select User Type</option>
                <option value="jobseeker">Jobseeker</option>
                <option value="employer">Employer</option>
            </select>
            {/* Address - County Dropdown */}
            <select
                name="address"
                onChange={formik.handleChange}
                value={formik.values.address}
            >
                <option value="">Select a County</option>
                {counties.map((county, index) => (
                    <option key={index} value={county}>{county}</option>
                ))}
            </select>
            {/* Terms and Conditions */}
            <label>
                <input
                    type="checkbox"
                    name="agree_terms"
                    onChange={formik.handleChange}
                    checked={formik.values.agree_terms}
                />
                I agree to the terms and conditions
            </label>
            <button type="submit" disabled={formik.isSubmitting}>Sign Up</button>
        </form>
    );
};

export default Signup