import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Loading from '../../Components/Loading/Loading.jsx';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function CreateProduct({ logo }) {
    const [errors, setErrors] = useState([]);
    const [statusError, setStatusError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [advertisement, setAdvertisement] = useState(null);
    async function getAdvertisement() {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.get(`/advertisement/${location.state.advertisementId}`, {}, { headers: { authorization: `Saja__${token}` } });
        setAdvertisement(data.advertisement);
    }

    // Define the validation schema using Yup
    const schema = Yup.object().shape({
        name: Yup.string().required("Name is required").min(3, "Minimum characters is 3").max(50, "Maximum characters is 50"),
        description: Yup.string().required("Description is required").min(2, "Minimum characters is 2").max(150000, "Maximum characters is 150000"),
        price: Yup.number().required("Price is required").positive("Price must be a positive number"),
        discount: Yup.number().positive("Discount must be a positive number").min(1, "Minimum discount is 1"),
        status: Yup.string().required("Status is required").oneOf(['Active', 'Inactive'], "Status must be 'Active' or 'Inactive"),
        mainImage: Yup.mixed().required("Main image is required"), // Change to mixed type
    });


    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            price: "",
            discount: "",
            status: "",
            mainImage: null
        },
        onSubmit: sendServiceData,
        validationSchema: schema,
    });
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        formik.setFieldValue(name, files[0]);
    };
    async function sendServiceData(values) {
        const token = localStorage.getItem("adminToken");
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('status', values.status);
        formData.append('discount', values.discount);
        formData.append('mainImage', values.mainImage);

        try {
            const { data } = await axios.post(`/advertisement/${location.state.advertisementId}/services`, formData, { headers: { authorization: `Saja__${token}` } });
            if (data.message === "success") {
                setStatusError('');
                setErrors([]);
                toast.success('Service Created Successfully');
                navigate('/Advertisements')
            } else {
                setErrors(data.err[0]);
            }
        } catch (error) {
            setStatusError(error.response.data.message);
        }
    }

    useEffect(() => {
        getAdvertisement();
    }, [])

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>SkinElegance|Advertisements-{location.state.slug}-AddService</title>
                <meta property="og:image" content={`${logo}`} />
            </Helmet>
            <section className="section-space container" style={{ marginTop: '-40px' }}>
                {!advertisement ? (
                    <Loading margin={150} height={100} fontSize={70} />
                ) : <>       <div className="container">
                    <div className="my-account-item-wrap mb-6">
                        <h3 className="title">Create Service in <span className='text-capitalize'>' {advertisement.name} '</span> Advertisement</h3>
                        <div className="my-account-form">
                            <form method="post" onSubmit={formik.handleSubmit}>
                                <div className="form-group mb-6">
                                    <label htmlFor="register_image">Main Image <sup>*</sup></label>
                                    <input type="file" id="register_image" name="mainImage" onChange={handleFileChange} />
                                    {formik.errors.mainImage ? <p className="alert alert-danger mt-2">{formik.errors.mainImage}</p> : ""}
                                </div>
                                <div className="form-group mb-6">
                                    <label htmlFor="product_name">Name <sup>*</sup></label>
                                    <input type="text" id="product_name" name="name" value={formik.values.name} onChange={formik.handleChange} />
                                    {(statusError && statusError.includes('name')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                                    {formik.errors.name ? <p className="alert alert-danger mt-2">{formik.errors.name}</p> : ""}
                                </div>
                                <div className="form-group mb-6">
                                    <label htmlFor="product_description">Description <sup>*</sup></label>
                                    <textarea type="text" id="product_description" name="description" className='form-control' value={formik.values.description} onChange={formik.handleChange} />
                                    {formik.errors.description ? <p className="alert alert-danger mt-2">{formik.errors.description}</p> : ""}
                                </div>

                                <div className="form-group mb-6">
                                    <label htmlFor="product_price">Price <sup>*</sup></label>
                                    <input type="text" id="product_price" name="price" value={formik.values.price} onChange={formik.handleChange} />
                                    {formik.errors.price ? <p className="alert alert-danger mt-2">{formik.errors.price}</p> : ""}
                                </div>

                                <div className="form-group mb-6">
                                    <label htmlFor="product_discount">Discount <sup>*</sup></label>
                                    <input type="text" id="product_discount" name="discount" value={formik.values.discount} onChange={formik.handleChange} />
                                    {formik.errors.discount ? <p className="alert alert-danger mt-2">{formik.errors.discount}</p> : ""}
                                </div>

                                <div className="form-group mb-6">
                                    <label htmlFor="register_status">Status <sup>*</sup></label>
                                    <select id="register_status" className="form-select" name="status" value={formik.values.status} onChange={formik.handleChange}>
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                    {formik.errors.status ? <p className="alert alert-danger mt-2">{formik.errors.status}</p> : ""}
                                </div>

                                <div className="form-group">
                                    <button type="submit" className="btn">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div></>}
            </section>
        </>
    );
}
