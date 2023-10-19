import React from 'react'
import { ADMIN } from '../../redux/constants/admin';
import {URL} from '../../utils/url';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const DeleteJob = ({ id }) => {
    const dispatch = useDispatch();
    const DeleteJob = () => {
        console.log(id)
        dispatch({ type: ADMIN.DELETE_JOB_REQUEST });
        axios.post(URL + '/admin/api/delete-job', {
            id:id
        }).then(res => {
            console.log(res);
            dispatch({ type: ADMIN.DELETE_JOB_SUCCESS,payload:res.data.message });
            toast.success(res.data.message, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }).catch(err=>{
            dispatch({ type: ADMIN.DELETE_JOB_FAILED,payload:err.response.data.message });
            toast.error(err.response.data.message, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        })
    }
  return (
    <Link onClick={(value) => DeleteJob()} className="btn btn-danger" href="">Delete</Link>
    
  )
}

export default DeleteJob