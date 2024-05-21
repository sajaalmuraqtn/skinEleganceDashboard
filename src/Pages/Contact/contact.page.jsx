import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import Loading from '../../Components/Loading/Loading.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function ContactsPage({ logo }) {
    const location = useLocation();
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const [contacts, setContacts] = useState([]);

    const getContacts = async (url) => {
        try {
            const token = localStorage.getItem("adminToken");
            const { data } = await axios.get(`/contact/${url}`, { headers: { authorization: `Saja__${token}` } });
            console.log(data);
            if (data.message === "success") {
                setContacts(data.contacts);
                console.log(contacts);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteInvalidConfirm = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const { data } = await axios.delete(`/contact/deleteUnConfirmedContacts`, { headers: { authorization: `Saja__${token}` } });
            if (data.message === "success") {
                toast.success('Unconfirmed Contacts Deleted Successfully')
                getContacts("getAllContacts")
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteContact = async (contactId) => {
        try {
            const token = localStorage.getItem("adminToken");
            const { data } = await axios.delete(`/contact/delete/${contactId}`, { headers: { authorization: `Saja__${token}` } });
            if (data.message === "success") {
                toast.success('Contact Deleted Successfully');
                getContacts("getAllContacts");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getContacts("getAllContacts");
    }, []);

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>SkinElegance|Contacts</title>
                <meta property="og:image" content={`${logo}`} />
            </Helmet>
            <div className="app-content" style={{ height: contacts.length < 10 ? "100vh" : '' }}>
                {
                    contacts.length == 0 ? <Loading margin={60} height={200} fontSize={70} />
                        : <><div className="app-content-header">
                            <h1 className="app-content-headerText">Contacts</h1>
                            <Link class="btn " to={'/Contacts/Add'}>Add Contact</Link>
                        </div>
                            <div className="app-content-actions">
                                <div className="app-content-actions-wrapper">
                                    <div className="filter-button-wrapper">

                                    </div>
                                    <button className="btn-danger" onClick={() => deleteInvalidConfirm()} title="List View" style={{ borderRadius: '6px', cursor: 'pointer' }}>
                                        Delete Unconfirmed Contacts
                                    </button>
                                    <button className="action-button list active" title="List View">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-list"><line x1={8} y1={6} x2={21} y2={6} /><line x1={8} y1={12} x2={21} y2={12} /><line x1={8} y1={18} x2={21} y2={18} /><line x1={3} y1={6} x2="3.01" y2={6} /><line x1={3} y1={12} x2="3.01" y2={12} /><line x1={3} y1={18} x2="3.01" y2={18} /></svg>
                                    </button>

                                </div>
                            </div>
                            <div className="products-area-wrapper tableView">
                                <div className="products-header">
                                    <div className="product-cell stock">Created By<button className="sort-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                    </button></div>

                                    <div className="product-cell category">Email<button className="sort-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                    </button></div>
                                    <div className="product-cell category">Phone Number<button className="sort-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                    </button></div>
                                    <div className="product-cell sales">Confirm Email<button className="sort-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                    </button></div>

                                    <div className="product-cell stock">Created At<button className="sort-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                    </button></div>


                                    <div className="product-cell stock">Delete</div>


                                </div>

                                {contacts.map((contact) => <div className="products-row mt-1">

                                    <div className="product-cell image">
                                        <img src={contact.createdByUser.image?.secure_url} alt="product" />
                                        <span className='title'>{contact.createdByUser?.userName}</span>
                                    </div>                            <div className="product-cell category"><span className="cell-label">email:</span>{contact.email}</div>
                                    <div className="product-cell category"><span className="cell-label">phoneNumber:</span>{contact.phoneNumber}</div>
                                    <div className="product-cell status-cell">
                                        <span className="cell-label">Status:</span>
                                        <span className={contact.confirmEmail ? "status active" : "status disabled"}>{contact.confirmEmail ? 'true' : 'false'}</span>
                                    </div>
                                    <div className="product-cell stock"><span className="cell-label"> CreatedAt:</span> {contact.createdAt.split('T')[0]}</div>
                                    <div className="product-cell stock" ><span className="btn-danger p-1" onClick={() => { deleteContact(contact._id) }} style={{ borderRadius: '6px', cursor: 'pointer' }}>Delete</span></div>

                                </div>)}


                            </div>
                        </>}
            </div >

        </>
    )
}
