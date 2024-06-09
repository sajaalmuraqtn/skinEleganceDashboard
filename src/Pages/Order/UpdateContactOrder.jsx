import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import Loading from '../../Components/Loading/Loading.jsx';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function UpdateContactOrder() {
    let [errors, setErrors] = useState([]);
    let [statusError, setStatusError] = useState('');
    let location = useLocation();
    let navigate = useNavigate();
    const [contacts, setContacts] = useState([]);

    async function getOrder() {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.get(`/order/${location.state.orderId}`, { headers: { authorization: `Saja__${token}` } });
        setOrder(data.order);
         formik.setValues({
            contactId: data.order?.contact?._id || ''
        });
    }

    const getContacts = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const { data } = await axios.get(`/contact/getConfirmedContacts`, { headers: { authorization: `Saja__${token}` } });
            console.log(data);
            if (data.message === "success") {
                setContacts(data.contacts);
 
            }
        } catch (error) {
         }
    };
    const schema = Yup.object().shape({
        contactId: Yup.string().required("Contact is required")
    })

    const [order, setOrder] = useState(null);

    const formik = useFormik({
        initialValues: {
            contactId: ''
        },
        onSubmit: sendUpdateData,
        validationSchema: schema
    });

    async function sendUpdateData(values) {
        try {
            const token = localStorage.getItem("adminToken");

            let { data } = await axios.patch(`/order/addContact/${location.state.orderId}`, values, { headers: { authorization: `Saja__${token}` } });
            if (data.message === "success") {
                toast.success("Contact Added successfully");
                setStatusError('');
                setErrors([]);
                getOrder()
                navigate('/Orders')

            } else {
                setErrors(data.err[0]);
            }
        } catch (error) {
             setStatusError(error.response.data.message);
        }
    }

    useEffect(() => {
        getContacts();
        getOrder();
    }, []);
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>SkinElegance|Orders-Update-AddContact</title>
            </Helmet>
            <main className="main-content pb-10 container" style={{ marginTop: "-50px", height: '106.5vh' }}>
                {!order && contacts.length === 0 ? <Loading height={100} fontSize={70} /> :
                    <>
                        <section className="page-header-area pt-10 pb-10" data-bg-color="#FFF3DA">
                            <div className="container">
                                <div className="page-header-st3-content mt-10">
                                    <h2 className="page-header-title mt-10">Update Order Contact</h2>
                                </div>
                            </div>
                        </section>
                        <div className="row">

                            <div className="col-md-7 personal-info" style={{ marginLeft: "30px" }}>
                                <div className="my-account-form">
                                    <form method="post" onSubmit={formik.handleSubmit}>
                                        <div className="form-group mb-6">
                                            <label htmlFor="contactIdInput">Contact </label>
                                            <select id="contactIdInput" name="contactId" className="form-select" value={formik.values.contactId} onChange={formik.handleChange}>
                                                <option value={''}>Select Contact</option>
                                                {contacts.map((contact) =>
                                                (<option value={contact._id}>{contact.email} / {contact.phoneNumber}</option>
                                                ))
                                                }
                                            </select>
                                            {(statusError && statusError.includes('contact')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                                            {formik.touched.contactId && formik.errors.contactId ? <p className="alert alert-danger mt-2">{formik.errors.contactId}</p> : null}
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary">Update</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </main>
        </>
    );

}
