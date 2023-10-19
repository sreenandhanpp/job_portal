import React, { useEffect, useState } from 'react';
import { getItem } from '../../../localStorage/getItem';
import { setItem } from '../../../localStorage/setItem';
import axios from 'axios';
import SendOtp from '../../components/SendOtp/SendOtp';
import { URL } from '../../utils/url';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { USER } from '../../redux/constants/user';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import 'react-toastify/dist/ReactToastify.css';


const SendEmailOtp = () => {
    const [msg, setMsg] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [color,setColor ] = useState('green');

    //getting state from global state
    const { loading } = useSelector(state => state.sendOtp);


    // Handle a user's request to send an email OTP (One-Time Password).
    const HandleRequest = (e) => {
        console.log(email)
        e.preventDefault();
        try {
            // Dispatch an action to indicate the request is in progress
            dispatch({ type: USER.SEND_OTP_REQUEST });

            // Send a POST request to the server to send an email OTP
            axios.post(URL + '/user/api/send-email-otp', {
                email: email
            }).then(res => {
                console.log(res)
                if (res.status == 200) {
                    // Display a success message to the user
                    toast.success("Otp sended successfully", {
                        position: toast.POSITION.BOTTOM_CENTER
                    });

                    //setting sendEmail to true and update in localstorage for further validation
                    setItem('user', res.data);

                    // Dispatch an action to indicate a successful email OTP send
                    dispatch({ type: USER.SEND_OTP_SUCCESS });

                    // Redirecting to verify email page using useNavigate hook
                    navigate('/verify-email');
                }
            }).catch(err => {
                console.log(err);
                // Dispatch an action to indicate a failed email OTP send
                dispatch({ type: USER.SEND_OTP_FAILED });

                // Display an error message to the user
                toast.error(err.data.message, {
                    position: toast.POSITION.BOTTOM_CENTER
                });

            });
        } catch (error) {
            if(error.status === 400){
                setMsg("Email already exist")
                setColor('red');
            }
            // Dispatch an action to indicate a failed email OTP send
            dispatch({ type: USER.SEND_OTP_FAILED });

            // Display a generic error message to the user
            toast.error("Somthing went wrong", {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }
    }
    return (
        loading ?
            <Loader />
            :
            <div>
                <SendOtp msg={msg} HandleAction={HandleRequest} color={color} setValue={setEmail}/>
            </div>
    )
}

export default SendEmailOtp