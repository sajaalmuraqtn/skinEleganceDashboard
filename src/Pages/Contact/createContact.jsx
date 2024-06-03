import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup as a whole module
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function CreateContact() {
  // Use array destructuring to get the state variable and the function to update it
  let [errors, setErrors] = useState([]);
  let [statusError, setStatusError] = useState('');
  let navigate = useNavigate();

  // Define the validation schema using Yup
  const schema = Yup.object({
    email: Yup.string().required("Email is required").email("Invalid email"),
    phoneNumber: Yup.string().min(10, "Phone number can't be less than 10 characters").max(10, "Phone number can't be more than 10 characters").required("Phone number is required")
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      phoneNumber: ""
    },
    onSubmit: sendContactData,
    validationSchema: schema
  });

  async function sendContactData(values) {
    const token = localStorage.getItem("adminToken");
    try {
    let { data } = await axios.post('/contact/create', values, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
      setStatusError(err.response.data.message);
      console.error(err.response.data.message);
    })
    if (data.message === "success") {
      setStatusError('');
      setErrors([]);
      toast.success('Contact Created Successfully');
      navigate('/Contacts');
    } else {
      setErrors(data.err[0]);
    }
  } catch (error) {
  }
   }


  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>SkinElegance|Contacts-Add</title>
      </Helmet>
      {/*== Start Account Area Wrapper ==*/}
      <section className="section-space container" style={{ height: '106.5vh', marginTop: "-50px" }}>
        <div className="container">

          <div className="my-account-item-wrap mb-6">
            <h3 className="title">Create Contact</h3>
            <div className="my-account-form">
              <form method="post" onSubmit={formik.handleSubmit}>

                <div className="form-group mb-6">
                  <label htmlFor="register_email">Email Address <sup>*</sup></label>
                  <input type="email" id="register_email" name="email" value={formik.values.email} onChange={formik.handleChange} />
                  {(statusError && statusError.includes('email')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                  {formik.errors.email && <p className="alert alert-danger mt-2">{formik.errors.email}</p>}
                </div>

                <div className="form-group mb-6">
                  <label htmlFor="register_phone">Phone Number <sup>*</sup></label>
                  <input type="text" id="register_phone" name="phoneNumber" value={formik.values.phoneNumber} onChange={formik.handleChange} />
                  {(statusError && statusError.includes('Phone')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                  {formik.errors.phoneNumber ? <p className="alert alert-danger mt-2">{formik.errors.phoneNumber}</p> : ""}
                </div>
                <div className="form-group">
                  <button type="submit" className="btn">Create</button>
                </div>
              </form>
            </div>
          </div>
          {/*== End Register Area Wrapper ==*/}
        </div>

      </section>

      {/*== End Account Area Wrapper ==*/}
    </>
  );
}
