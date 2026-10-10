import React from 'react'
import HeroSection from '../components/HeroSection'
import FeatureSection from '../components/FeatureSection'
import MovieCard from '../components/MovieCard'
import TrailerSection from '../components/TrailerSection'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <HeroSection/>
      <FeatureSection/>
      <MovieCard/>
      <TrailerSection/>
      <Footer/>
    </div>
  )
}

export default Home
