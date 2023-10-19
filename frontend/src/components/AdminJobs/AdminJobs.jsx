import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { USER } from '../../redux/constants/user';
import { URL } from '../../utils/url';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { ADMIN } from '../../redux/constants/admin';
import { toast } from 'react-toastify';
import DeleteJob from '../DeleteJob/DeleteJob';
import Applications from '../Applications/Applications';

const AdminJobs = () => {
    const dispatch = useDispatch();
    const { loading, data } = useSelector((state) => state.jobs);
    console.log(data)
    const removeTimeZoneFromDate = (dateString) => {
        // Extract the date part (YYYY-MM-DD) from the original string
        return dateString.split('T')[0];
    }
    useEffect(() => {
        dispatch({ type: USER.FETCH_JOBS_REQUEST })
        axios.get(URL + '/user/api/get-all-jobs').then(res => {
            console.log(res)
            const udpatedData = res.data.map((value) => {
                return {
                    ...value, dateline: removeTimeZoneFromDate(value.dateline)
                }
            }
            )
            dispatch({ type: USER.FETCH_JOBS_SUCCESS, payload: udpatedData })
        }).catch(err => {
            dispatch({ type: USER.FETCH_JOBS_FAILED })
        })
    }, [])

    return (
        loading ?
            <Loader />
            :
            <div className="container-xxl py-5">
                <div className="container">
                    <h1 className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">Job Listing</h1>
                    <div className="tab-class text-center wow fadeInUp" data-wow-delay="0.3s">
                        <ul className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">
                            <li className="nav-item">
                                <Link className="d-flex align-items-center text-start mx-3 ms-0 pb-3 active" data-bs-toggle="pill" to={"#tab-1"}>
                                    <h6 className="mt-n1 mb-0">Jobs</h6>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="d-flex align-items-center text-start mx-3 pb-3" data-bs-toggle="pill" to={"#tab-2"}>
                                    <h6 className="mt-n1 mb-0">Applications</h6>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="d-flex align-items-center text-start mx-3 me-0 pb-3" data-bs-toggle="pill" to={"#tab-3"}>
                                    <h6 className="mt-n1 mb-0">Banners</h6>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="d-flex align-items-center text-start mx-3 me-0 pb-3" data-bs-toggle="pill" to={"#tab-4"}>
                                    <h6 className="mt-n1 mb-0">Create Job</h6>
                                </Link>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div id="tab-1" className="tab-pane fade show p-0 active">

                                {
                                    data.map((value) => {
                                        return (<div key={value._id} className="job-item p-4 mb-4">
                                            <div className="row g-4">
                                                <div className="col-sm-12 col-md-8 d-flex align-items-center">
                                                    <img className="flex-shrink-0 img-fluid border rounded" src={`http://localhost:5000/${value.company_logo}`} alt="" style={{ width: "80px", height: "80px" }} />
                                                    <div className="text-start ps-4">
                                                        <h5 className="mb-3">{value.designation}</h5>
                                                        <span className="text-truncate me-3"><i className="fa fa-map-marker-alt text-primary me-2"></i> {value.location} </span>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
                                                    <div className="d-flex mb-3">
                                                        <Link to={'/update-job'} className="btn btn-primary" href="">Update</Link>
                                                        <DeleteJob id={value._id} />
                                                    </div>
                                                    <small className="text-truncate"><i className="far fa-calendar-alt text-primary me-2"></i>{value.dateline}</small>
                                                </div>
                                            </div>
                                        </div>)
                                    })
                                }

                                <a className="btn btn-primary py-3 px-5" href="">Browse More Jobs</a>
                            </div>
                            <div id="tab-4" className="tab-pane fade show p-0">
                                <div className="job-item p-4 mb-4">
                                    <div className="row g-4">
                                        <div className="col-sm-12 col-md-12 d-flex align-items-center justify-content-center">
                                            <Link to={'/create-job'}><button className='btn btn-primary'> Create Job</button>  </Link>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <Applications />
                            <div id="tab-3" className="tab-pane fade show p-0">
                            <div className="job-item p-4 mb-4">
                                <div className="row g-4">
                                    <div className="col-sm-12 col-md-12 d-flex align-items-center justify-content-center">
                                        <Link to={'/create-banners'}><button className='btn btn-primary'> Create Banners</button>  </Link>
                                    </div>

                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default AdminJobs
