import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'; // Import useNavigate instead of useHistory
import Loading from '../../Components/Loading/Loading.jsx';
import axios from 'axios';
import { Helmet } from 'react-helmet';

export default function SupportTeamPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pageFromURL = queryParams.get('page');
    const [page, setPage] = useState(parseInt(pageFromURL) || 1);
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const [totalPages, setTotalPages] = useState(0);
    // Use array destructuring to get the state variable and the function to update it
    const [Cont, setCont] = useState([]);
    const [params, setParams] = useSearchParams();

    const handleSearch = (e) => {
        const query = e.target.value;
        setPage(1); // Reset page to 1 when performing a new search
        setParams({ query }); // Update URL query parameters with the new search query
    };

    const getSearchSupportTeamMessages = async (page, url, searchQuery) => {
        const token = localStorage.getItem("adminToken");
        searchQuery = `search=${searchQuery}`;
        const separator = '?'; // to put the sort and other filters method
        try {
            const { data } = await axios.get(`/ContactSupport/${url}${separator}page=${page}&${searchQuery}`, { headers: { authorization: `Saja__${token}` } });
            if (data.message === "success") {
                setCont(data.contacts);
            }
        } catch (error) {
        }
    };

    const getSupportTeamMessages = async (page, url) => {
        const token = localStorage.getItem("adminToken");
        const separator = '?'; // to put the sort and other filters method
        try {
            const { data } = await axios.get(`/ContactSupport/${url}${separator}page=${page}`, { headers: { authorization: `Saja__${token}` } });
            console.log(data.contacts);
            if (data.message === "success") {
                setCont(data.contacts);
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        const searchQuery = params.get('query'); // Get the search query from URL parameters
        const itemsPerPage = 9; // Set number of items per page
        if (searchQuery) {
            getSearchSupportTeamMessages(page, "getAllContacts", searchQuery).then(data => {
                if (data && data.total) {
                    const totalPages = Math.ceil(data.total / 9); // Assuming 9 products per page
                    setTotalPages(totalPages);
                } else {
                    console.error('Invalid response data:', data);
                }
            })
        }
        else {
            getSupportTeamMessages(page, "getAllContacts").then(data => {
                if (data && data.total) {
                    const totalPages = Math.ceil(data.total / 9); // Assuming 9 products per page
                    setTotalPages(totalPages);
                } else {
                    console.error('Invalid response data:', data);
                }
            })
        }
    }, [page, params]);

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
        navigate(`?page=${pageNumber}`);
    };
    const paginationButtons = [];
    for (let i = 1; i <= totalPages; i++) {
        paginationButtons.push(
            <li className="page-item" key={i}>
                <a className="page-link" onClick={() => handlePageChange(i)}>{i}</a>
            </li>
        );
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>SkinElegance|Support Team Messages</title>
            </Helmet>
            <div className="app-content" style={{ height: Cont.length < 10 ? "100vh" : '' }}>
                {
                    (!params.get('query') && Cont.length == 0) ? <Loading margin={60} height={200} fontSize={70} />
                        : <><div className="app-content-header">
                            <h1 className="app-content-headerText">Support Team Messages</h1>

                        </div>
                            <div className="app-content-actions">
                                <input className="search-bar" value={params.get('query') || ''}
                                    onChange={handleSearch}
                                    type="search"
                                    name="search"
                                    placeholder='Search on Users  (UserName, email, ....)' />
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
                                    <div className="product-cell category">Email<button className="sort-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                    </button></div>
                                    <div className="product-cell sales">Title<button className="sort-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                    </button></div>
                                    <div className="product-cell sales">Is Replied<button className="sort-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                    </button></div>

                                    <div className="product-cell stock">Send At<button className="sort-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                    </button></div>
                                    <div className="product-cell price">Details<button className="sort-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                    </button></div>


                                </div>

                                {(params.get('query') && Cont.length == 0) ? '' : <> {Cont.map((contact) => <div className="products-row mt-1">
                                    <div className="product-cell image">
                                        <img src={contact?.createdByUser.image?.secure_url} alt="Profile" />
                                        <Link to={`/Users/${contact.createdByUser?.slug}`} state={{ userId: contact.createdByUser?._id, slug: contact.createdByUser?.slug }} className='title'>{contact?.createdByUser.userName.split(' ').slice(0, 3).join(' ')}</Link>
                                    </div>
                                    <div className="product-cell category"><span className="cell-label">email:</span>{contact.email}</div>

                                    <div className="product-cell stock"><span className="cell-label"> Title:</span> {contact.title}</div>
                                    <div className="product-cell status-cell">
                                        <span className="cell-label">replied:</span>
                                        <span className={contact.replied ? "status active" : "status disabled"}>{contact.replied ? 'true' : 'false'}</span>
                                    </div>
                                    <div className="product-cell stock"><span className="cell-label"> CreatedAt:</span> {contact?.createdAt?.split('T')[0]}</div>
                                    <div className="product-cell price"><Link className='btn' to={`/SupportTeamContact/${contact.createdByUser?.slug}`} state={{ contactId: contact._id }} >Details</Link></div>

                                </div>)}</>}
                            </div>
                            {/*== End Product Item ==*/}
                            {Cont.length > 9 ?
                                <div className="col-12">
                                    <ul className="pagination justify-content-center me-auto ms-auto mt-5 mb-0 mb-sm-10">
                                        <li className="page-item">
                                            <a className="page-link previous" aria-label="Previous">
                                                <span className="fa fa-chevron-left" aria-hidden="true" />
                                            </a>
                                        </li>
                                        {paginationButtons}
                                        <li className="page-item">
                                            <a className="page-link next" aria-label="Next">
                                                <span className="fa fa-chevron-right" aria-hidden="true" />
                                            </a>
                                        </li>
                                    </ul>
                                </div> : ''}
                            {/*== Pagination ==*/}</>}
            </div >

        </>
    )
}
