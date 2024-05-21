import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup'; // Import Yup as a whole module
import { GlobalFunctionContext } from '../../Context/globalFunctionsContext.jsx';
import Loading from '../../Components/Loading/Loading.jsx';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function ProductDetails({ logo }) {

    const [product, setProduct] = useState(null);
    const { isCreatedThisMonth, selectRandomColor } = useContext(GlobalFunctionContext); // Access the context
    const [statusError, setStatusError] = useState(null);
    let navigate = useNavigate()
    let location = useLocation()

    const getProduct = async (productId) => {
        try {
            const { data } = await axios.get(`/products/${productId}`);
            console.log(data);
            if (data.message === "success") {
                setProduct(data.product);
            }
        } catch (error) {
            console.log(error);
        }
    };

    async function addToArchive(productId) {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.put(`/products/softDelete/${productId}`, null, { headers: { authorization: `Saja__${token}` } });
        if (data.message === 'success') {
            toast.success('Product Archived Successfully')
            getProduct();
        } else {
            return toast.error('Error While Archived');
        }
    }

    async function restoreProduct(productId) {
        const token = localStorage.getItem("adminToken");
        try {
            const { data } = await axios.put(`/products/restore/${productId}`, null, { headers: { authorization: `Saja__${token}` } });
            if (data && data.message === 'success') {
                toast.success('Product Restored Successfully');
                getProduct();
            }
        } catch (error) {
            // Handle axios request error
            return toast.error('Category not Available');
        }
    }


    async function deleteProduct(productId) {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.delete(`/products/hardDelete/${productId}`, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
            return toast.error('Error While Archived');
        });
        if (data.message === 'success') {
            toast.success('Product Deleted Successfully')
            navigate('/Products');
        }
    }

    useEffect(() => {
        getProduct(location.state.productId);

    }
        , []);

    return (
        <> {/*== Start Product Details Area Wrapper ==*/}
            <Helmet>
                <meta charSet="utf-8" />
                <title>SkinElegance|Products-{location.state.slug}</title>
                <meta property="og:image" content={`${logo}`} />
            </Helmet>
            < section className="app-container section-space" style={{ height: !product ? '125vh' : '', marginTop: "-50px", marginBottom: '-140px' }} >
                {!product ? (
                    <Loading margin={190} width={1555} fontSize={70} />
                ) : <>    <div className="container">

                    <div className="row product-details">
                        <div className="col-lg-6">
                            <div className="product-details-thumb">
                                <img src={product.mainImage.secure_url} width={500} height={603} alt="Image" />
                                {isCreatedThisMonth(product.createdAt) && (<span className="flag-new" style={{ backgroundColor: 'red' }}>new</span>)}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="product-details-content">
                                <h5 className="product-details-collection text-capitalize">{product?.categoryName}</h5>
                                <h3 className="product-details-title text-capitalize">{product.name}</h3>
                                <div className="product-details-review">
                                    <div className="product-review-icon">
                                        <i className="fa fa-star-o" />
                                        <i className="fa fa-star-o" />
                                        <i className="fa fa-star-o" />
                                        <i className="fa fa-star-o" />
                                        <i className="fa fa-star-half-o" />
                                    </div>
                                    <button type="button" className="product-review-show">{product.reviews.length} reviews</button>
                                </div>
                                <div className="product-details-qty-list">
                                    <div className="qty-list-check">
                                        <label className="form-check-label" htmlFor="qtyList1"><span className="cell-label">Is Deleted:</span>
                                            <span className={!product.isDeleted ? "status active fs-5" : "status disabled fs-5"}>{product.isDeleted ? 'true' : 'false'}</span></label>
                                    </div>
                                    <div className="qty-list-check">
                                        <label className="form-check-label" htmlFor="qtyList1"><span className="cell-label">Status:</span>
                                            <span className={product.status === "Active" ? "status active fs-5" : "status disabled fs-5"}>{product.status}</span></label>
                                    </div>
                                    {!product.isDeleted ? <button type="button" className="btn bg-danger bg-gradient" style={{ marginLeft: '10px' }} onClick={() => addToArchive(product._id)} >Archive </button>
                                        : <div className='mt-3 row'>
                                            <button type="button" className="btn bg-success bg-gradient col-md-5" style={{ marginLeft: '10px' }} onClick={() => restoreProduct(product._id)} >Restore </button>
                                            <button type="button" className="btn bg-danger bg-gradient col-md-5" style={{ marginLeft: '10px' }} onClick={() => deleteProduct(product._id)} >Delete</button>
                                        </div>}
                                </div>

                                <div className="product-details-action">
                                    <ul className="product-details-info-wrap">
                                        <li><span>Size</span>
                                            <p>{product.size == 'OneSize' ? product.size : `${product.size} ml bottol`} </p>
                                        </li>
                                        <li><span>Final Price</span>
                                            <p>₪{product.finalPrice}</p>
                                        </li>
                                        <li><span>Discount</span>
                                            <p>%{product.discount}</p>
                                        </li>
                                        <li><span>Price</span>
                                            <p>₪{product.price}</p>
                                        </li>
                                        <li><span>Number Sellers</span>
                                            <p>{product.number_sellers}</p>
                                        </li>
                                        <li><span>Stock</span>
                                            <p>{product.stock}</p>
                                        </li>
                                    </ul>
                                </div>

                                <Link className="btn bg-info" to={`/Products/Update/${product.slug}`} state={{ productId: product._id }}>Update <i className="fa-solid fa-gear"></i></Link>

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-7">
                                <div className="nav product-details-nav" id="product-details-nav-tab" role="tablist">
                                    <button className="nav-link" id="specification-tab" data-bs-toggle="tab" data-bs-target="#specification" type="button" role="tab" aria-controls="specification" aria-selected="false">Specification</button>
                                    <button className="nav-link active" id="review-tab" data-bs-toggle="tab" data-bs-target="#review" type="button" role="tab" aria-controls="review" aria-selected="true">Review</button>
                                </div>
                                <div className="tab-content" id="product-details-nav-tabContent">
                                    <div className="tab-pane" id="specification" role="tabpanel" aria-labelledby="specification-tab">
                                        <ul className="product-details-info-wrap">
                                            <li><span>Expired Date:</span>
                                                <p> {product.expiredDate.split('T')[0]}</p>
                                            </li>

                                            <li><span>Created At:</span>
                                                <p> {product.createdAt.split('T')[0]}</p>
                                            </li>
                                            <li><span>Created By:</span>
                                                <p>{product.createdByUser.userName}</p>
                                            </li>
                                            <li><span>Last Updated By:</span>
                                                <p>{product.updatedByUser.userName}</p>
                                            </li>
                                            <li><span>Description:</span>
                                                <p>{product.description}</p>
                                            </li>

                                        </ul>
                                    </div>
                                    <div className="tab-pane fade show active" id="review" role="tabpanel" aria-labelledby="review-tab">
                                        {/*== Start Reviews Content Item ==*/}
                                        {
                                            product.reviews.length == 0 ?
                                                <h4>There is no review yet</h4> :
                                                product.reviews.map((review) => (

                                                    <div className="product-review-item" key={review._id}>
                                                        <div className="product-review-top">
                                                            <div className="product-review-thumb">
                                                                <img src={review.createdByUser.image.secure_url} width={90} alt="Images" />
                                                            </div>
                                                            <div className="product-review-content">
                                                                <span className="product-review-name fs-6">{review.createdByUser.userName}</span>
                                                                <div className="product-review-icon">
                                                                    {review.rating}
                                                                    {Array(review.rating).fill().map((_, index) => (
                                                                        <i key={index} className="fa fa-star" />
                                                                    ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="desc fs-4">{review.comment}</p>
                                                    </div>))}
                                        {/*== End Reviews Content Item ==*/}

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                </>}
            </section>
            {/*== End Product Details Area Wrapper ==*/}
        </>

    )
}
