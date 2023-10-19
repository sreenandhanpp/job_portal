import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { URL } from '../../../utils/url';
import Loader from '../../../components/Loader/Loader';
import { toast } from 'react-toastify';
import Alert from '../../../components/Alert/Alert';

const CreateBanner = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState(null);


    // Get access to the 'dispatch' function from Redux

    // Extract the 'loading' property from the 'userData' slice of Redux state
    const { loading } = useSelector(state => state.userData);

    const newErrors = [];
    const validateForm = () => {
        // Validate file
        console.log(selectedFiles)
        if (selectedFiles.length < 0) {
            newErrors.push({ field: 'banners', message: 'Select 3 Images ' });
        }

        setErrors(newErrors);
        return newErrors;
    };
    const formData = new FormData();



    // Define a function to handle user signup form submission
    const HandleCreateBanner = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        await handleUpload();

        const err = await validateForm()
        if (!err.length > 0) {
            // Try to initiate the signup process
            try {
                // Dispatch an action to indicate the start of the signup request

                // Make an HTTP POST request to the signup API with form data
                axios.post(URL + '/admin/api/banner',
                    formData
                ).then(res => {

                    // If signup is successful, dispatch a success action with user data
                    if (res.status === 200) {
                        // Navigate to the '/verify-email' route
                        navigate('/dashboard');

                        // Display a success message using a toast notification
                        toast.success("Banner created successfully", {
                            position: toast.POSITION.BOTTOM_CENTER
                        });
                    }
                }).catch(err => {
                    toast.error(err.response.data.message, {
                        position: toast.POSITION.BOTTOM_CENTER
                    });


                    // Dispatch a failure action with the error payload
                })
            } catch (err) {
                // Dispatch a failure action if an error occurs during the signup process
            }
        }
    }


    const handleFileChange = (e, fieldName) => {
        console.log(e.target.files)
        setSelectedFiles(e.target.files);
        const updatedErrors = errors.filter((error) => error.field !== fieldName);
        setErrors(updatedErrors);
    };

    const handleUpload = () => {
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('banners', selectedFiles[i]);
        }

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
                            <h1 id="FormHeading">Create Banners</h1>
                            <li><label>Images:</label>
                                <input type="file" name='banners' multiple onChange={(e) => handleFileChange(e, 'banners')} placeholder="select 3 images" />
                                <Alert label={'banners'} errors={errors} />
                            </li>
                            <button onClick={(e) => {
                                HandleCreateBanner(e)
                            }} >Sign Up</button>
                        </form>
                    </div>
                </div>
            </>
    )
}

export default CreateBanner

