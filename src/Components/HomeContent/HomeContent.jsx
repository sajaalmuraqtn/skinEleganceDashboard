import React from 'react'
import textThemeSlider from '../../assets/home.png'
import slider1 from '../../assets/images/slider/slider1.webp'
import { Link } from 'react-router-dom'
export default function HomeContent() {
  return (
    <>{/*== Start Hero Area Wrapper ==*/}
      <section className="hero-slider-area position-relative " style={{ height: '100vh', width: '800%' }}>
        <div className="swiper hero-slider-container">
          <div className="swiper-wrapper">
            <div className="swiper-slide hero-slide-item">
              <div className="container" style={{ marginTop: '-600px' }}>
                <div className="row align-items-center position-relative">
                  <div className="col-12 col-md-6 position-absolute">
                    <div className="hero-slide-content">
                      <div className="hero-slide-text-img" style={{ marginTop: '360px' }}>
                        <img src={textThemeSlider} width={480} alt="Image" />
                      </div>
                      <div className="hero-slide-action" >
                        <Link className="btn btn-border-dark" to="Products">DashBoard</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-5" style={{ backgroundColor: '#65edff' }}>
                    <div className="hero-slide-thumb">
                      <img src={slider1} width={841} height={832} alt="Image" />
                    </div>
                  </div>
                </div>

              </div>
              <div className="hero-slide-text-shape"><img src="assets/images/slider/text1.webp" width={70} height={955} alt="Image" /></div>
              <div className="hero-slide-social-shape" />
            </div>
            <div className="swiper-slide hero-slide-item">
              <div className="container">
                <div className="row align-items-center position-relative">
                  <div className="col-12 col-md-6">
                    <div className="hero-slide-content">
                      <div className="hero-slide-text-img"><img src="assets/images/slider/text-theme.webp" width={427} height={232} alt="Image" /></div>
                      <h2 className="hero-slide-title">Facial Cream</h2>
                      <p className="hero-slide-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis.</p>
                      <a className="btn btn-border-dark" href="product.html">BUY NOW</a>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="hero-slide-thumb">
                      <img src="assets/images/slider/slider2.webp" width={841} height={832} alt="Image" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="hero-slide-text-shape"><img src="assets/images/slider/text1.webp" width={70} height={955} alt="Image" /></div>
              <div className="hero-slide-social-shape" />
            </div>
          </div>
          {/*== Add Pagination ==*/}
          <div className="hero-slider-pagination" />
        </div>
        <div className="hero-slide-social-media">
          <a href="https://www.pinterest.com/" target="_blank" rel="noopener"><i className="fa fa-pinterest-p" /></a>
          <a href="https://twitter.com/" target="_blank" rel="noopener"><i className="fa fa-twitter" /></a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener"><i className="fa fa-facebook" /></a>
        </div>
      </section >
      {/*== End Hero Area Wrapper ==*/}</>
  )
}
