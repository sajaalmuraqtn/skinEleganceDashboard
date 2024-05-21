import React, { useContext, useEffect } from 'react'
 import { Link, useLocation } from 'react-router-dom'
import './navbar.css';

export default function Navbar({ logo}) {
 const location=useLocation();
 console.log(location.state);
  return (
    <>
      {/*== Start Header Wrapper ==*/}
      <header className="header-area sticky-header header-transparent">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-5 col-lg-2 col-xl-1">
              <div className="header-logo"> 
                <Link className="nav-link active " aria-current="page" to=""> <img className="logo-main" src={logo} width={95} height={68} alt="Logo" /></Link>
              </div>
            </div>

            <div className="col-lg-7 col-xl-7 d-none d-lg-block">
              
            </div>
            <div className="col-7 col-lg-3 col-xl-4">
              <div className="header-action justify-content-end">
            
                  <div className="header-action-btn-container">
                    <Link className="header-action-btn" to={'/Login'} style={{color: location.pathname === '/Login' ? '#ff6565':''}}>
                      <span className="icon">
                        <svg width={30} height={30} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                          <rect className="icon-rect" width={30} height={30} fill="url(#pattern3)" />
                          <defs>
                            <pattern id="pattern3" patternContentUnits="objectBoundingBox" width={1} height={1}>
                              <use xlinkHref="#image0_504:10" transform="scale(0.0333333)" />
                            </pattern>
                            <image id="image0_504:10" width={30} height={30} xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAABEUlEQVRIie3UMUoDYRDF8Z8psqUpLBRrBS+gx7ATD6E5iSjeQQ/gJUzEwmChnZZaKZiQ0ljsLkhQM5/5Agr74DX7DfOfgZ1Hoz+qAl30Marcx2H1thCtY4DJN76parKqmAH9DM+6eTcArX2QE3yVAO7lBA8TwMNIw6UgeJI46My+rWCjUQL0LVIUBd8lgEO1UfBZAvg8oXamCuWNRu64nRNMmUo/wReSXLXayoDoKc9miMvqW/ZNG2VRNLla2MYudrCFTvX2intlnl/gGu/zDraGYzyLZ/UTjrD6G2AHpxgnAKc9xgmWo9BNPM4BnPYDNiLg24zQ2oNpyFdZvRKZLlGhnvvKPzXXti/Yy7hEo3+iD9EHtgdqxQnwAAAAAElFTkSuQmCC" />
                          </defs>
                        </svg>
                      </span>
                      Login
                    </Link>
                  </div>
                  {/* <div className="header-action-btn-container">
                    <Link className="header-action-btn t" to={'/Register'} style={{color: location.pathname === '/Register' ? '#ff6565':''}}>
                      <span className="icon">
                        <svg width={30} height={30} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                          <rect className="icon-rect" width={30} height={30} fill="url(#pattern3)" />
                          <defs>
                            <pattern id="pattern3" patternContentUnits="objectBoundingBox" width={1} height={1}>
                              <use xlinkHref="#image0_504:10" transform="scale(0.0333333)" />
                            </pattern>
                            <image id="image0_504:10" width={30} height={30} xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAABEUlEQVRIie3UMUoDYRDF8Z8psqUpLBRrBS+gx7ATD6E5iSjeQQ/gJUzEwmChnZZaKZiQ0ljsLkhQM5/5Agr74DX7DfOfgZ1Hoz+qAl30Marcx2H1thCtY4DJN76parKqmAH9DM+6eTcArX2QE3yVAO7lBA8TwMNIw6UgeJI46My+rWCjUQL0LVIUBd8lgEO1UfBZAvg8oXamCuWNRu64nRNMmUo/wReSXLXayoDoKc9miMvqW/ZNG2VRNLla2MYudrCFTvX2intlnl/gGu/zDraGYzyLZ/UTjrD6G2AHpxgnAKc9xgmWo9BNPM4BnPYDNiLg24zQ2oNpyFdZvRKZLlGhnvvKPzXXti/Yy7hEo3+iD9EHtgdqxQnwAAAAAElFTkSuQmCC" />
                          </defs>
                        </svg>
                      </span>
                      Register
                    </Link>
                  </div> */}
                <button className="header-menu-btn d-block d-lg-none header-action-btn-container" type="button" data-bs-toggle="offcanvas" data-bs-target="#AsideOffcanvasMenu" aria-controls="AsideOffcanvasMenu">
                  <span />
                  <span />
                  <span />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>

  )
}
