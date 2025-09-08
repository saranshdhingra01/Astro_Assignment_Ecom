import React,{useState} from 'react'
import './Navbar.css'

import logo from '../../assets/logo.png'


const Navbar = () => {    
const [menu,setMenu]=useState("shop");

  return (
    <div className='navbar'>

      <div className="nav-logo">
        <img src={logo} alt=""/>
      </div>

        <ul className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          Shop
          {menu === "shop" && <hr />}
        </li>
        <li onClick={() => setMenu("mens")}>
         Men
          {menu === "mens" && <hr />}
        </li>
        <li onClick={() => setMenu("womens")}>
          Women
          {menu === "womens" && <hr />}
        </li>
        <li onClick={() => setMenu("kids")}>
          Kids
          {menu === "kids" && <hr />}
        </li>
      </ul>

      <div className="nav-login-cart">
       <button>Login/Sign-up</button>
       </div>
    </div>
  )
}

export default Navbar