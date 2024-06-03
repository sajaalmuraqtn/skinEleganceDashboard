import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import Loading from '../../Components/Loading/Loading.jsx';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function CancelOrder() {
    const [order, setOrder] = useState(null);
    const location = useLocation();
    let [statusError, setStatusError] = useState('');

    useEffect(() => {
        getOrder();
    }, []);

    const getOrder = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`/order/${location.state.orderId}`, { headers: { authorization: `Saja__${token}` } });
             if (data.message === "success") {
                setOrder(data.order);
            }
        } catch (error) {
             setStatusError(error.response.data.message)
        }
    };

    const schema = Yup.object().shape({
        reasonRejected: Yup.string().required("Reason Rejected is required").min(50, "Minimum characters is 50").max(200, "Maximum characters is 200"),
    });

    const CancelOrder = async (values) => {
        const token = localStorage.getItem('adminToken');
        const { data } = await axios.patch(`/order/cancel/${location.state.orderId}`, values, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
            setStatusError(err.response.data.message);
        });
         if (data.message === "success") {
            setOrder(data.order);
            getOrder();
            toast.success('Order Canceled successfully')
        }

    };

    const formik = useFormik({
        initialValues: {
            reasonRejected: ''
        },
        onSubmit: CancelOrder,
        validationSchema: schema
    });

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>SkinElegance|Orders-CancelOrder</title>
            </Helmet>
            <main className="main-content pb-10 container" style={{ marginTop: "-50px", height: '106.5vh' }}>
                {!order ? <Loading height={100} fontSize={70} /> :
                    <>
                        <section className="page-header-area pt-10 pb-10" data-bg-color="#FFF3DA">
                            <div className="container">
                                <div className="page-header-st3-content mt-10">
                                    <h2 className="page-header-title mt-10">Cancel Order</h2>
                                </div>
                            </div>
                        </section>
                        <div className="row">
                            <div className="col-md-7 personal-info" style={{ marginLeft: "30px" }}>
                                <div className="my-account-form">
                                    <form method="post" onSubmit={formik.handleSubmit}>
                                        <div className="form-group mb-6">
                                            <label htmlFor="reasonRejected">Reason Rejected</label>
                                            <textarea type="text" id="reasonRejected" name="reasonRejected" className='form-control' style={{ height: "200px" }} value={formik.values.reasonRejected} onChange={formik.handleChange} />
                                            {(statusError && statusError.includes('cancel')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}

                                            {formik.touched.reasonRejected && formik.errors.reasonRejected ? <p className="alert alert-danger mt-2">{formik.errors.reasonRejected}</p> : null}
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
