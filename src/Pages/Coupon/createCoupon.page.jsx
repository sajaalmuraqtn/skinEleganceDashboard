import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import textThemeSlider from '../../assets/images/slider/text-theme.webp';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup as a whole module
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function CreateCoupon() {
    let [errors, setErrors] = useState([]);
    let [statusError, setStatusError] = useState('');
    let navigate = useNavigate();

    const schema = Yup.object({
        name: Yup.string().required("Name is required").min(3, "Minimum characters is 3").max(40, "Maximum characters is 40"),
        amount: Yup.number().positive("Amount must be positive").required("Amount is required"),
        file: Yup.mixed().required("image is required"),
        expiredDate: Yup.date().min(new Date(), "Expired date must be greater than today").required("Expired date is required"),
    });

    const formik = useFormik({
        initialValues: {
            file: null,
            name: "",
            amount: "",
            expiredDate: "",
        },
        onSubmit: sendCouponData,
        validationSchema: schema
    });

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        formik.setFieldValue(name, files[0]);
    };

    async function sendCouponData(values) {
        let formData = new FormData();
        formData.append('image', values.file);
        formData.append('name', values.name);
        formData.append('amount', values.amount);
        formData.append('expiredDate', values.expiredDate);

        const token = localStorage.getItem("adminToken");

        try {
            let { data } = await axios.post('/coupon/create', formData, { headers: { authorization: `Saja__${token}` } });
            if (data.message === "success") {
                setStatusError('');
                setErrors([]);
                toast.success('Coupon Created Successfully');
                navigate('/Coupons');
            } else {
                setErrors(data.err[0]);
            }
            console.log(data);
        } catch (error) {
            setStatusError(error.response.data.message);
            console.error(error.response.data.message);
        }
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>SkinElegance|Coupons-Add</title>
            </Helmet>
            <section className="section-space container">
                <div className="container">
                    <div className="my-account-item-wrap mb-6">
                        <h3 className="title">Create Coupon</h3>
                        <div className="my-account-form">
                            <form method="post" onSubmit={formik.handleSubmit}>
                                <div className="form-group mb-6">
                                    <label htmlFor="register_name">Name <sup>*</sup></label>
                                    <input type="text" id="register_name" name="name" value={formik.values.name} onChange={formik.handleChange} />
                                    {(statusError && statusError.includes('name')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                                    {formik.errors.name ? <p className="alert alert-danger mt-2">{formik.errors.name}</p> : ""}
                                </div>

                                <div className="form-group mb-6">
                                    <label htmlFor="register_amount">Amount <sup>*</sup></label>
                                    <input type="number" id="register_amount" name="amount" value={formik.values.amount} onChange={formik.handleChange} />
                                    {formik.errors.amount ? <p className="alert alert-danger mt-2">{formik.errors.amount}</p> : ""}
                                </div>

                                <div className="form-group mb-6">
                                    <label htmlFor="register_expired_date">Expired Date <sup>*</sup></label>
                                    <input type="date" id="register_expired_date" name="expiredDate" value={formik.values.expiredDate} onChange={formik.handleChange} />
                                    {formik.touched.expiredDate && formik.errors.expiredDate ? <p className="alert alert-danger mt-2">{formik.errors.expiredDate}</p> : ""}
                                </div>

                                <div className="form-group mb-6">
                                    <label htmlFor="register_image">Image <sup>*</sup></label>
                                    <input type="file" id="register_image" name="file" onChange={handleFileChange} />
                                    {formik.touched.file && formik.errors.file ? <p className="alert alert-danger mt-2">{formik.errors.file}</p> : ""}
                                </div>

                                <div className="form-group">
                                    <p className="desc mb-4">Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.</p>
                                    <button type="submit" className="btn">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
