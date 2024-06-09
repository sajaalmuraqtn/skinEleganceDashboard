import React, { useContext, useEffect, useState } from 'react';
import { GlobalFunctionContext } from '../../Context/globalFunctionsContext.jsx';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'; // Import useNavigate instead of useHistory
import Loading from '../../Components/Loading/Loading.jsx';
import axios from 'axios';
import { Helmet } from 'react-helmet';

export default function AdvertisementPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pageFromURL = queryParams.get('page');
    const [page, setPage] = useState(parseInt(pageFromURL) || 1);
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const [totalPages, setTotalPages] = useState(0);
    // Use array destructuring to get the state variable and the function to update it
    const [advertisements, setAdvertisements] = useState([]);
    const [params, setParams] = useSearchParams();

    const handleSearch = (e) => {
      const query = e.target.value;
      setPage(1); // Reset page to 1 when performing a new search
      setParams({ query }); // Update URL query parameters with the new search query
    };
    const getSearchAdvertisements = async (page,searchQuery) => {
        try {
            searchQuery = `search=${searchQuery}`;
            const token = localStorage.getItem("adminToken");
            const separator = '?'; // to put the sort and other filters method
            const { data } = await axios.get(`/advertisement${separator}page=${page}&${searchQuery}`, { headers: { authorization: `Saja__${token}` } });
            if (data.message === "success") {
                if (data.advertisements.length===0) {
                    navigate('/Advertisements/Add')
                }
                setAdvertisements(data.advertisements);
             }
        } catch (error) {
         }
    };
    const getAdvertisements = async (page) => {
        try {
            const token = localStorage.getItem("adminToken");
            const separator = '?'; // to put the sort and other filters method
            const { data } = await axios.get(`/advertisement${separator}page=${page}`, { headers: { authorization: `Saja__${token}` } });
             if (data.message === "success") {
                setAdvertisements(data.advertisements);
             }
        } catch (error) {
         }
    };

    useEffect(() => {
        const searchQuery = params.get('query'); // Get the search query from URL parameters
        const itemsPerPage = 9; // Set number of items per page
        if (searchQuery) {
            getSearchAdvertisements(page,searchQuery).then(data => {
                if (data && data.total) {
                    const totalPages = Math.ceil(data.total / 9); // Assuming 9 products per page
                    setTotalPages(totalPages);
                } else {
                    console.error('Invalid response data:', data);
                }
            }).catch(error => {
                console.error('Error fetching products:', error);
            });
        }
        else {
            getAdvertisements(page).then(data => {
                if (data && data.total) {
                    const totalPages = Math.ceil(data.total / 9); // Assuming 9 products per page
                    setTotalPages(totalPages);
                } else {
                    console.error('Invalid response data:', data);
                }
            }).catch(error => {
                console.error('Error fetching products:', error);
            });
        }
    }, [page,params]);

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
        // Update the URL with the new page number
        navigate(`?page=${pageNumber}`); // Use navigate instead of history.push
    };
    // Generate pagination buttons dynamically
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
                <title>SkinElegance|Advertisements</title>
            </Helmet>
            <div className="app-content" style={{ height: advertisements.length < 10 ? "100vh" : '' }}>
                {
                   (!params.get('query') &&advertisements.length == 0 )? <Loading margin={50} height={100} fontSize={70} />
                        : <><div className="app-content-header">
                            <h1 className="app-content-headerText">Advertisements</h1>

                            <Link class="btn" to={'/Advertisements/Add'}>Add Advertisement</Link>
                        </div>
                            <div className="app-content-actions">
                                <input className="search-bar" value={params.get('query') || ''}
                                    onChange={handleSearch}
                                    type="search"
                                    name="search"
                                    placeholder='Search on Advertisements  (title,desc ....)' />
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
                                    <div className="product-cell category"># Services<button className="sort-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                    </button></div>
                                    <div className="product-cell category">City<button className="sort-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                    </button></div>

                                    <div className="product-cell status-cell">Status<button className="sort-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z" /></svg>
                                    </button></div>
                                    <div className="product-cell stock">Expired Date<button className="sort-button">
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

                       {(params.get('query')&&advertisements.length==0)?'':  <>    
                          {advertisements.map((advertisement) => <div className="products-row mt-1">
                                    <div className="product-cell image">
                                            <img src={advertisement?.mainImage?.secure_url} alt="advertisement" />
                                            <Link to={`/Advertisements/${advertisement.slug}`} state={{ advertisementId: advertisement._id,slug:advertisement.slug }} className='title text-capitalize'>{advertisement?.name.split(' ').slice(0,2).join(' ')}</Link>
                                        </div>
                                    <div className="product-cell category"><span className="cell-label">services:</span>{advertisement.Services.length}</div>
                                    <div className="product-cell category"><span className="cell-label">city:</span>{advertisement.city}</div>
                                    <div className="product-cell status-cell">
                                        <span className="cell-label">Status:</span>
                                        <span className={advertisement.status == "Active" ? "status active" : "status disabled"}>{advertisement.status}</span>
                                    </div>
                                    <div className="product-cell stock"><span className="cell-label"> ExpiredDate:</span> {advertisement.expiredDate.split('T')[0]}</div>
                                    <div className="product-cell stock"><span className="cell-label"> CreatedAt:</span> {advertisement.createdAt.split('T')[0]}</div>
                                    <div className="product-cell image">
                                        <span>{advertisement.createdByUser?.userName}</span>
                                    </div>
                                    <div className="product-cell image">
                                        <span>{advertisement.updatedByUser?.userName}</span>
                                    </div>
                                </div>)
                                }
  </> }
                            </div>
                            {/*== End Product Item ==*/}
                            {advertisements.length > 9 ?
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
