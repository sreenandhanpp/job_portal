import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { USER } from '../../redux/constants/user';
import { URL } from '../../utils/url';
import axios from 'axios';
import Loader from '../Loader/Loader';
import ApplyBtn from '../ApplyBtn/ApplyBtn';
import { ADMIN } from '../../redux/constants/admin';

const UserDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, data } = useSelector(state => state.getUserDetails);

    useEffect(() => {
        dispatch({ type: ADMIN.FETCH_USER_DETAILS_REQUEST });
        axios.post(URL + '/admin/api/get-user', {
            id: id
        }).then(res => {
            console.log(res);
            dispatch({ type: ADMIN.FETCH_USER_DETAILS_SUCCESS, payload: res.data })
        }).catch(err => {
            dispatch({ type: ADMIN.FETCH_USER_DETAILS_FAILED, payload: err.response.data.message })
        })
    }, [])
    return (
        loading ?
            <Loader />
            :
            data.address &&
            <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="d-flex align-items-center mb-3">
                                <div className="text-start">
                                    <h3 className="">Name: {data.fullname}</h3>
                                </div>
                            </div>

                            <div className="mb-5">
                                <h4 className="mb-3">Contact details</h4>
                                <p>Email:{data.email} </p>
                                <p>Phone:{data.phone} </p>
                                <h4 className="mb-3">Address</h4>
                                <p>City: {data.address.city} </p>
                                <p>State: {data.address.state} </p>
                                <p>Pincode: {data.address.pincode} </p>

                            </div>

                            <div className="">
                                <form>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <ApplyBtn />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default UserDetails
