import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import textThemeSlider from '../../assets/register_login.png'
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup as a whole module
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
export default function ResetPassword() {

  // Use array destructuring to get the state variable and the function to update it
  let [errors, setErrors] = useState([]);
  let [statusError, setStatusError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  let schema = Yup.object(
    {
      code: Yup.string().required("Code is required"),
      email: Yup.string().required("Email is required").email("Invalid email"),
      password: Yup.string().min(10, "Minimum characters is 10").max(15, "Maximum characters is 15").required("Password is required"),
      confirmPassword: Yup.string().min(10, "Minimum characters is 10").max(15, "Maximum characters is 15").oneOf([Yup.ref('password')], "Confirm password must match password").required("Confirm password is required"),
    }
  )

  let formik = useFormik(
    {
      initialValues: {
        email: "",
        password: "",
        confirmPassword: "",
        code: ""
      }, onSubmit: sendResetPasswordData,
      validationSchema: schema
    });

  async function sendResetPasswordData(values) {
    try {
      const response = await axios.patch('/auth/forgotPassword', values);
      const { data } = response;
      if (data.message === "success") {
        toast("Password Reset successfully");
        navigate('/Login');
      } else {
        setErrors(data.err[0]);
      }
    } catch (err) {
      setStatusError(err.response.data.message);
    }
  }
  useEffect(() => {
    if (localStorage.getItem("adminToken") &&( location.pathname === '/ResetPassword'||location.pathname === '/resetpassword')) {
      navigate('/');
    }
  }, []);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>SkinElegance|ResetPassword</title>
      </Helmet>
      <section className="section-space w-100" style={{marginBottom: '-80px'  }} >
        <div className="container">
          <div className="row mb-n8" style={{ marginTop: '50px',marginBottom: '-200px'  }}>
            {/* Start Skin Elegance Section */}
            <div className="col-12 col-md-6">
              <div className="hero-slide-text-img" style={{ marginTop: '-60px' }}>
                <Link to="/"><img src={textThemeSlider} width={480} alt="Image" /></Link>
              </div>
            </div>
            {/* End Skin Elegance Section */}

            {/* Start Login Section */}
            <div className="col-lg-6 mb-8" style={{ marginTop: '-80px'}}>
              <div className="my-account-item-wrap">
                <h3 className="title fs-1">Reset Password</h3>
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
                    <div className="form-group mb-6">
                      <label htmlFor="confirm_password">Confirm Password <sup>*</sup></label>
                      <input type="password" id="confirm_password" name="confirmPassword" value={formik.values.confirmPassword} onChange={formik.handleChange} />
                      {formik.errors.confirmPassword ? <p className="alert alert-danger mt-2">{formik.errors.confirmPassword}</p> : ""}
                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="register_Code">Code <sup>*</sup></label>
                      <input type="text" id="register_Code" name="code" value={formik.values.code} onChange={formik.handleChange} />
                      {formik.errors.code ? <p className="alert alert-danger mt-2">{formik.errors.code}</p> : ""}
                    </div>

                    <div className="form-group d-flex align-items-center mb-14">
                      <button type="submit" className="btn">Reset</button>
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
