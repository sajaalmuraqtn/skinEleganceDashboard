import React from 'react'
 export default function Footer({logo}) {
  return (
    < >  {/*== Start Footer Area Wrapper ==*/}
<footer className="footer-area mt-5">
  {/*== Start Footer Main ==*/}
  <div className="footer-main">
    <div className="container">
      <div className="row">
        <div className="col-md-6 col-lg-4">
          <div className="widget-item">
            <div className="widget-about">
              <a className="widget-logo" href="index.html">
                 <img  src={logo} width={95} height={68} alt="Logo" />
              </a>
              <p className="desc">Redefining Beauty Through Care Products</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-5 mt-md-0 mt-9">
          <div className="widget-item">
            <h4 className="widget-title">Information</h4>
            <ul className="widget-nav">
              <li><a href="blog.html">Blog</a></li>
              <li><a href="about-us.html">About us</a></li>
              <li><a href="contact.html">Contact</a></li>
              <li><a href="faq.html">Privacy</a></li>
              <li><a href="account-login.html">Login</a></li>
              <li><a href="product.html">Shop</a></li>
              <li><a href="my-account.html">My Account</a></li>
              <li><a href="faq.html">FAQs</a></li>
            </ul>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mt-lg-0 mt-6">
          <div className="widget-item">
            <h4 className="widget-title">Social Info</h4>
            <div className="widget-social">
              <a href="https://twitter.com/" target="_blank" rel="noopener"><i className="fa fa-twitter" /></a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener"><i className="fa fa-facebook" /></a>
              <a href="https://www.pinterest.com/" target="_blank" rel="noopener"><i className="fa fa-pinterest-p" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
   
</footer>
 </ >
  )
}
