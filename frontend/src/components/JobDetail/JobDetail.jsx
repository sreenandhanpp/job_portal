import React, { useEffect } from 'react';
import './style.css';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { USER } from '../../redux/constants/user';
import { URL } from '../../utils/url';
import axios from 'axios';
import Loader from '../Loader/Loader';
import ApplyBtn from '../ApplyBtn/ApplyBtn';

const JobDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, data } = useSelector(state => state.userJobDetails);
    const removeTimeZoneFromDate = (dateString) => {
        // Extract the date part (YYYY-MM-DD) from the original string
        return dateString.split('T')[0];
    }
    useEffect(() => {
        dispatch({ type: USER.FETCH_JOB_REQUEST });
        axios.post(URL + '/admin/api/get-job-details', {
            id: id
        }).then(res => {
            console.log(res)
            res.data.dateline = removeTimeZoneFromDate(res.data.dateline);
            res.data.postedDate = removeTimeZoneFromDate(res.data.postedDate)
            dispatch({ type: USER.FETCH_JOB_SUCCESS, payload: res.data })
        }).catch(err => {
            dispatch({ type: USER.FETCH_JOB_FAILED, payload: err.response.data.message })
        })
    }, [])
    return (
        loading ?
            <Loader />
            :
            <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
                <div className="container">
                    <div className="row gy-5 gx-4">
                        <div className="col-lg-8">
                            <div className="d-flex align-items-center mb-5">
                                <img className="flex-shrink-0 img-fluid border rounded" src={`http://localhost:5000/${data.company_logo}`} alt="" style={{ width: " 80px", height: '80px' }} />
                                <div className="text-start ps-4">
                                    <h3 className="mb-3">{data.designation} </h3>
                                    <span className="text-truncate me-3"><i className="fa fa-map-marker-alt text-primary me-2"></i>{data.location} </span>
                                    <span className="text-truncate me-0"><i class="far fa-building text-primary me-2"></i> {data.company_name} </span>
                                </div>
                            </div>

                            <div className="mb-5">
                                <h4 className="mb-3">Job description</h4>
                                <p>{data.description} </p>
                                <h4 className="mb-3">Qualifications</h4>
                                <p>{data.qualifications} </p>
                               
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

                        <div className="col-lg-4">
                            <div className="bg-light rounded p-5 mb-4 wow slideInUp" data-wow-delay="0.1s">
                                <h4 className="mb-4">Job Summery</h4>
                                <p><i className="fa fa-angle-right text-primary me-2"></i>Published On: {data.postedDate}</p>
                                <p><i className="fa fa-angle-right text-primary me-2"></i>Vacancy: {data.vacancy} </p>
                                <p><i className="fa fa-angle-right text-primary me-2"></i>Location: {data.location} </p>
                                <p className="m-0"><i className="fa fa-angle-right text-primary me-2"></i>Date Line: {data.dateline} </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default JobDetails
