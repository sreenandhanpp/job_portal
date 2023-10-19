import React, { useState } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import HeroSection from '../../../components/HeroSection/HeroSection'
import SearchBar from '../../../components/SearchBar/SearchBar'
import AdminJobs from '../../../components/AdminJobs/AdminJobs'
import Footer from '../../../components/Footer/Footer'

const Dashboard = () => {
  const [values, setValues] = useState([])
  return (
    <div>
      <Navbar />
      <HeroSection />
      <SearchBar values={values} setValues={setValues} />
      <AdminJobs values={values} setValues={setValues} />
      <Footer />
    </div>
  )
}

export default Dashboard
