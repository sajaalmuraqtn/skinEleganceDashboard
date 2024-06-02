import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/Auth.context.jsx';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup as a whole module
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function CreateAdvertisement() {
    let [statusError, setStatusError] = useState('');
    let navigate = useNavigate();

    const schema = Yup.object({
        name: Yup.string().required("Name is required").min(3, "Minimum characters is 3").max(50, "Maximum characters is 50"),
        facebookLink: Yup.string(),
        instagramLink: Yup.string(),
        description: Yup.string().required("Description is required").min(50, "Minimum characters is 50").max(150000, "Maximum characters is 150000"),
        phoneNumber: Yup.string().required("Phone number is required").min(10, "Phone number must be 10 characters").max(10, "Phone number must be 10 characters"),
        file: Yup.mixed().required("Image is required"),
        status: Yup.string().required("Status is required").oneOf(['Active', 'Inactive'], "Status must be 'Active' or 'Inactive"),
        expiredDate: Yup.date().required("Expired date is required").min(new Date(), "Expired date must be greater than or equal to today"),
        address: Yup.string().min(10, "Minimum characters is 10").max(100, "Maximum characters is 100").required("Address is required"),
        city: Yup.string().required("City is required").oneOf(['Hebron', 'Nablus', 'Jerusalem', 'Ramallah', 'Tulkarm', 'Jenin', 'Al-Bireh', 'Jericho', 'Yatta', 'Beit Jala'], "Invalid city")
    });


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
        onSubmit: sendAdvertisementData,
        validationSchema: schema
    });

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        formik.setFieldValue(name, files[0]);
    };

    async function sendAdvertisementData(values) {
        const formData = new FormData();
        formData.append('name', values.name);
        if(values.facebookLink){
            formData.append('facebookLink', values.facebookLink);
        }
        else{
            formData.append('facebookLink','-');
        }
        if(values.instagramLink){
            formData.append('instagramLink', values.instagramLink);
        }
        else{
            formData.append('instagramLink','-');
        }
      
        formData.append('description', values.description);
        formData.append('phoneNumber', values.phoneNumber);
        formData.append('mainImage', values.file);
        formData.append('status', values.status);
        formData.append('expiredDate', values.expiredDate);
        formData.append('address', values.address);
        formData.append('city', values.city);

        const token = localStorage.getItem("adminToken");

        try {
            const { data } = await axios.post('/advertisement', formData, { headers: { authorization: `Saja__${token}` } });
            if (data.message === "success") {
                setStatusError('');
                toast.success('Advertisement Created Successfully');
                navigate('/Advertisements');
            }
        } catch (error) {
            setStatusError(error.response.data.message);
        }
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>SkinElegance|Advertisements-Add</title>
            </Helmet>
            {/*== Start Account Area Wrapper ==*/}
            <section className="section-space container" style={{ marginTop: '-70px', marginBottom: "-50px" }}>
                <div className="container">

                    <div className="my-account-item-wrap mb-6">
                        <h3 className="title">Create Advertisement</h3>
                        <div className="my-account-form">
                            <form method="post" onSubmit={formik.handleSubmit}>
                                <div className="form-group mb-6">
                                    <label htmlFor="register_username">Name <sup>*</sup></label>
                                    <input type="text" id="register_username" name="name" value={formik.values.name} onChange={formik.handleChange} />
                                    {(statusError && statusError.includes('name')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                                    {formik.errors.name ? <p className="alert alert-danger mt-2">{formik.errors.name}</p> : ""}
                                </div>

                                <div className="form-group mb-6">
                                    <label htmlFor="register_image">Main Image <sup>*</sup></label>
                                    <input type="file" id="register_image" name="file" onChange={handleFileChange} />
                                    {formik.errors.file ? <p className="alert alert-danger mt-2">{formik.errors.file}</p> : ""}
                                </div>
                                <div className="form-group mb-6">
                                    <label htmlFor="product_description">Description <sup>*</sup></label>
                                    <textarea type="text" id="product_description" name="description" className='form-control' value={formik.values.description} onChange={formik.handleChange} />
                                    {formik.errors.description ? <p className="alert alert-danger mt-2">{formik.errors.description}</p> : ""}
                                </div>
                                <div className="form-group mb-6">
                                    <label htmlFor="register_status">Status <sup>*</sup></label>
                                    <select className="form-select" id="register_status" name="status" value={formik.values.status} onChange={formik.handleChange}>
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                    {formik.errors.status ? <p className="alert alert-danger mt-2">{formik.errors.status}</p> : ""}
                                </div>
                                <div className="form-group mb-6">
                                    <label htmlFor="order-city">Town / City <abbr className="required" title="required">*</abbr></label>
                                    <select id="order-city" name="city" value={formik.values.city} onChange={formik.handleChange} className="form-control wide">
                                        <option selected>Select City</option>
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
                                    <input type="text" id="street-address" name="address" className="form-control" value={formik.values.address} onChange={formik.handleChange} placeholder="center number and street name" />
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
                                <div className="form-group mt-5">
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
