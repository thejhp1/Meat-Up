import React from 'react'
import "./Footer.css"
import redux from "../../images/redux.svg";
import sequelize from "../../images/sequelize-logo-black-and-white.png"
import express from "../../images/Expressjs.svg"

export default function Footer() {
  return (
    <div className="footer">
        <div className='footer_title'>
            <h5>Meatup. No Rights Reserved.</h5>
        </div>
        <div className='footer_inner'>
            <div className='about-developer'>
                <h3>About Developer: </h3>
                <i class="fa-brands fa-square-github fa-2xl"></i>
                <i class="fa-brands fa-linkedin fa-2xl"></i>
            </div>
            <div className='technologies-used'>
                <h3>Technologies Used: </h3>
                <i onClick={() => window.location.href="https://react.dev/"} class="fa-brands fa-react fa-2xl"></i>
                <img onClick={() => window.location.href="https://redux.js.org/"} alt="" src={redux} />
                <img onClick={() => window.location.href="https://sequelize.org/"} width="35px"  alt="" src={sequelize} />
                <img onClick={() => window.location.href="https://expressjs.com/"} width="80px"  alt="" src={express} />
            </div>
        </div>

    </div>
  )
}
