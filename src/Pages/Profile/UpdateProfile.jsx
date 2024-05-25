import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup as a whole module
import axios from 'axios';
import "./profile.css"
import Loading from '../../Components/Loading/Loading.jsx';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function UpdateProfile() {
  // Use array destructuring to get the state variable and the function to update it

  let [errors, setErrors] = useState([]);
  let [statusError, setStatusError] = useState('');
  let navigate = useNavigate();
  const location = useLocation()
  // Define the validation schema using Yup
  const schema = Yup.object({
    userName: Yup.string().min(3, "Minimum characters is 3").max(15, "Maximum characters is 15"),
    address: Yup.string().min(10, "Minimum characters is 10").max(100, "Maximum characters is 100"),
    phoneNumber: Yup.string().min(10, "Phone number can't be less than 10 characters").max(10, "Phone number can't be more than 10 characters"),
    file: Yup.mixed() // Accept any file type
  });

  const [user, setUser] = useState(null);

  const formik = useFormik({
    initialValues: {
      userName: '',
      address: '',
      phoneNumber: '',
      file: null // Initialize file as null
    },
    onSubmit: sendUpdateData,
    validationSchema: schema
  });

  async function sendUpdateData(values) {
    let formData = new FormData();
    if (values.file) {
      formData.append('image', values.file);
    }
    if (values.userName) {
      formData.append('userName', values.userName);
    }
    if (values.address) {
      formData.append('address', values.address);
    }
    if (values.phoneNumber) {
      formData.append('phoneNumber', values.phoneNumber);
    }


    const token = localStorage.getItem("adminToken");

    let { data } = await axios.patch('/user/update', formData, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
      setStatusError(err.response.data.message);
      console.error(err.response.data.message);
    })
    if (data.message === "success") {
      setStatusError('');
      setErrors([]);
      toast("Profile Updated successfully");
      getProfile()
    } else {
      setErrors(data.err[0]);
    }
    console.log(data)
  }

  async function getProfile() {
    const token = localStorage.getItem("adminToken");
    const { data } = await axios.get(`/user/profile`, { headers: { authorization: `Saja__${token}` } });
    setUser(data.user);

    // Update formik's initial values after getting user profile
    formik.setValues({
      userName: data.user.userName,
      address: data.user.address,
      phoneNumber: data.user.phoneNumber
    });
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    formik.setFieldValue(name, files[0]);
  };

  useEffect(() => {
    getProfile();
    console.log(user);
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>SkinElegance|{location.state.slug}-Update</title>
      </Helmet>
      <main className="main-content pb-10 container" style={{ height: '107vh', marginTop: '-50px' }}>
        {/*== Start Product Category Area Wrapper ==*/}
        {!user ? <Loading height={100} fontSize={70} />
          : <>  {/*== Start Page Header Area Wrapper ==*/}
            <section className="page-header-area pt-10 pb-10" data-bg-color="#FFF3DA">
              <div className="container">
                <div className="page-header-st3-content mt-10">
                  <h2 className="page-header-title mt-10">Update Profile</h2>
                </div>
              </div>
            </section>

            <div className="row">
              {/* left column */}
              <div className="col-md-3">
                <div className="text-center">
                  <img src={user.image.secure_url} className="avatar img-circle img-thumbnail" alt="avatar" />
                  <div className="form-group mb-3">
                    <input type="file" name="file" onChange={handleFileChange} className="form-control" id="register_image" />
                  </div>

                </div>
              </div>
              <div className="col-md-7 personal-info" style={{ marginLeft: "30px" }}>
                <div className="my-account-form">
                  <form method="post" onSubmit={formik.handleSubmit}>

                    <div className="form-group mb-6">
                      <label htmlFor="register_username">User Name </label>
                      <input
                        type="text"
                        id="register_username"
                        name="userName"
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                      />
                      {(statusError && statusError.includes('userName')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                      {formik.errors.userName ? <p className="alert alert-danger mt-2">{formik.errors.userName}</p> : ""}
                      {/* Error handling code */}
                    </div>



                    <div className="form-group mb-6">
                      <label htmlFor="register_address">Address </label>
                      <input
                        type="text"
                        id="register_address"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.address ? <p className="alert alert-danger mt-2">{formik.errors.address}</p> : ""}

                      {/* Error handling code */}
                    </div>



                    <div className="form-group mb-6">
                      <label htmlFor="register_phone">Phone Number</label>
                      <input
                        type="text"
                        id="register_phone"
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.phoneNumber ? <p className="alert alert-danger mt-2">{formik.errors.phoneNumber}</p> : ""}

                      {/* Error handling code */}
                    </div>


                    {/* Your other form fields */}
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary">Update</button>
                    </div>
                  </form>
                  <Link className="lost-password text-capitalize" state={{slug:user.slug}} to={'/UpdatePassword'}>you want to update Password?</Link>

                </div>
              </div>
            </div></>}
      </main>
    </>

  )
}
