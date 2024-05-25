import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import textThemeSlider from '../../assets/images/slider/text-theme.webp';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Loading from '../../Components/Loading/Loading.jsx';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function CreateProduct() {
    const [errors, setErrors] = useState([]);
    const [statusError, setStatusError] = useState('');
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const getCategory = async () => {
        try {
            let url = `/catagories/active`;
            const { data } = await axios.get(url);
            if (data.message === "success") {
                setCategories(data.activeCatagories);
            }
        } catch (error) {
            console.log(error);
        }
    };
    // Define the validation schema using Yup
    const schema = Yup.object().shape({
        name: Yup.string().required("Name is required").min(3, "Minimum characters is 3").max(50, "Maximum characters is 50"),
        description: Yup.string().required("Description is required").min(2, "Minimum characters is 2").max(150000, "Maximum characters is 150000"),
        stock: Yup.number().required("Stock is required").positive("Stock must be a positive number").integer("Stock must be an integer"),
        price: Yup.number().required("Price is required").positive("Price must be a positive number"),
        size: Yup.number().positive("Size must be a positive number"),
        discount: Yup.number().positive("Discount must be a positive number").min(1, "Minimum discount is 1"),
        status: Yup.string().required("Status is required").oneOf(['Active', 'Inactive'], "Status must be 'Active' or 'Inactive"),
        categoryId: Yup.string().required("Category ID is required").min(24, "Category ID must be 24 characters").max(24, "Category ID must be 24 characters"),
        expiredDate: Yup.date().required("Expired date is required").min(new Date(), "Expired date must be in the future"),
        mainImage: Yup.mixed().required("Main image is required"), // Change to mixed type
    });


    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            stock: "",
            price: "",
            size: "",
            discount: "",
            status: "",
            categoryId: "",
            expiredDate: "",
            mainImage: null
        },
        onSubmit: sendProductData,
        validationSchema: schema,
    });
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        formik.setFieldValue(name, files[0]);
    };
    async function sendProductData(values) {
        console.log(values);
        const token = localStorage.getItem("adminToken");
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('stock', values.stock);
        formData.append('status', values.status);
        if (values.size) {
            formData.append('size', values.size);
        }
        formData.append('discount', values.discount);
        formData.append('categoryId', values.categoryId);
        formData.append('expiredDate', values.expiredDate);
        formData.append('mainImage', values.mainImage); // Access mainImage directly

        try {
            const { data } = await axios.post('/products', formData, { headers: { authorization: `Saja__${token}` } });
            if (data.message === "success") {
                setStatusError('');
                setErrors([]);
                toast.success('Product Created Successfully');
                navigate('/Products');
            } else {
                setErrors(data.err[0]);
            }
        } catch (error) {
            setStatusError(error.response.data.message);
            console.error(error.response.data.message);
        }
    }

    useEffect(() => {
        getCategory();
    }, [])

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>SkinElegance|Products-Add</title>
            </Helmet>
            <section className="section-space container" style={{ marginTop: '-50px' }}>
                {!categories.length === 0 ? (
                    <Loading margin={150} height={100} fontSize={70} />
                ) : <>       <div className="container">
                    <div className="my-account-item-wrap mb-6">
                        <h3 className="title">Create Product</h3>
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
                                    <label htmlFor="product_stock">Stock <sup>*</sup></label>
                                    <input type="text" id="product_stock" name="stock" value={formik.values.stock} onChange={formik.handleChange} />
                                    {formik.errors.stock ? <p className="alert alert-danger mt-2">{formik.errors.stock}</p> : ""}
                                </div>
                                <div className="form-group mb-6">
                                    <label htmlFor="product_price">Price <sup>*</sup></label>
                                    <input type="text" id="product_price" name="price" value={formik.values.price} onChange={formik.handleChange} />
                                    {formik.errors.price ? <p className="alert alert-danger mt-2">{formik.errors.price}</p> : ""}
                                </div>
                                <div className="form-group mb-6">
                                    <label htmlFor="product_size">Size <sup>*</sup></label>
                                    <input type="text" id="product_size" name="size" value={formik.values.size} onChange={formik.handleChange} />
                                    {formik.errors.size ? <p className="alert alert-danger mt-2">{formik.errors.size}</p> : ""}
                                </div>
                                <div className="form-group mb-6">
                                    <label htmlFor="product_discount">Discount <sup>*</sup></label>
                                    <input type="text" id="product_discount" name="discount" value={formik.values.discount} onChange={formik.handleChange} />
                                    {formik.errors.discount ? <p className="alert alert-danger mt-2">{formik.errors.discount}</p> : ""}
                                </div>
                                <div className="form-group mb-6">
                                    <label htmlFor="register_expired_date">Expired Date <sup>*</sup></label>
                                    <input type="date" id="register_expired_date" name="expiredDate" value={formik.values.expiredDate} onChange={formik.handleChange} />
                                    {formik.errors.expiredDate ? <p className="alert alert-danger mt-2">{formik.errors.expiredDate}</p> : ""}
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
                                <div className="form-group mb-6">
                                    <label htmlFor="register_expired_date">Category Name <sup>*</sup></label>
                                    <select className="form-select" name='categoryId' value={formik.values.categoryId} onChange={formik.handleChange} aria-label="Default select example">
                                        <option >Open menu and select Category</option>

                                        {categories.map((category) => {
                                            return <option value={category._id} key={category._id}>{category.name}</option>
                                        }
                                        )
                                        }
                                    </select>

                                </div>

                                <div className="form-group">
                                    <p className="desc mb-4">Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.</p>
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
