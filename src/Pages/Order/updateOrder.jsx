import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import Loading from '../../Components/Loading/Loading.jsx';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function UpdateOrder() {
    let [errors, setErrors] = useState([]);
    let [statusError, setStatusError] = useState('');
    let location = useLocation();
    let navigate = useNavigate();

    const schema = Yup.object().shape({
        status: Yup.string().oneOf(['onWay', 'delivered'], "Status must be 'onWay' or 'delivered'")
    })

    const [order, setOrder] = useState(null);

    const formik = useFormik({
        initialValues: {
            status: ""
        },
        onSubmit: sendUpdateData,
        validationSchema: schema
    });

    async function sendUpdateData(values) {
        try {
            const token = localStorage.getItem("adminToken");

            let { data } = await axios.put(`/order/updateStatusOrder/${location.state.orderId}`, values, { headers: { authorization: `Saja__${token}` } });
            if (data.message === "success") {
                setStatusError('');
                setErrors([]);
                toast.success("Order Updated successfully");
                getOrder();
                navigate('/')
            } else {
                setErrors(data.err[0]);
            }
        } catch (error) {
            console.error(error);
            setStatusError(error.response.data.message);
        }
    }

    async function getOrder() {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.get(`/order/${location.state.orderId}`, { headers: { authorization: `Saja__${token}` } });
        setOrder(data.order);
        console.log(data.order)
        formik.setValues({
            status: data.order.status
        });
    }

    useEffect(() => {
        getOrder();
    }, []);
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>SkinElegance|Orders-Update</title>
            </Helmet>
            <main className="main-content pb-10 container" style={{ marginTop: "-50px", height: '106.5vh' }}>
                {!order ? <Loading height={100} fontSize={70} /> :
                    <>
                        <section className="page-header-area pt-10 pb-10" data-bg-color="#FFF3DA">
                            <div className="container">
                                <div className="page-header-st3-content mt-10">
                                    <h2 className="page-header-title mt-10">Update Order</h2>
                                </div>
                            </div>
                        </section>
                        <div className="row">

                            <div className="col-md-7 personal-info" style={{ marginLeft: "30px" }}>
                                <div className="my-account-form">
                                    <form method="post" onSubmit={formik.handleSubmit}>
                                        <div className="form-group mb-6">
                                            <label htmlFor="statusInput">Status </label>
                                            <select id="statusInput" name="status" className="form-select" value={formik.values.status} onChange={formik.handleChange}>
                                                <option >Select Status</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="onWay">On Way</option>
                                            </select>
                                            {(statusError && statusError.includes('status')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                                            {formik.touched.status && formik.errors.status ? <p className="alert alert-danger mt-2">{formik.errors.status}</p> : null}
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
