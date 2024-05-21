import React, { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import textThemeSlider from '../../assets/images/slider/text-theme.webp';
import { AuthContext } from '../../Context/Auth.context.jsx';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup as a whole module
import axios from 'axios';
import { Helmet } from 'react-helmet';
export default function Login({ logo }) {

  // Use array destructuring to get the state variable and the function to update it
  let [errors, setErrors] = useState([]);
  let [statusError, setStatusError] = useState('');
  let navigate = useNavigate();
  const { getProfile, user } = useContext(AuthContext);

  let schema = Yup.object(
    {
      email: Yup.string().required("email is required").email("email invalid"),
      password: Yup.string().min(10, "minimum characters is 10").max(15, "maximum characters is 15")
    }
  )

  let formik = useFormik(
    {
      initialValues: {
        email: "",
        password: ""
      }, onSubmit: sendLoginData,
      validationSchema: schema
    });

  async function sendLoginData(values) {
    try {
      const response = await axios.post('/auth/adminSignIn', values);
      const { data } = response;
      console.log(data.message);
      if (data.message === "success") {
        localStorage.setItem('adminToken', data.token);
        getProfile();
        navigate('/');
        console.log(user);
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
        <title>SkinElegance|Login</title>
        <meta property="og:image" content={`${logo}`} />
      </Helmet>
      <section className="section-space container" style={{ height: '100vh' }}>
        <div className="container">
          <div className="row mb-n8" style={{ marginTop: '50px' }}>
            {/* Start Skin Elegance Section */}
            <div className="col-lg-6 mb-8">
              <div className="hero-slide-content">
                <div className="hero-slide-text-img"><img src={textThemeSlider} width={427} height={232} alt="Image" /></div>
                <h2 className="hero-slide-title">Skin elegance</h2>
                <p className="hero-slide-desc">Redefining Beauty Through Care Products</p>
                <p className="btn btn-border-dark">DashBoard</p>
              </div>
            </div>
            {/* End Skin Elegance Section */}

            {/* Start Login Section */}
            <div className="col-lg-6 mb-8">
              <div className="my-account-item-wrap">
                <h3 className="title">Login</h3>
                <div className="my-account-form">
                  <form method="post" onSubmit={formik.handleSubmit}>
                    <div className="form-group mb-6">
                      <label htmlFor="register_email">Email Address <sup>*</sup></label>
                      <input type="email" id="register_email" name="email" value={formik.values.email} onChange={formik.handleChange} />
                      {(statusError && statusError.includes('email')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                      {formik.errors.email && <p className="alert alert-danger mt-2">{formik.errors.email}</p>}
                    </div>

                    <div className="form-group mb-6">
                      <label htmlFor="register_password">Password <sup>*</sup></label>
                      <input type="password" id="register_password" name="password" value={formik.values.password} onChange={formik.handleChange} />
                      {formik.errors.password ? <p className="alert alert-danger mt-2">{formik.errors.password}</p> : ""}
                    </div>
                    {(statusError && !statusError.includes('email')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}

                    <div className="form-group d-flex align-items-center mb-14">
                      <button type="submit" className="btn">Login</button>
                    </div>
                  </form>
                  <Link className="lost-password col-md-12" to={'/ForgotPassword'}>Lost your Password?</Link>
                  <Link className="lost-password text-capitalize" to={'/Register'}>you do not have account?</Link>
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
