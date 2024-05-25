import React, { useContext, useEffect, useState } from 'react'
import "../Profile/profile.css"
import Loading from '../../Components/Loading/Loading.jsx';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
export default function UserProfile() {
    const [user, setUser] = useState(null);
    const location = useLocation();
    async function getProfile() {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.get(`/user/getSpecificUser/${location.state.userId}`, { headers: { authorization: `Saja__${token}` } });
        setUser(data.user);
    }
    useEffect(() => {
        getProfile();
    }, [])
    return (
        <> {/*== Start Product Details Area Wrapper ==*/}
            <Helmet>
                <meta charSet="utf-8" />
                <title>SkinElegance|Users-{location.state.slug}</title>
            </Helmet>
            < section className="app-container section-space" style={{ height: '100vh' }}  >
                <div className="container">
                    {!user ? (
                        <Loading margin={130} height={100} fontSize={70} />
                    ) : <>
                        <div className="row product-details">
                            <div className="col-lg-5">
                                <div className="product-details-thumb">
                                    <img src={user.image.secure_url} width={400} height={503} alt="Image" />
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="product-details-content">
                                    <h3 className="product-details-title text-capitalize">{user.userName}</h3>
                                    <div className="product-details-review">

                                        <button type="button" className="product-review-show fs-4">{user.email} </button>
                                    </div>
                                    <div className="product-details-qty-list">
                                        <div className="qty-list-check">
                                            <label className="form-check-label" htmlFor="qtyList1"><span className="cell-label">Confirm Email:</span>
                                                <span className={user.confirmEmail ? "status active fs-5" : "status disabled fs-5"}>{user.confirmEmail ? 'true' : 'false'}</span></label>
                                        </div>
                                    </div>

                                    <div className="product-details-action">
                                        <ul className="product-details-info-wrap">
                                            <li><span>Phone Number</span>
                                                <p>{user.phoneNumber}</p>
                                            </li>
                                            <li><span>Address</span>
                                                <p>{user.address}</p>
                                            </li>
                                            <li><span>Role</span>
                                                <p>{user.role}</p>
                                            </li>
                                            <li><span>JoinIn</span>
                                                <p>{user.createdAt.split('T')[0]}</p>
                                            </li>

                                        </ul>
                                    </div>

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
