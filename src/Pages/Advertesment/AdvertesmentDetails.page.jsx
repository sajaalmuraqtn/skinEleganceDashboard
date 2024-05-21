import React, { useContext, useEffect, useState } from 'react'
import "../Profile/profile.css"
import Loading from '../../Components/Loading/Loading.jsx';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GlobalFunctionContext } from '../../Context/globalFunctionsContext.jsx';
import { Helmet } from 'react-helmet';
export default function AdvertisementDetails({ logo }) {
    const { isCreatedThisMonth } = useContext(GlobalFunctionContext); // Access the context
    const [advertisement, setAdvertisement] = useState(null);
    const location = useLocation();
    let navigate = useNavigate();

    async function getAdvertisement() {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.get(`/advertisement/admin/${location.state.advertisementId}`, { headers: { authorization: `Saja__${token}` } });
        setAdvertisement(data.advertisement);
    }

    async function addToArchive(advertisementId) {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.patch(`/advertisement/softDelete/${advertisementId}`, null, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
            toast.error('Error While Archived');
            console.log(err);
        });
        if (data.message === 'success') {
            toast.success('Advertisement Archived Successfully')
            getAdvertisement();
        }
    }
    async function restoreAdvertisement(advertisementId) {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.patch(`/advertisement/restore/${advertisementId}`, null, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
            toast.error('Error While restoring');
            console.log(err);
        });
        if (data.message === 'success') {
            toast.success('Advertisement Restored Successfully')
            getAdvertisement();
        }
    }
    async function deleteAdvertisement(advertisementId) {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.delete(`/advertisement/hardDelete/${advertisementId}`, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
            toast.error('Error While Archived');
            console.log(err);
        });
        if (data.message === 'success') {
            toast.success('Advertisement Deleted Successfully')
            navigate('/Advertisements');
        }
    }

    useEffect(() => {
        getAdvertisement();
    }, [])

    return (
        <> {/*== Start Product Details Area Wrapper ==*/}
            <Helmet>
                <meta charSet="utf-8" />
                <title>SkinElegance|Advertisements-{location.state.slug}</title>
                <meta property="og:image" content={`${logo}`} />
            </Helmet>
            < section className="app-container section-space" style={{ marginTop: "-60px", marginBottom: '-100px' }} >
                <div className="container">
                    {!advertisement ? (
                        <Loading margin={150} height={120} fontSize={70} />
                    ) : <>
                        <div className="row product-details">
                            <div className="col-lg-5">
                                <div className="product-details-thumb " >
                                    <img src={advertisement.mainImage.secure_url} width={440} height={503} alt="Image" />
                                    {isCreatedThisMonth(advertisement.createdAt) && (<span className="flag-new" style={{ backgroundColor: 'red' }}>new</span>)}

                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="product-details-content">
                                    <h3 className="product-details-title text-capitalize">{advertisement.name}</h3>
                                    <p>{advertisement.description}</p>

                                    <div className="product-details-qty-list">
                                        <div className="qty-list-check">
                                            <label className="form-check-label" htmlFor="qtyList1"><span className="cell-label">Is Deleted:</span>
                                                <span className={!advertisement.isDeleted ? "status active fs-5" : "status disabled fs-5"}>{advertisement.isDeleted ? 'true' : 'false'}</span></label>
                                        </div>
                                        <div className="qty-list-check">
                                            <label className="form-check-label" htmlFor="qtyList1"><span className="cell-label">Status:</span>
                                                <span className={advertisement.status === "Active" ? "status active fs-5" : "status disabled fs-5"}>{advertisement.status}</span></label>
                                        </div>
                                        {!advertisement.isDeleted ? <button type="button" className="btn bg-danger bg-gradient" style={{ marginLeft: '10px' }} onClick={() => addToArchive(advertisement._id)} >Archive </button>
                                            : <div className='mt-3 row'>
                                                <button type="button" className="btn bg-success bg-gradient col-md-5" style={{ marginLeft: '10px' }} onClick={() => restoreAdvertisement(advertisement._id)} >Restore </button>
                                                <button type="button" className="btn bg-danger bg-gradient col-md-5" style={{ marginLeft: '10px' }} onClick={() => deleteAdvertisement(advertisement._id)} >Delete</button>
                                            </div>}
                                    </div>

                                    <div className="product-details-action">
                                        <ul className="product-details-info-wrap">

                                            <li><span># of Services</span>
                                                <p>{advertisement.Services.length}</p>
                                            </li>
                                            <li><span>Created At</span>
                                                <p>{advertisement.createdAt.split('T')[0]}</p>
                                            </li>
                                            <li><span>Created By</span>
                                                <p>{advertisement.createdByUser.userName}</p>
                                            </li>
                                            <li><span>Last Updated By</span>
                                                <p>{advertisement.createdByUser.userName}</p>
                                            </li>
                                            <li><span>Expired Date</span>
                                                <p>{advertisement.expiredDate.split('T')[0]}</p>
                                            </li>
                                        <div className='social-Media'>
                                            <i class="fa-solid fa-phone fa-2xl" style={{ color: '#3ee302' }}></i>
                                            <span className='fs-4'> {advertisement?.phoneNumber}</span>
                                        </div>
                                        {advertisement?.facebookLink ? <div className='social-Media'>
                                            <i class="fa-brands fa-facebook fa-2xl" style={{ color: '#007fe0' }}></i>
                                            <a href={advertisement?.facebookLink} className='fs-4'> {advertisement.slug}</a>
                                        </div> : ''}
                                        {advertisement?.instagramLink ? <div className='social-Media'>
                                            <i class="fa-brands fa-instagram fa-2xl" style={{ color: '#f702aa' }}></i>
                                            <a href={advertisement?.instagramLink} className='fs-4'> {advertisement.slug}</a>
                                        </div> : ''}
                                        </ul>
                                    </div>
                                    <Link className="btn bg-info" style={{ marginRight: '20px' }} to={`/Advertisements/Update/${advertisement.slug}`} state={{ advertisementId: advertisement._id, slug: advertisement.slug }} >Update <i className="fa-solid fa-gear"></i></Link>
                                    <Link className="btn col-md-5" to={`/Advertisements/${advertisement.slug}/AddService`} state={{ advertisementId: advertisement._id, slug: advertisement.slug }}>Add Service</Link>

                                </div>
                            </div>

                        </div>
                        {advertisement.Services.length === 0 ?
                            ''
                            :
                            <div className="app-content" style={{ marginTop: '-40px' }} >
                                {
                                    <>        <div class="app-content-header">
                                        <h1 class="app-content-headerText">Services</h1>
                                        <button class="mode-switch" title="Switch Theme">

                                        </button>
                                    </div>
                                        <div className="app-content-actions">
                                            <input className="search-bar" placeholder="Search..." type="text" />
                                            <div className="app-content-actions-wrapper">
                                                <div className="filter-button-wrapper">

                                                </div>
                                                <button className="action-button list active" title="List View">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-list"><line x1={8} y1={6} x2={21} y2={6} /><line x1={8} y1={12} x2={21} y2={12} /><line x1={8} y1={18} x2={21} y2={18} /><line x1={3} y1={6} x2="3.01" y2={6} /><line x1={3} y1={12} x2="3.01" y2={12} /><line x1={3} y1={18} x2="3.01" y2={18} /></svg>
                                                </button>

                                            </div>
                                        </div>

                                        <div className="products-area-wrapper tableView">
                                            <div className="products-header">
                                                <div className="product-cell image">
                                                    Item
                                                    <button className="sort-button">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                                    </button>
                                                </div>
                                                <div className="product-cell category">Price<button className="sort-button">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                                </button></div>
                                                <div className="product-cell sales">Discount<button className="sort-button">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                                </button></div>
                                                <div className="product-cell price">Final Price <button className="sort-button">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                                </button></div>
                                                <div className="product-cell status-cell">Status<button className="sort-button">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                                </button></div>

                                                <div className="product-cell stock">createdAt<button className="sort-button">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                                </button></div>
                                                <div className="product-cell image">
                                                    Created By
                                                    <button className="sort-button">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                                    </button>
                                                </div>
                                                <div className="product-cell image">
                                                    Updated By
                                                    <button className="sort-button">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                                    </button>
                                                </div>

                                            </div>
                                            {
                                                advertisement.Services.map((service) => <div className="products-row mt-1" key={service._id}>


                                                    <div className="product-cell image">
                                                        <img src={service?.mainImage?.secure_url} alt="service" />
                                                        <Link to={`/Advertisements/${advertisement.slug}/${service.slug}`} state={{ serviceId: service._id, advertisementId: advertisement._id, slug: service.slug }} className='title text-capitalize'>{service?.name.split(' ').slice(0, 2).join(' ')}</Link>
                                                    </div>
                                                    <div className="product-cell category"><span className="cell-label">Price:</span>{service.price}</div>
                                                    <div className="product-cell sales"><span className="cell-label"> discount:</span> %{!service.discount ? ' --------- ' : service.discount}</div>
                                                    <div className="product-cell price"><span className="cell-label"> Price:</span> ₪ {service.finalPrice?.toFixed(2)} </div>
                                                    <div className="product-cell status-cell">
                                                        <span className="cell-label">Status:</span>
                                                        <span className={service.status == "Active" ? "status active" : "status disabled"}>{service.status}</span>
                                                    </div>
                                                    <div className="product-cell stock"><span className="cell-label"> CreatedAt:</span> {service.createdAt.split('T')[0]}</div>
                                                    <div className="product-cell image">
                                                        <span>{service.createdByUser?.userName}</span>
                                                    </div>
                                                    <div className="product-cell image">
                                                        <span>{service.updatedByUser?.userName}</span>
                                                    </div>
                                                </div>)

                                            }
                                        </div>
                                        {/*== End Product Item ==*/}
                                    </>}
                                {/*== Pagination ==*/}
                            </div >
                        }
                    </>}
                </div>
            </section >
            {/*== End Product Details Area Wrapper ==*/}
            <>

            </>
        </>
    )
}
