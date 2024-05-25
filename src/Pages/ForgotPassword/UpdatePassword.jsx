import React, { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import textThemeSlider from '../../assets/register_login.png'
import { AuthContext } from '../../Context/Auth.context.jsx';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup as a whole module
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
export default function UpdatePassword({logo}) {

  // Use array destructuring to get the state variable and the function to update it
  let [errors, setErrors] = useState([]);
  let [statusError, setStatusError] = useState('');
  let navigate = useNavigate();
  const { getProfile, user, setUser } = useContext(AuthContext);

  let schema = Yup.object(
    {
      lastPassword: Yup.string().min(10, "Minimum characters is 10").max(15, "Maximum characters is 15").required("Last Password is required"),
      newPassword: Yup.string().min(10, "Minimum characters is 10").max(15, "Maximum characters is 15").required("New Password is required"),
      confirmPassword: Yup.string().min(10, "Minimum characters is 10").max(15, "Maximum characters is 15").oneOf([Yup.ref('newPassword')], "Confirm password must match password").required("Confirm password is required"),
    }
  )

  let formik = useFormik(
    {
      initialValues: {
        lastPassword: "",
        newPassword: "",
        confirmPassword: "",
      }, onSubmit: sendChangePasswordData,
      validationSchema: schema
    });

  async function sendChangePasswordData(values) {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.patch('/auth/changePassword', values, { headers: { authorization: `Saja__${token}` } });
      const { data } = response;
      console.log(data.message);
      if (data.message === "success") {
        setUser(null);
        localStorage.removeItem("userToken");
        toast("Password Changed successfully");
        await getProfile();
        navigate('/login');
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
        <title>SkinElegance|UpdatePassword</title>
        <meta property="og:image" content={`${logo}`} />
      </Helmet>
      <section className="section-space" >
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
            <div className="col-lg-6 mb-8">
              <div className="my-account-item-wrap">
                <h3 className="title fs-1">Change Password</h3>
                <div className="my-account-form">
                  <form method="post" onSubmit={formik.handleSubmit}>
                    <div className="form-group mb-6">
                      <label htmlFor="lastPassword">Last Password <sup>*</sup></label>
                      <input type="password" id="lastPassword" name="lastPassword" value={formik.values.lastPassword} onChange={formik.handleChange} />
                      {(statusError && statusError.includes('lastPassword')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                      {formik.errors.lastPassword && <p className="alert alert-danger mt-2">{formik.errors.lastPassword}</p>}
                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="newPassword">New Password <sup>*</sup></label>
                      <input type="password" id="newPassword" name="newPassword" value={formik.values.newPassword} onChange={formik.handleChange} />
                      {formik.errors.newPassword ? <p className="alert alert-danger mt-2">{formik.errors.newPassword}</p> : ""}
                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="confirm_password">Confirm Password <sup>*</sup></label>
                      <input type="password" id="confirm_password" name="confirmPassword" value={formik.values.confirmPassword} onChange={formik.handleChange} />
                      {formik.errors.confirmPassword ? <p className="alert alert-danger mt-2">{formik.errors.confirmPassword}</p> : ""}
                    </div>

                    <div className="form-group d-flex align-items-center mb-14">
                      <button type="submit" className="btn">Change Password</button>
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
