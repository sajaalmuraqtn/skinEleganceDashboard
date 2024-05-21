import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import Loading from '../../Components/Loading/Loading.jsx';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { Helmet } from 'react-helmet';

export default function UpdateAdvertisement({ logo }) {
  let [errors, setErrors] = useState([]);
  let [statusError, setStatusError] = useState('');
  let navigate = useNavigate();
  let location = useLocation();

  const schema = Yup.object({
    name: Yup.string().min(3, "Minimum characters is 3").max(50, "Maximum characters is 50"),
    facebookLink: Yup.string(),
    instagramLink: Yup.string(),
    description: Yup.string().min(50, "Minimum characters is 50").max(150000, "Maximum characters is 150000"),
    phoneNumber: Yup.string().min(10).max(10),
    file: Yup.mixed(), // Accept any file type
    status: Yup.string().oneOf(['Active', 'Inactive']),
    expiredDate: Yup.date().min(new Date(), 'Expired date must be in the future'),
    address: Yup.string().min(10).max(100),
    city: Yup.string().oneOf(['Hebron', 'Nablus', 'Jerusalem', 'Ramallah', 'Tulkarm', 'Jenin', 'Al-Bireh', 'Jericho', 'Yatta', 'Beit Jala'])
  });

  const [advertisement, setAdvertisement] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      facebookLink: '',
      instagramLink: '',
      description: '',
      phoneNumber: '',
      file: null,
      status: '',
      expiredDate: '',
      address: '',
      city: ''
    },
    onSubmit: sendUpdateData,
    validationSchema: schema
  });

  async function sendUpdateData(values) {
    try {
      let formData = new FormData();
      if (values.file) {
        formData.append('mainImage', values.file);
      }
      if (values.name) {
        formData.append('name', values.name);
      }
      if (values.facebookLink) {
        formData.append('facebookLink', values.facebookLink);
      }
      if (values.instagramLink) {
        formData.append('instagramLink', values.instagramLink);
      }
      if (values.description) {
        formData.append('description', values.description);
      }
      if (values.phoneNumber) {
        formData.append('phoneNumber', values.phoneNumber);
      }
      if (values.status) {
        formData.append('status', values.status);
      }
      if (values.expiredDate) {
        formData.append('expiredDate', values.expiredDate);
      }
      if (values.address) {
        formData.append('address', values.address);
      }
      if (values.city) {
        formData.append('city', values.city);
      }

      const token = localStorage.getItem("adminToken");
      const { data } = await axios.put(`/advertisement/${location.state.advertisementId}`, formData, { headers: { authorization: `Saja__${token}` } });

      if (data.message === "success") {
        setStatusError('');
        setErrors([]);
        toast.success("Advertisement Updated successfully");
        getAdvertisement();
      } else {
        setErrors(data.err[0]);
      }
    } catch (error) {
      console.error(error);
      setStatusError(error.response.data.message);
    }
  }

  async function getAdvertisement() {
    const token = localStorage.getItem("adminToken");
    const { data } = await axios.get(`/advertisement/${location.state.advertisementId}`, { headers: { authorization: `Saja__${token}` } });
    setAdvertisement(data.advertisement);
    // Update formik's initial values after getting advertisement details
    formik.setValues({
      name: data.advertisement.name,
      facebookLink: data.advertisement.facebookLink,
      instagramLink: data.advertisement.instagramLink,
      description: data.advertisement.description,
      phoneNumber: data.advertisement.phoneNumber,
      status: data.advertisement.status,
      expiredDate: data.advertisement.expiredDate,
      address: data.advertisement.address,
      city: data.advertisement.city
    });
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    formik.setFieldValue(name, files[0]);
  };

  useEffect(() => {
    getAdvertisement();
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>SkinElegance|Advertisements-{location.state.slug}-Update</title>
        <meta property="og:image" content={`${logo}`} />
      </Helmet>
      <main className="main-content pb-10 container" style={{ marginTop: '-50px' }}>
        {!advertisement ? <Loading height={100} fontSize={70} /> : <>
          <section className="page-header-area pt-10 pb-10" data-bg-color="#FFF3DA">
            <div className="container">
              <div className="page-header-st3-content mt-10">
                <h2 className="page-header-title mt-10">Update Advertisement</h2>
              </div>
            </div>
          </section>

          <div className="row">
            <div className="col-md-3">
              <div className="text-center">
                <img src={advertisement.mainImage.secure_url} className="avatar img-circle img-thumbnail" alt="avatar" />
                <div className="form-group mb-3">
                  <input type="file" name="file" onChange={handleFileChange} className="form-control" id="advertisement_image" />
                </div>
              </div>
            </div>
            <div className="col-md-7 personal-info" style={{ marginLeft: "30px" }}>
              <div className="my-account-form">
                <form method="post" onSubmit={formik.handleSubmit}>
                  <div className="form-group mb-6">
                    <label htmlFor="advertisement_name">Advertisement Name </label>
                    <input type="text" id="advertisement_name" name="name" value={formik.values.name} onChange={formik.handleChange} />
                    {(statusError && statusError.includes('name')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                    {formik.errors.name ? <p className="alert alert-danger mt-2">{formik.errors.name}</p> : ""}
                  </div>
                  <div className="form-group mb-6">
                    <label htmlFor="product_description">Description <sup>*</sup></label>
                    <textarea type="text" id="product_description" name="description" className='form-control' value={formik.values.description} onChange={formik.handleChange} />
                    {formik.errors.description ? <p className="alert alert-danger mt-2">{formik.errors.description}</p> : ""}
                  </div>
                  <div className="form-group mb-6">
                    <label htmlFor="advertisement_status">Status </label>
                    <select id="advertisement_status" name="status" className="form-select" value={formik.values.status} onChange={formik.handleChange}>
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    {formik.errors.status ? <p className="alert alert-danger mt-2">{formik.errors.status}</p> : ""}
                  </div>

                  <div className="form-group mb-6">
                    <label htmlFor="order-city">Town / City <abbr className="required" title="required">*</abbr></label>
                    <select id="order-city" name="city" value={formik.values.city} onChange={formik.handleChange} className="form-control wide">
                      <option value={"Hebron"}>Hebron</option>
                      <option value={"Nablus"}>Nablus</option>
                      <option value={"Jerusalem"}>Jerusalem</option>
                      <option value={"Ramallah"}>Ramallah</option>
                      <option value={"Tulkarm"}>Tulkarm</option>
                      <option value={"Jenin"}>Jenin</option>
                      <option value={"Al-Bireh"}>Al-Bireh</option>
                      <option value={"Jericho"}>Jericho</option>
                      <option value={"Yatta"}>Yatta</option>
                      <option value={"Beit Jala"}>Beit Jala</option>
                    </select>
                    {formik.errors.city ? <p className="alert alert-danger mt-2">{formik.errors.city}</p> : ""}
                  </div>
                  <div className="form-group mb-6">
                    <label htmlFor="street-address">Street address<abbr className="required" title="required">*</abbr></label>
                    <input type="text" id="street-address" name="address" className="form-control" value={formik.values.address} onChange={formik.handleChange} placeholder="House number and street name" />
                    {formik.errors.address ? <p className="alert alert-danger mt-2">{formik.errors.address}</p> : ""}
                  </div>

                  <div className="form-group mb-6">
                    <label htmlFor="order-phone">Phone Number</label>
                    <input type="text" id="order-phone" name="phoneNumber" value={formik.values.phoneNumber} onChange={formik.handleChange} className="form-control" />
                    {formik.errors.phoneNumber ? <p className="alert alert-danger mt-2">{formik.errors.phoneNumber}</p> : ""}
                  </div>
                  <div className="form-group mb-6">
                    <label htmlFor="register_expired_date">Expired Date <sup>*</sup></label>
                    <input type="date" id="register_expired_date" name="expiredDate" value={formik.values.expiredDate} onChange={formik.handleChange} />
                    {formik.touched.expiredDate && formik.errors.expiredDate ? <p className="alert alert-danger mt-2">{formik.errors.expiredDate}</p> : ""}
                  </div>
                  <div className="form-group mb-6">
                    <label htmlFor="Adv-facebookLink">Facebook Link (optional)</label>
                    <input type="text" id="Adv-facebookLink" name="facebookLink" value={formik.values.facebookLink} onChange={formik.handleChange} className="form-control" />
                    {formik.errors.facebookLink ? <p className="alert alert-danger mt-2">{formik.errors.facebookLink}</p> : ""}
                  </div>
                  <div className="form-group mb-6">
                    <label htmlFor="Adv-instagramLink">Instagram Link (optional)</label>
                    <input type="text" id="Adv-instagramLink" name="instagramLink" value={formik.values.instagramLink} onChange={formik.handleChange} className="form-control" />
                    {formik.errors.instagramLink ? <p className="alert alert-danger mt-2">{formik.errors.instagramLink}</p> : ""}
                  </div>


                  {/* Your other form fields */}
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary">Update</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>}
      </main>
    </>
  );
}
