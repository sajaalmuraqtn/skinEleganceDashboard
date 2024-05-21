import React, { useContext, useEffect, useState } from 'react'
import "../Profile/profile.css"
import Loading from '../../Components/Loading/Loading.jsx';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GlobalFunctionContext } from '../../Context/globalFunctionsContext.jsx';
import { Helmet } from 'react-helmet';
export default function CouponDetails({logo}) {
    const [coupon, setCoupon] = useState(null);
    const { isCreatedThisMonth } = useContext(GlobalFunctionContext); // Access the context
    const location = useLocation();
    let navigate=useNavigate();
    async function getCoupon() {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.get(`/coupon/${location.state.couponId}`, { headers: { authorization: `Saja__${token}` } });
        setCoupon(data.coupon);
    }
    async function addToArchive(couponId) {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.patch(`/coupon/softDelete/${couponId}`,null, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
            toast.error('Error While Archived');
            console.log(err);
        });
        if (data.message === 'success') {
            toast.success('Coupon Archived Successfully')
            getCoupon();
        }
    }
    async function restoreCoupon(couponId) {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.patch(`/coupon/restore/${couponId}`,null, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
            toast.error('Error While restoring');
            console.log(err);
        });
        if (data.message === 'success') {
            toast.success('Coupon Restored Successfully')
            getCoupon();
        }
    }
    async function deleteCategory(couponId) {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.delete(`/coupon/hardDelete/${couponId}`, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
            toast.error('Error While Archived');
            console.log(err);
        });
        if (data.message === 'success') {
            toast.success('Coupon Deleted Successfully')
            navigate('/Coupons');
        }
    }
    useEffect(() => {
        getCoupon();
    }, [])
    return (
        <> {/*== Start Product Details Area Wrapper ==*/}
            <Helmet>
                <meta charSet="utf-8" />
                <title>SkinElegance|Coupons-{location.state.slug}</title>
                <meta property="og:image" content={`${logo}`} />
            </Helmet>
            < section className="app-container section-space" style={{marginTop:"-20px",marginBottom:'-140px'}} >
                <div className="container">
                 {!coupon ? (
                        <Loading margin={200} height={120} fontSize={70} />
                    ) : <>
                        <div className="row product-details">
                            <div className="col-lg-5">
                                <div className="product-details-thumb">
                                    <img src={coupon.image.secure_url} width={440} height={553} alt="Image" />
                                    {isCreatedThisMonth(coupon.createdAt) && (<span className="flag-new " style={{backgroundColor:'red'}}>new</span>)}

                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="product-details-content">
                                    <h3 className="product-details-title text-capitalize">{coupon.name}</h3>
                                    <div className="product-details-review">

                                        <button type="button" className="product-review-show fs-4">{coupon.email} </button>
                                    </div>
                                    <div className="product-details-qty-list">
                                        <div className="qty-list-check">
                                            <label className="form-check-label" htmlFor="qtyList1"><span className="cell-label">Is Deleted:</span>
                                                <span className={!coupon.isDeleted ? "status active fs-5" : "status disabled fs-5"}>{coupon.isDeleted ? 'true' : 'false'}</span></label>
                                        </div>
                                        {!coupon.isDeleted ? <button type="button" className="btn bg-danger bg-gradient" style={{ marginLeft: '10px' }} onClick={() => addToArchive(coupon._id)} >Archive </button>
                                        : <div className='mt-3 row'>
                                            <button type="button" className="btn bg-success bg-gradient col-md-4" style={{ marginLeft: '10px' }} onClick={() => restoreCoupon(coupon._id)} >Restore </button>
                                            <button type="button" className="btn bg-danger bg-gradient col-md-4" style={{ marginLeft: '10px' }} onClick={() => deleteCategory(coupon._id)} >Delete</button>
                                        </div>}
                                    </div>

                                    <div className="product-details-action">
                                        <ul className="product-details-info-wrap">
                                            <li><span>Used By</span>
                                                <p>{coupon.usedBy.length}</p>
                                            </li>
                                            <li><span>Amount</span>
                                                <p>%{coupon.amount}</p>
                                            </li>
                                            <li><span>Expired Date</span>
                                                <p>{coupon.expiredDate.split('T')[0]}</p>
                                            </li>
                                            <li><span>Created By</span>
                                                <p>{coupon.createdByUser.userName}</p>
                                            </li>
                                            <li><span>Updated By</span>
                                                <p>{coupon.createdByUser.userName}</p>
                                            </li>
                                        </ul>
                                    </div>
                                    <Link className="btn bg-info" to={`/Coupons/Update/${coupon.slug}`} state={{ couponId: coupon._id,slug:coupon.slug  }} >Update <i className="fa-solid fa-gear"></i></Link>
                                   
                                </div>
                            </div>

                        </div>

                    </>}
                </div>
            </section >
            {/*== End Product Details Area Wrapper ==*/}
        </>
    )
}
