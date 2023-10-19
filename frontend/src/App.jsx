import { Route, Routes } from 'react-router-dom';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import VerifyPhone from './pages/VerifyPhone/VerifyPhone';
import Register from './pages/Register/Register';
import SendEmailOtp from './pages/SendEmailOtp/SendEmailOtp';
import SendPhoneOtp from './pages/SendPhoneOtp/SendPhoneOtp';
import Home from './pages/Home/Home';
import CreateJob from './pages/Admin/CreateJob/CreateJob';
import UpdateJob from './pages/Admin/UpdateJob/UpdateJob';
import { AuthVerifyEmail } from './components/authVerifyEmail/AuthVerifyEmail';
import { AuthRegister } from './components/AuthRegister/AuthRegister';
import { AuthAdmin } from './components/AuthAdmin/AuthAdmin';
import Login from './pages/Login/Login';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import JobDetails from './pages/JobDetails/JobDetails';
import UserDetails from './components/UserDetails/UserDetails';
import CreateBanner from './pages/Admin/CreateBanner/CreateBanner';




function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/create-banners' element={<CreateBanner />} />
        <Route exact path='/user-details/:id' element={<UserDetails />} />
        <Route exact path='/job-details/:id' element={<JobDetails />} />
        <Route exact path='/dashboard' element={<AuthAdmin>  <Dashboard /></AuthAdmin>} />
        <Route exact path='/update-job' element={<AuthAdmin> <UpdateJob /> </AuthAdmin> } />
        <Route exact path='/create-job' element={<AuthAdmin>  <CreateJob /> </AuthAdmin>} />
        <Route exact path='/verify-email' element={<AuthVerifyEmail> <VerifyEmail /> </AuthVerifyEmail>} />
        <Route exact path='/verify-phone' element={<VerifyPhone />} />
        <Route exact path='/register' element={<AuthRegister><Register /> </AuthRegister> } />
      </Routes>
    </>
  )
}

export default App
