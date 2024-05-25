import React, { useContext, useState } from 'react'
import textThemeSlider from '../../assets/register_login.png'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup'; // Import Yup as a whole module
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function ForgotPassword({logo}) {
  let [errors, setErrors] = useState([]);
  let [statusError, setStatusError] = useState('');
  let navigate = useNavigate();

  let schema = Yup.object(
    {
      email: Yup.string().required("email is required").email("email invalid"),
    }
  )

  let formik = useFormik(
    {
      initialValues: {
        email: "",
      }, onSubmit: sendCode,
      validationSchema: schema
    });

  async function sendCode(values) {
    try {
      const response = await axios.patch('/auth/sendCode', values);
      const { data } = response;
      console.log(data.message);
      if (data.message === "success") {
        toast("code send check your email");
        navigate('/ResetPassword');
      } else {
        setErrors(data.err[0]);
      }
    } catch (err) {
      setStatusError(err.response.data.message);
    }
  }
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>SkinElegance|ForgotPassword</title>
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
            <div className="col-lg-6 mb-8" style={{ marginTop: '50px' }}>
              <div className="my-account-item-wrap">
                <h3 className="title">Forgot Password</h3>
                <div className="my-account-form">
                  <form method="post" onSubmit={formik.handleSubmit}>
                    <div className="form-group mb-6">
                      <label htmlFor="register_email">Email Address <sup>*</sup></label>
                      <input type="email" id="register_email" name="email" value={formik.values.email} onChange={formik.handleChange} />
                      {(statusError && statusError.includes('email')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                      {formik.errors.email && <p className="alert alert-danger mt-2">{formik.errors.email}</p>}
                    </div>

                    <div className="form-group d-flex align-items-center mb-14">
                      <button type='submit' className="btn" >Send Code</button>
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
