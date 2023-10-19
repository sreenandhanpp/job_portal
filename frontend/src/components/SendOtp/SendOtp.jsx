import React from 'react'
import './style.css'


const SendOtp = ({ msg, HandleAction, color, setValue }) => {

    const msgStyle = {
        color: color
    }
    return (
        <div>
            <div className="container height-100 d-flex justify-content-center align-items-center">
                <div className="position-relative">
                    <div className="card p-2 text-center">
                        <h6>Please press the get otp button <br /> to get otp</h6>
                        <div> <span style={msgStyle}>{msg}</span> </div>
                        <div className=" d-flex flex-row justify-content-center mt-2">
                            <input className="m-2 text-center form-control rounded" type="text" onChange={(e) => setValue(e.target.value)} />
                        </div>
                        <div className="mt-4"> <button className="btn btn-danger px-4 validate" onClick={HandleAction} >Get otp</button> </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SendOtp