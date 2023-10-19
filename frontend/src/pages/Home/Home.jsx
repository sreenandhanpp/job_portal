import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import HeroSection from '../../components/HeroSection/HeroSection'
import SearchBar from '../../components/SearchBar/SearchBar'
import Jobs from '../../components/Jobs/Jobs'
import Footer from '../../components/Footer/Footer'

const Home = () => {
  const [values,setValues] = useState([])
  return (
    <div>
      <Navbar />
      <HeroSection  />
      <SearchBar values={values} setValues={setValues} />
      <Jobs values={values}  setValues={setValues}/>
      <Footer />
    </div>
  )
}

export default Home
