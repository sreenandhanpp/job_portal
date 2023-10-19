import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { URL } from '../../../utils/url';
import './style.css';
import Loader from '../../../components/Loader/Loader';
import { toast } from 'react-toastify';
import Alert from '../../../components/Alert/Alert';
import { ADMIN } from '../../../redux/constants/admin';


const CreateJob = () => {
    const [formValues, setFormValues] = useState({
        company_name: '',
        designation: '',
        vacancy: 0,
        description: '',
        qualifications: '',
        location: '',
        dateline: ''
    });
    const [logo, setLogo] = useState(null);
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);

    // Get access to the Redux 'dispatch' function
    const dispatch = useDispatch();

    //Get global state of userData using useSelector
    const { loading } = useSelector(state => state.createJob);

    const formData = new FormData();
    formData.append('logo', logo);
    formData.append('company_name', formValues.company_name);
    formData.append('description', formValues.description);
    formData.append('qualifications', formValues.qualifications);
    formData.append('location', formValues.location);
    formData.append('dateline', formValues.dateline);
    formData.append('vacancy', formValues.vacancy);
    formData.append('designation', formValues.designation);

    let newErrors = [];

    const validateForm = () => {
        if (!formValues.company_name.trim()) {
            newErrors.push({ field: 'company_name', message: 'Company name is required' });
        }

        if (!formValues.designation.trim()) {
            newErrors.push({ field: 'designation', message: 'Designation is required' });
        }

        if (formValues.vacancy <= 0) {
            newErrors.push({ field: 'vacancy', message: 'Vacancy should be a positive number' });
        }

        if (!formValues.description.trim()) {
            newErrors.push({ field: 'description', message: 'Description is required' });
        } else if (formValues.description.length < 10) {
            newErrors.push({ field: 'description', message: 'Description should be at least 10 characters long' });
        }

        if (!formValues.qualifications.trim()) {
            newErrors.push({ field: 'qualifications', message: 'Qualifications are required' });
        } else if (formValues.qualifications.length < 20) {
            newErrors.push({ field: 'qualifications', message: 'Qualifications should be at least 20 characters long' });
        }


        if (!formValues.location.trim()) {
            newErrors.push({ field: 'location', message: 'Location is required' });
        }

        if (!formValues.dateline.trim()) {
            newErrors.push({ field: 'dateline', message: 'Dateline is required' });
        }

        if (!logo) {
            newErrors.push({ field: 'company_logo', message: 'Company logo is required' });
        }
        setErrors(newErrors);
        return newErrors;
    };

    // Define a function to handle the form submission
    const HandleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        const err = await validateForm()
        if (!err.length > 0) {
            // Try to create a new product
            try {
                // Dispatch an action to indicate the start of the product creation process
                dispatch({ type: ADMIN.CREATE_JOB_REQUEST });

                // Make an HTTP POST request to create a new product
                axios.post(URL + '/admin/api/create-job',
                    formData
                ).then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        // If the creation is successful, dispatch a success action
                        dispatch({ type: ADMIN.CREATE_JOB_SUCCESS });

                        // Display a success message using a toast notification
                        toast.success(res.data.message, {
                            position: toast.POSITION.BOTTOM_CENTER
                        });

                        // Navigate to '/admin' route with replacement (redirect) 
                        navigate('/dashboard', { replace: true });
                    }
                }).catch(err => {
                    console.log(err)
                    if (err) {
                        // Set an error message if there's an error response
                        setErr(err.response.data.error);
                    }

                    // Dispatch a failure action with the error payload
                    dispatch({ type: ADMIN.CREATE_JOB_FAILED, payload: err });
                })
            } catch (err) {
                console.log(err)
                // Dispatch a failure action if an error occurs during the creation process
                dispatch({ type: ADMIN.CREATE_JOB_FAILED, payload: err });
            }
        }
    }

    // Handle changes in input fields by updating the OTP (One-Time Password) state.
    const HandleChange = (e, fieldName) => {
        // Update the form field state using the spread operator to maintain previous values
        setFormValues((prev) => {
            return { ...prev, [e.target.name]: e.target.value }
        });
        const updatedErrors = errors.filter((error) => error.field !== fieldName);
        setErrors(updatedErrors);
    }
    // Define a function to handle the selection of image files
    const handleFile = (e, fieldName) => {
        setLogo(e.target.files[0]);
        const updatedErrors = errors.filter((error) => error.field !== fieldName);
        setErrors(updatedErrors);
    }
    return (
        loading ?
            <Loader />
            :
            <>
                <div className="form-container">
                    <div id="FormContainer">
                        <div className="ImgContainer">
                        </div>
                        <form id="Form">
                            <h1 id="FormHeading">Create Job</h1>
                            <div className="Name">
                                <li><label>Company name:</label>
                                    <input type="text" name='company_name' onChange={(e) => HandleChange(e, 'company_name')} placeholder="Enter name" />
                                    <Alert label={'company_name'} errors={errors} />
                                </li>
                                <li><label>Designation:</label>
                                    <input type="text" name='designation' onChange={(e) => HandleChange(e, 'designation')} placeholder="Enter designation" />
                                    <Alert label={'designation'} errors={errors} />
                                </li>
                            </div>
                            <li>
                                <label>Description:</label>
                                <textarea type="text" className='textarea' name='description' onChange={(e) => HandleChange(e, 'description')} placeholder="Enter  description" />
                                <Alert label={'description'} errors={errors} />
                            </li>
                            <li><label>Qualificatoins:</label>
                                <textarea type="text" name='qualifications' className='textarea' onChange={(e) => HandleChange(e, 'qualifications')} placeholder="Enter qualifications" />
                                <Alert label={'qualifications'} errors={errors} />
                            </li>
                            <div className="Name">
                                <li><label>Vacancy:</label>
                                    <input type="number" name='vacancy' onChange={(e) => HandleChange(e, 'vacancy')} placeholder="Enter vacancy" />
                                    <Alert label={'vacancy'} errors={errors} />
                                </li>
                                <li><label>Date line:</label>
                                    <input type="date" name='dateline' onChange={(e) => HandleChange(e, 'dateline')} placeholder="Enter dateline" />
                                    <Alert label={'dateline'} errors={errors} />
                                </li>
                            </div>
                            <li><label>Location:</label>
                                <input type="text" name='location' onChange={(e) => HandleChange(e, 'location')} placeholder="Enter location" />
                                <Alert label={'location'} errors={errors} />
                            </li>
                            <li><label>Company logo:</label>
                                <input type="file" name='company_logo' onChange={(e) => handleFile(e, 'company_logo')} placeholder="select company logo" />
                                <Alert label={'company_logo'} errors={errors} />
                            </li>
                            <button onClick={e => HandleSubmit(e)} >Sign Up</button>
                        </form>
                    </div>
                </div>
            </>
    )
}

export default CreateJob

