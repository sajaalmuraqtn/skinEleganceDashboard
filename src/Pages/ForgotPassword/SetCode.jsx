import React from 'react'
import textThemeSlider from '../../assets/register_login.png'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
export default function SetCode({logo}) {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>SkinElegance|ForgotPassword-SetCode</title>
        <meta property="og:image" content={`${logo}`} />
      </Helmet>
      <section className="section-space" style={{ height: '100vh' }}>
        <div className="container">
          <div className="row mb-n8" style={{ marginTop: '50px' }}>
            {/* Start Skin Elegance Section */}
            <div className="col-12 col-md-6">
              <div className="hero-slide-text-img" style={{ marginTop: '-60px' }}>
                <Link to="/"><img src={textThemeSlider} width={480} alt="Image" /></Link>
              </div>
            </div>
            {/* End Skin Elegance Section */}

            {/* Start Login Section */}
            <div className="col-lg-6 mb-8" style={{ marginTop: '20px' }}>
              <div className="my-account-item-wrap">
                <h3 className="title">Set Code</h3>
                <div className="my-account-form">
                  <form action="#" method="post">
                    <div className="form-group mb-6">
                      <label htmlFor="code">Code<sup>*</sup></label>
                      <input type="text" id="code" />
                    </div>

                    <div className="form-group d-flex align-items-center mb-14">
                      <a className="btn" href="my-account.html">Set</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* End Login Section */}
          </div>

        </div>
      </section>

    </>
  )
}
