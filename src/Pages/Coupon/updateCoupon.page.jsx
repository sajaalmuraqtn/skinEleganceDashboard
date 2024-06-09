import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/Auth.context.jsx';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup as a whole module
import axios from 'axios';
import Loading from '../../Components/Loading/Loading.jsx';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function UpdateCoupon() {
  // Use array destructuring to get the state variable and the function to update it
  const { saveCurrentUser } = useContext(AuthContext);

  let [errors, setErrors] = useState([]);
  let [statusError, setStatusError] = useState('');

  const location = useLocation();
  // Define the validation schema using Yup
  const schema = Yup.object({
    name: Yup.string().min(3, "Minimum characters is 3").max(40, "Maximum characters is 40") ,
    amount: Yup.number().positive("Amount must be positive"),
    file: Yup.mixed(), // Accept any file type
    expiredDate: Yup.date().min(new Date(), "Expired date must be in the future"),
  });

  const [coupon, setCoupon] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      amount: '',
      file: null, // Initialize file as null
      expiredDate: '',
      couponId: ''
    },
    onSubmit: sendUpdateData,
    validationSchema: schema
  });

  async function sendUpdateData(values) {
    let formData = new FormData();
    if (values.file) {
      formData.append('image', values.file);
    }
    if (values.name) {
      formData.append('name', values.name);
    }
    if (values.amount) {
      formData.append('amount', values.amount);
    }
    if (values.expiredDate) {
      formData.append('expiredDate', values.expiredDate);
    }

    const token = localStorage.getItem("adminToken");
    try {
    let { data } = await axios.put(`/coupon/${location.state.couponId}`, formData, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
      setStatusError(err.response.data.message);
      console.error(err.response.data.message);
    })
    if (data.message === "success") {
      setStatusError('');
      setErrors([]);
      toast.success("Coupon Updated successfully");
      getCoupon()
    } else {
      setErrors(data.err[0]);
    }
  } catch (error) {
  }
   }

  async function getCoupon() {
    try {
    const token = localStorage.getItem("adminToken");
    const { data } = await axios.get(`/coupon/${location.state.couponId}`, { headers: { authorization: `Saja__${token}` } });
    setCoupon(data.coupon);

    // Update formik's initial values after getting coupon details
    formik.setValues({
      name: data.coupon.name,
      amount: data.coupon.amount,
      expiredDate: data.coupon.expiredDate
    });
  } catch (error) {
  }
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    formik.setFieldValue(name, files[0]);
  };

  useEffect(() => {
    getCoupon();
   }, []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>SkinElegance|Coupons-{location.state.slug}-Update</title>
      </Helmet>
      <main className="main-content pb-10 container" style={{ height: '110vh', marginTop: "-50px" }}>
        {/*== Start Product Category Area Wrapper ==*/}
        {!coupon ? <Loading height={100} fontSize={70} />
          : <>  {/*== Start Page Header Area Wrapper ==*/}
            <section className="page-header-area pt-10 pb-10" data-bg-color="#FFF3DA">
              <div className="container">
                <div className="page-header-st3-content mt-10">
                  <h2 className="page-header-title mt-10">Update Coupon</h2>
                </div>
              </div>
            </section>

            <div className="row">
              {/* left column */}
              <div className="col-md-3">
                <div className="text-center">
                  <img src={coupon.image.secure_url} className="avatar img-circle img-thumbnail" alt="avatar" />
                  <div className="form-group mb-3">
                    <input type="file" name="file" onChange={handleFileChange} className="form-control" id="register_image" />
                  </div>

                </div>
              </div>
              <div className="col-md-7 personal-info" style={{ marginLeft: "30px" }}>
                <div className="my-account-form">
                  <form method="post" onSubmit={formik.handleSubmit}>

                    <div className="form-group mb-6">
                      <label htmlFor="coupon_name">Coupon Name </label>
                      <input
                        type="text"
                        id="coupon_name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                      />
                      {(statusError && statusError.includes('name')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                      {formik.errors.name ? <p className="alert alert-danger mt-2">{formik.errors.name}</p> : ""}
                    </div>

                    <div className="form-group mb-6">
                      <label htmlFor="coupon_amount">Amount </label>
                      <input
                        type="text"
                        id="coupon_amount"
                        name="amount"
                        value={formik.values.amount}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.amount ? <p className="alert alert-danger mt-2">{formik.errors.amount}</p> : ""}
                    </div>

                    <div className="form-group mb-6">
                      <label htmlFor="coupon_expiredDate">Expired Date</label>
                      <input
                        type="date"
                        id="coupon_expiredDate"
                        name="expiredDate"
                        value={formik.values.expiredDate}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.expiredDate ? <p className="alert alert-danger mt-2">{formik.errors.expiredDate}</p> : ""}
                    </div>


                    {/* Your other form fields */}
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary">Update</button>
                    </div>
                  </form>
                </div>
              </div>
            </div></>}
      </main>
    </>

  )
}
