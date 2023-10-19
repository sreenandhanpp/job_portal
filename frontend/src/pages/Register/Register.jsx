import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { URL } from '../../utils/url';
import { USER } from '../../redux/constants/user';
import './style.css';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import Alert from '../../components/Alert/Alert';
import { getItem } from '../../../localStorage/getItem'

const Register = () => {
  const [formValues, setFormValues] = useState({
    fullname: '',
    state: '',
    city: '',
    pincode: '',
    password: '',
    dob: '',
  });
  const [cv, setCV] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);

  // Get access to the 'dispatch' function from Redux
  const dispatch = useDispatch();

  // Extract the 'loading' property from the 'userData' slice of Redux state
  const { loading } = useSelector(state => state.userData);
  const userData = getItem('user')

  const newErrors = [];
  const validateForm = () => {
    // Validate file
    if (cv === null) {
      newErrors.push({ field: 'cv', message: 'File is required' });
    }

    // Validate fullname
    console.log(formValues.fullname)
    if (formValues.fullname.trim() === '') {
      newErrors.push({ field: 'fullname', message: 'Full name is required' });
    }

    // Validate state
    if (formValues.state.trim() === '') {
      newErrors.push({ field: 'state', message: 'State is required' });
    }

    // Validate city
    if (formValues.city.trim() === '') {
      newErrors.push({ field: 'city', message: 'City is required' });
    }

    // Validate pincode
    if (formValues.pincode.trim().length !== 6) {
      newErrors.push({ field: 'pincode', message: 'Pincode must be 6 digits' });
    }
    else if (!/^\d{6}$/.test(formValues.pincode)) {
      newErrors.push({ field: 'pincode', message: 'Pincode must contain only numbers' });
    }

    // Validate phone number format (10 digits numeric)
    if (!formValues.dob) {
      newErrors.push({ field: 'dob', message: 'Dob is required' });
    }
    // Validate password using a regular expression
    if (!/^.{8,}$/.test(formValues.password)) {
      newErrors.push({ field: 'password', message: 'Password must be at least 8 characters' });
    }

    setErrors(newErrors);
    return newErrors;
  };



  // Define a function to handle user signup form submission
  const HandleSignup = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData();
    formData.append('cv', cv);
    formData.append('fullname', formValues.fullname);
    formData.append('password', formValues.password);
    formData.append('pincode', formValues.pincode);
    formData.append('state', formValues.state);
    formData.append('city', formValues.city);
    formData.append('dob', formValues.dob);
    formData.append('id', userData._id);
    const err = await validateForm()
    if (!err.length > 0) {

      // Try to initiate the signup process
      try {
        // Dispatch an action to indicate the start of the signup request
        dispatch({ type: USER.SIGNUP_REQUEST });

        // Make an HTTP POST request to the signup API with form data
        axios.post(URL + '/user/api/register',
          formData
        ).then(res => {
          console.log(res);

          // If signup is successful, dispatch a success action with user data
          if (res.status === 200) {
            dispatch({ type: USER.SIGNUP_SUCCESS, payload: res.data });

            // Navigate to the '/verify-email' route
            navigate('/');

            // Display a success message using a toast notification
            toast.success("Account Created", {
              position: toast.POSITION.BOTTOM_CENTER
            });
          }
        }).catch(err => {
          console.log(err)
          if (err.status === 400) {
            newErrors.push({ field: 'phone', message: 'Phone number already exist' });

            // Set an error message if there's an error response
            setErrors(newErrors);
          } else {
            toast.error(err.response.data.message, {
              position: toast.POSITION.BOTTOM_CENTER
            });
          }

          // Dispatch a failure action with the error payload
          dispatch({ type: USER.SIGNUP_FAILED, payload: err });
        })
      } catch (err) {
        // Dispatch a failure action if an error occurs during the signup process
        dispatch({ type: USER.SIGNUP_FAILED, payload: err });
      }
    }
  }

  // Define a function to handle the selection of image files
  const handleFile = (e, fieldName) => {
    // // Convert the selected files to an array
    // const file = e.target.files[0];

    // // Create a FileReader object
    // const reader = new FileReader();

    // // Read the file as a data URL
    // reader.readAsDataURL(file);

    // // When the reading is complete, add the data URL to the 'images' state array
    // reader.onloadend = () => {
    setCV(e.target.files[0]);
    const updatedErrors = errors.filter((error) => error.field !== fieldName);
    setErrors(updatedErrors);
    // }
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
              <h1 id="FormHeading">Sign Up</h1>
              <div className="Name">
                <li><label>Full Name:</label>
                  <input type="text" name='fullname' onChange={(e) => HandleChange(e, 'fullname')} placeholder="Enter your Fullname" />
                  <Alert label={'fullname'} errors={errors} />
                </li>
                <li><label>Date of birth:</label>
                  <input type="date" name='dob' onChange={(e) => HandleChange(e, 'dob')} placeholder="Enter your Phone" />
                  <Alert label={'dob'} errors={errors} />
                </li>
              </div>
              <div className="Name">
                <li><label>City:</label>
                  <input type="text" name='city' onChange={(e) => HandleChange(e, 'city')} placeholder="Enter your city" />
                  <Alert label={'city'} errors={errors} />
                </li>
                <li><label>State:</label>
                  <input type="text" name='state' onChange={(e) => HandleChange(e, 'state')} placeholder="Enter your state" />
                  <Alert label={'state'} errors={errors} />
                </li>
              </div>
              <div className="Name">
                <li>
                  <label>Pincode No:</label>
                  <input type="text" name='pincode' onChange={(e) => HandleChange(e, 'pincode')} placeholder="Enter your pincode" />
                  <Alert label={'pincode'} errors={errors} />
                </li>
                <li><label>Password:</label>
                  <input type="password" name='password' onChange={(e) => HandleChange(e, 'password')} placeholder="Enter password" />
                  <Alert label={'password'} errors={errors} />
                </li>
              </div>
              <li><label>Images:</label>
                <input type="file" name='cv' onChange={(e) => handleFile(e, 'cv')} placeholder="select cv" />
                <Alert label={'cv'} errors={errors} />
              </li>
              <button onClick={(e) => {
                HandleSignup(e)
              }} >Sign Up</button>
            </form>
          </div>
        </div>
      </>
  )
}

export default Register

