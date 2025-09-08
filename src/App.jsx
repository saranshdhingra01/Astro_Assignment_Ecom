import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import LoginSignup from './Pages/LoginSignup'
import ProductsPage from './Pages/ProductPage'
import Cart from './Pages/Cart'

const App = () => {
  return (
    <div>
     <Navbar/>
     <LoginSignup/>
     <ProductsPage/>
     <Cart/>
  
    </div>
  )
}

export default App
