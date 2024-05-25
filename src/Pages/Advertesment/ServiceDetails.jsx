import React, { useContext, useEffect, useState } from 'react'
import "../Profile/profile.css"
import Loading from '../../Components/Loading/Loading.jsx';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GlobalFunctionContext } from '../../Context/globalFunctionsContext.jsx';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
export default function ServiceDetails() {
    const location = useLocation();
    let navigate = useNavigate();
    const { isCreatedThisMonth } = useContext(GlobalFunctionContext); // Access the context
    const [service, setService] = useState(null);
    const [advertisement, setAdvertisement] = useState(null);

    async function getAdvertisement() {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.get(`/advertisement/${location.state.advertisementId}`, {}, { headers: { authorization: `Saja__${token}` } });
        setAdvertisement(data.advertisement);
    }

    async function getService() {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.get(`/advertisement/${location.state.advertisementId}/services/${location.state.serviceId}`, {}, { headers: { authorization: `Saja__${token}` } });
        setService(data.service);
    }

    async function addToArchive(serviceId) {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.patch(`/advertisement/${location.state.advertisementId}/services/softDelete/${serviceId}`, null, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
            toast.error('Error While Archived');
            console.log(err);
        });
        if (data.message === 'success') {
            toast.success('Service Archived Successfully')
            getService();
            getAdvertisement()
        }
    }

    async function restoreService(serviceId) {
        try {
            const token = localStorage.getItem("adminToken");
            const { data } = await axios.patch(`/advertisement/${location.state.advertisementId}/services/restore/${serviceId}`, null, { headers: { authorization: `Saja__${token}` } });

            if (data.message === 'success') {
                toast.success('Service Restored Successfully')
                getService();
            }
        } catch (error) {
            // Handle axios request error
            return toast.error('Advertisement not Available');
        }
    }
    async function deleteService(serviceId) {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.delete(`/advertisement/${location.state.advertisementId}/services/hardDelete/${serviceId}`, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
            toast.error('Error While Archived');
            console.log(err);
        });
        if (data.message === 'success') {
            toast.success('Service Deleted Successfully')
            navigate('/Advertisements');
        }
    }

    useEffect(() => {
        getService();
        getAdvertisement();
    }, [])

    return (
        <> {/*== Start Product Details Area Wrapper ==*/}
            <Helmet>
                <meta charSet="utf-8" />
                <title>SkinElegance|Service-{location.state.slug}</title>
             </Helmet>
            < section className="app-container section-space" style={{ marginTop: "-50px", marginBottom: '-140px' }}  >
                <div className="container">
                    {!service && !advertisement ? (
                        <Loading margin={150} height={120} fontSize={70} />
                    ) : <>
                        <div className="row product-details">
                            <div className="col-lg-5">
                                <div className="product-details-thumb ">
                                    <img src={service?.mainImage.secure_url} width={440} height={503} alt="Image" />
                                    {isCreatedThisMonth(service.createdAt) && (<span className="flag-new" style={{ backgroundColor: 'red' }}>new</span>)}

                                </div>
                            </div>
                            <div className="col-lg-7">
                                <h5 className="product-details-collection text-capitalize">{service?.advertisementName}</h5>

                                <div className="product-details-content">
                                    <h3 className="product-details-title text-capitalize">{service.name}</h3>

                                    <div className="product-details-qty-list">
                                        <div className="qty-list-check">
                                            <label className="form-check-label" htmlFor="qtyList1"><span className="cell-label">Is Deleted:</span>
                                                <span className={!service.isDeleted ? "status active fs-5" : "status disabled fs-5"}>{service.isDeleted ? 'true' : 'false'}</span></label>
                                        </div>
                                        <div className="qty-list-check">
                                            <label className="form-check-label" htmlFor="qtyList1"><span className="cell-label">Status:</span>
                                                <span className={service.status === "Active" ? "status active fs-5" : "status disabled fs-5"}>{service.status}</span></label>
                                        </div>
                                        {!service.isDeleted ? <button type="button" className="btn bg-danger bg-gradient" style={{ marginLeft: '10px' }} onClick={() => addToArchive(service._id)} >Archive </button>
                                            : <div className='mt-3 row'>
                                                <button type="button" className="btn bg-success bg-gradient col-md-5" style={{ marginLeft: '10px' }} onClick={() => restoreService(service._id)} >Restore </button>
                                                <button type="button" className="btn bg-danger bg-gradient col-md-5" style={{ marginLeft: '10px' }} onClick={() => deleteService(service._id)} >Delete</button>
                                            </div>}
                                    </div>

                                    <div className="product-details-action">
                                        <ul className="product-details-info-wrap">
                                            <li><span>Created At</span>
                                                <p>{service.createdAt.split('T')[0]}</p>
                                            </li>
                                            <li><span>Created By</span>
                                                <p>{service.createdByUser.userName}</p>
                                            </li>
                                            <li><span>Last Updated By</span>
                                                <p>{service.createdByUser.userName}</p>
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
                                    <Link className="btn bg-info" to={advertisement ? `/Advertisements/${advertisement.slug}/${service.slug}/Update` : '/'} state={{ serviceId: service._id, advertisementId: service.advertisementId, slug: service.slug }}>Update <i className="fa-solid fa-gear"></i></Link>

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
