import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ADMIN } from '../../redux/constants/admin';
import axios from 'axios';
import { URL } from '../../utils/url';
import { Link } from 'react-router-dom';
import DownloadBtn from '../DownloadBtn/DownloadBtn';

const Applications = () => {
    const dispatch = useDispatch();
    const { loading, data } = useSelector(state => state.applications);

    useEffect(() => {
        dispatch({ type: ADMIN.FETCH_APPLICATIONS_REQUEST });
        axios.get(URL + '/admin/api/applications').then(res => {
            console.log(res);
            dispatch({ type: ADMIN.FETCH_APPLICATIONS_SUCCESS, payload: res.data });
        }).catch(err => {
            console.log(err)
            dispatch({ type: ADMIN.FETCH_APPLICATIONS_FAILED });
        })
    }, [])
    return (
        <div id="tab-2" className="tab-pane fade show p-0">
            {
                data.map((value) => {
                    return (<div key={value._id} className="job-item p-4 mb-4">
                        <div className="row g-4">
                            <div className="col-sm-12 col-md-8 d-flex align-items-center">
                                <div className="text-start ps-4">
                                    <h5 className="mb-3">{value.jobDetails.designation}</h5>
                                    <span className="text-truncate me-3"><i className="far fa-building text-primary me-2"></i> {value.jobDetails.company_name} </span>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
                                <div className="d-flex mb-3">
                                    <DownloadBtn id={value.userId} />
                                </div>
                                <small className="text-truncate"><i className="far fa-user text-primary me-2"></i><u className='text-primary'> <Link to={`/user-details/${value.userId}`}> View profile</Link>  </u></small>
                            </div>
                        </div>
                    </div>)
                })
            }

            <a className="btn btn-primary py-3 px-5" href="">Browse More Jobs</a>
        </div>
    )
}

export default Applications