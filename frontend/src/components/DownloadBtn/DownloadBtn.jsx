import React from 'react'
import { ADMIN } from '../../redux/constants/admin';
import axios from 'axios';
import { URL } from '../../utils/url';
import FileDownload from 'js-file-download';
import { useDispatch } from 'react-redux';

const DownloadBtn = ({ id }) => {
    const dispatch = useDispatch();

    const HandleDownload = (e) => {
        console.log(id);
        e.preventDefault();
        dispatch({ type: ADMIN.DOWNLOAD_REQUEST })
        axios({
            url: URL + '/admin/api/download',
            method: 'POST',
            responseType: 'blob',
            data: {
                id: id
            }
        },
        ).then(res => {
            FileDownload(res.data, "download.pdf")
        })

    }
    return (
        <button className="btn btn-primary w-100" onClick={HandleDownload}>Download CV</button>
    )
}

export default DownloadBtn
