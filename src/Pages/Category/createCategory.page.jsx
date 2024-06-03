import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/Auth.context.jsx';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup as a whole module
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function CreateCategory() {
    // Use array destructuring to get the state variable and the function to update it
    let [errors, setErrors] = useState([]);
    let [statusError, setStatusError] = useState('');
    let navigate = useNavigate();

    // Define the validation schema using Yup
    const schema = Yup.object({
        name: Yup.string().required("Name is required").min(5, "Minimum characters is 5").max(30, "Maximum characters is 30"),
        file: Yup.mixed().required("image is required"),
        status: Yup.string().oneOf(['Active', 'Inactive'], "Status must be 'Active' or 'Inactive'"),
    });

    const formik = useFormik({
        initialValues: {
            file: null,
            name: "",
            status: ""
        },
        onSubmit: sendCategoryData,
        validationSchema: schema
    });

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        formik.setFieldValue(name, files[0]);
    };
    async function sendCategoryData(values) {
        let formData = new FormData();
        formData.append('image', values.file); // Ensure the file is appended with the correct field name
        formData.append('name', values.name);
        formData.append('status', values.status);

        const token = localStorage.getItem("adminToken");
        try {
        let { data } = await axios.post('/catagories/create', formData, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
            setStatusError(err.response.data.message);
            console.error(err.response.data.message);
        })
        if (data.message === "success") {
            setStatusError('');
            setErrors([]);
            toast.success('Category Created Successfully');
            navigate('/Categories');
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
                <title>SkinElegance|Categories-Add</title>
            </Helmet>
            {/*== Start Account Area Wrapper ==*/}
            <section className="section-space container">
                <div className="container">

                    <div className="my-account-item-wrap mb-6" style={{ marginTop: '-20px' }}>
                        <h3 className="title">Create Category</h3>
                        <div className="my-account-form">
                            <form method="post" onSubmit={formik.handleSubmit}>
                                <div className="form-group mb-6">
                                    <label htmlFor="register_username">Name <sup>*</sup></label>
                                    <input type="text" id="register_username" name="name" value={formik.values.name} onChange={formik.handleChange} />
                                    {(statusError && statusError.includes('name')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                                    {formik.errors.name ? <p className="alert alert-danger mt-2">{formik.errors.name}</p> : ""}
                                </div>

                                <div className="form-group mb-6">
                                    <label htmlFor="register_image">Image <sup>*</sup></label>
                                    <input type="file" id="register_image" name="file" onChange={handleFileChange} />
                                    {formik.errors.file ? <p className="alert alert-danger mt-2">{formik.errors.file}</p> : ""}
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
                                {/* Your other form fields */}
                                <div className="form-group">
                                    <p className="desc mb-4">Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.</p>
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
