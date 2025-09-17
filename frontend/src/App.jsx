import React from 'react'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Upload from './pages/Upload'


const App = () => {
  return (
    <div>
      <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/upload' element={<Upload />} />

      </Routes>
      </>
    </div>
  )
}

export default App
