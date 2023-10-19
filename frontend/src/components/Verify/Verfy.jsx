import React from 'react'
import './style.css'

const Verfy = ({ color, msg, HandleChange, HandleResend, HandleVerify }) => {

    const msgStyle = {
        color: color
    }

    return (
        <div className='otp-container'>
            <form className="otp-Form">
                <div className="container height-100 d-flex justify-content-center align-items-center">
                    <div className="position-relative">
                        <div className="card p-2 text-center">
                            <h6>Please enter the one time password <br /> to verify your email</h6>
                            <div> <span style={msgStyle}>{msg} </span></div>
                            <div id="otp" className="inputs d-flex flex-row justify-content-center mt-2">
                                <input className="m-2 text-center form-control rounded" type="text" id="first" maxLength="1" onChange={HandleChange} name='digitOne' />
                                <input className="m-2 text-center form-control rounded" type="text" id="second" maxLength="1" onChange={HandleChange} name='digitTwo' />
                                <input className="m-2 text-center form-control rounded" type="text" id="third" maxLength="1" onChange={HandleChange} name='digitThree' />
                                <input className="m-2 text-center form-control rounded" type="text" id="fourth" maxLength="1" onChange={HandleChange} name='digitFour' />
                            </div>
                            <div className='row'>
                            <div className="mt-4 col-md-6"> <button className="btn  px-4 validate" onClick={HandleVerify}>Validate</button> </div>
                            <div className="mt-4 col-md-6"> <button className="btn  px-4 resend" onClick={HandleResend}>Resend</button> </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Verfy