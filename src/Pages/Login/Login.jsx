import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import textThemeSlider from '../../assets/register_login.png';
import { AuthContext } from '../../Context/Auth.context.jsx';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup as a whole module
import axios from 'axios';
import { Helmet } from 'react-helmet';
export default function Login() {

  // Use array destructuring to get the state variable and the function to update it
  let [errors, setErrors] = useState([]);
  let [statusError, setStatusError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { getProfile, user } = useContext(AuthContext);

  let schema = Yup.object(
    {
      email: Yup.string().required("email is required").email("email invalid"),
      password: Yup.string().required("password is required")
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
      if (data.message === "success") {
        localStorage.setItem('adminToken', data.token);
        getProfile();
        navigate('/');
      } else {
        setErrors(data.err[0]);
      }
    } catch (err) {
      setStatusError(err.response.data.message);
    }
  }
  useEffect(() => {
    if (localStorage.getItem("adminToken") &&( location.pathname === '/Login'||location.pathname === '/login')) {
      navigate('/');
    }
  }, []);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>SkinElegance|Login</title>
      </Helmet>
      <section className="section-space container" style={{ height: '100vh' }}>
        <div className="container">
          <div className="row mb-n8" style={{ marginTop: '50px' }}>
            {/* Start Skin Elegance Section */}
            <div className="col-lg-6 mb-8">
              <div className="hero-slide-content">
                <div className="hero-slide-text-img" style={{ marginTop: '-60px' }}>
                  <Link to="/Products"><img src={textThemeSlider} width={480} alt="Image" /></Link>
                </div>
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
