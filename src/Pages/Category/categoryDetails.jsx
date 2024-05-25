import React, { useContext, useEffect, useState } from 'react'
import "../Profile/profile.css"
import Loading from '../../Components/Loading/Loading.jsx';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GlobalFunctionContext } from '../../Context/globalFunctionsContext.jsx';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
export default function CategoryDetails() {
    const [category, setCategory] = useState(null);
    const location = useLocation();
    let navigate = useNavigate();
    const { isCreatedThisMonth, selectRandomColor } = useContext(GlobalFunctionContext); // Access the context

    async function getCategory() {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.get(`/catagories/${location.state.categoryId}`, {}, { headers: { authorization: `Saja__${token}` } });
        setCategory(data.category);
    }

    async function addToArchive(categoryId) {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.put(`/catagories/softDelete/${categoryId}`, null, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
            toast.error('Error While Archived');
            console.log(err);
        });
        if (data.message === 'success') {
            toast.success('Category Archived Successfully')
            getCategory();
        }
    }
    async function restoreCategory(categoryId) {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.put(`/catagories/restore/${categoryId}`, null, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
            toast.error('Error While restoring');
            console.log(err);
        });
        if (data.message === 'success') {
            toast.success('Category Restored Successfully')
            getCategory();
        }
    }
    async function deleteCategory(categoryId) {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.delete(`/catagories/hardDelete/${categoryId}`, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
            toast.error('Error While Archived');
            console.log(err);
        });
        if (data.message === 'success') {
            toast.success('Category Deleted Successfully')
            navigate('/Categories');
        }
    }

    useEffect(() => {
        getCategory();
    }, [])

    return (
        <> {/*== Start Product Details Area Wrapper ==*/}
            <Helmet>
                <meta charSet="utf-8" />
                <title>SkinElegance|Categories-{location.state.slug}</title>
            </Helmet>
            < section className="app-container section-space" style={{ marginTop: "-20px", marginBottom: '-140px' }}  >
                <div className="container">
                    {!category ? (
                        <Loading margin={200} height={120} fontSize={70} />
                    ) : <>
                        <div className="row product-details">
                            <div className="col-lg-5">
                                <div className="product-details-thumb product-category-item" style={{ backgroundColor: selectRandomColor(), width: '370px', height: '403px' }}>
                                    <img src={category.image.secure_url} width={370} height={403} alt="Image" />
                                    {isCreatedThisMonth(category.createdAt) && (<span className="flag-new" style={{ backgroundColor: 'red' }}>new</span>)}

                                    <h5 className="product-details-collection text-capitalize">{category?.categoryName}</h5>
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="product-details-content">
                                    <h3 className="product-details-title text-capitalize">{category.name}</h3>

                                    <div className="product-details-qty-list">
                                        <div className="qty-list-check">
                                            <label className="form-check-label" htmlFor="qtyList1"><span className="cell-label">Is Deleted:</span>
                                                <span className={!category.isDeleted ? "status active fs-5" : "status disabled fs-5"}>{category.isDeleted ? 'true' : 'false'}</span></label>
                                        </div>
                                        <div className="qty-list-check">
                                            <label className="form-check-label" htmlFor="qtyList1"><span className="cell-label">Status:</span>
                                                <span className={category.status === "Active" ? "status active fs-5" : "status disabled fs-5"}>{category.status}</span></label>
                                        </div>
                                        {!category.isDeleted ? <button type="button" className="btn bg-danger bg-gradient" style={{ marginLeft: '10px' }} onClick={() => addToArchive(category._id)} >Archive </button>
                                            : <div className='mt-3 row'>
                                                <button type="button" className="btn bg-success bg-gradient col-md-5" style={{ marginLeft: '10px' }} onClick={() => restoreCategory(category._id)} >Restore </button>
                                                <button type="button" className="btn bg-danger bg-gradient col-md-5" style={{ marginLeft: '10px' }} onClick={() => deleteCategory(category._id)} >Delete</button>
                                            </div>}
                                    </div>

                                    <div className="product-details-action">
                                        <ul className="product-details-info-wrap">

                                            <li><span># of Products</span>
                                                <p>{category.Products.length}</p>
                                            </li>
                                            <li><span>Created At</span>
                                                <p>{category.createdAt.split('T')[0]}</p>
                                            </li>
                                            <li><span>Created By</span>
                                                <p>{category.createdByUser.userName}</p>
                                            </li>
                                            <li><span>Last Updated By</span>
                                                <p>{category.createdByUser.userName}</p>
                                            </li>
                                        </ul>
                                    </div>
                                    <Link className="btn bg-info" to={`/Categories/Update/${category?.slug}`} state={{ categoryId: category._id, slug: category.slug }} >Update <i className="fa-solid fa-gear"></i></Link>

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
