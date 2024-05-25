import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import textThemeSlider from '../../assets/register_login.png';
import { AuthContext } from '../../Context/Auth.context.jsx';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup as a whole module
import axios from 'axios';

export default function Register() {
  // Use array destructuring to get the state variable and the function to update it
  let [errors, setErrors] = useState([]);
  let [statusError, setStatusError] = useState('');
  let navigate = useNavigate();

  // Define the validation schema using Yup
  const schema = Yup.object({
    userName: Yup.string().required("Name is required").min(3, "Minimum characters is 3").max(15, "Maximum characters is 15"),
    email: Yup.string().required("Email is required").email("Invalid email"),
    password: Yup.string().min(10, "Minimum characters is 10").max(15, "Maximum characters is 15").required("Password is required"),
    confirmPassword: Yup.string().min(10, "Minimum characters is 10").max(15, "Maximum characters is 15").oneOf([Yup.ref('password')], "Confirm password must match password").required("Confirm password is required"),
    address: Yup.string().min(10, "Minimum characters is 10").max(100, "Maximum characters is 100").required("Address is required"),
    phoneNumber: Yup.string().min(10, "Phone number can't be less than 10 characters").max(10, "Phone number can't be more than 10 characters").required("Phone number is required"),

  });
  const formik = useFormik({
    initialValues: {
      file: null,
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      address: ""
    },
    onSubmit: sendRegisterData,
    validationSchema: schema
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    formik.setFieldValue(name, files[0]);
  };

  async function sendRegisterData(values) {
    let formData = new FormData();
    formData.append('image', values.file); // Ensure the file is appended with the correct field name
    formData.append('userName', values.userName);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('confirmPassword', values.confirmPassword);
    formData.append('address', values.address);
    formData.append('phoneNumber', values.phoneNumber);

    
      let { data } = await axios.post('/auth/signUp', formData).catch((err)=>{
        setStatusError(err.response.data.message);
        console.error(err.response.data.message);
     })
      if (data.message === "success") {
        setStatusError('');
        setErrors([]);
        navigate('/Login');
      } else {
        setErrors(data.err[0]);
      }
       console.log(data)
    } 
  

  return (
    <>
      {/*== Start Account Area Wrapper ==*/}
      <section className="section-space container">
        <div className="container">
          <div className="row mb-n8" style={{ marginTop: '50px' }}>
            {/* Start Skin Elegance Section */}
            <div className="col-lg-6 mb-8 position-fixed" style={{ zIndex: '999' }}>
              <div className="hero-slide-content">
                <div className="hero-slide-text-img">
                  <img src={textThemeSlider} width={427} height={232} alt="Image" />
                </div>
                <h2 className="hero-slide-title">Skin elegance</h2>
                <p className="hero-slide-desc">Redefining Beauty Through Care Products</p>
                <Link className="btn btn-border-dark" to="Products">BUY NOW</Link>
              </div>
            </div>
            {/* End Skin Elegance Section */}

            <div className="col-lg-6 mb-8 offset-lg-6">
              {/*== Start Register Area Wrapper ==*/}
              <div className="my-account-item-wrap">
                <h3 className="title">Register</h3>
                <div className="my-account-form">
                  <form method="post" onSubmit={formik.handleSubmit}>
                    <div className="form-group mb-6">
                      <label htmlFor="register_username">User Name <sup>*</sup></label>
                      <input type="text" id="register_username" name="userName" value={formik.values.userName} onChange={formik.handleChange} />
                      {(statusError && statusError.includes('userName'))?<p className="alert alert-danger mt-2">{statusError}</p>:''}
                      {formik.errors.userName ? <p className="alert alert-danger mt-2">{formik.errors.userName}</p> : ""}
                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="register_email">Email Address <sup>*</sup></label>
                      <input type="email" id="register_email" name="email" value={formik.values.email} onChange={formik.handleChange} />
                      {(statusError && statusError.includes('email') )? <p className="alert alert-danger mt-2">{statusError}</p>:''}
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
                      <label htmlFor="register_address">Address <sup>*</sup></label>
                      <input type="text" id="register_address" name="address" value={formik.values.address} onChange={formik.handleChange} />
                      {formik.errors.address ? <p className="alert alert-danger mt-2">{formik.errors.address}</p> : ""}
                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="register_phone">Phone Number <sup>*</sup></label>
                      <input type="text" id="register_phone" name="phoneNumber" value={formik.values.phoneNumber} onChange={formik.handleChange} />
                      {formik.errors.phoneNumber ? <p className="alert alert-danger mt-2">{formik.errors.phoneNumber}</p> : ""}
                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="register_image">Image <sup>*</sup></label>
                      <input type="file" id="register_image" name="file" onChange={handleFileChange} />
                    </div>
                    {/* Your other form fields */}
                    <div className="form-group">
                      <p className="desc mb-4">Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.</p>
                      <button type="submit" className="btn">Register</button>
                    </div>
                    <Link className="lost-password text-capitalize" to={'/Login'}>Already have an account?</Link>
                  </form>
                </div>
              </div>
              {/*== End Register Area Wrapper ==*/}
            </div>
          </div>
        </div>
      </section>

      {/*== End Account Area Wrapper ==*/}
    </>
  );
}
