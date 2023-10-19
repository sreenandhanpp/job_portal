import React from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { USER } from '../../redux/constants/user';
import { getItem } from '../../../localStorage/getItem';
import { URL } from '../../utils/url';
import axios from 'axios';
import { toast } from 'react-toastify';

const ApplyBtn = ({ job }) => {
    const userData = getItem('user');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const HandleApply = () => {
        if (userData && userData.fullname) {
            dispatch({ type: USER.APPLY_REQUEST });
            axios.post(URL + '/user/api/apply', {
                userId: userData._id,
                job_id: job._id,
                company_name: job.company_name,
                designation: job.designation
            }).then(res => {
                dispatch({ type: USER.APPLY_SUCCESS })
                toast.success(res.data.message, {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            }).catch(err => {
                dispatch({ type: USER.APPLY_FAILED })
                toast.error(err.response.data.message, {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            })
        } else {
            navigate('/verify-email');
        }
    }
    return (
        <button className="btn btn-primary w-100" onClick={HandleApply}>Apply Now</button>
    )
}

export default ApplyBtn