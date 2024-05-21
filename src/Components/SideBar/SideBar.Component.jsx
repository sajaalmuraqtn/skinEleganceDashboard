import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function SideBarComponent({ logo, user, LogOut }) {

  let location = useLocation();
  return (
    <>
      <div className="sidebar">
        <Link className="sidebar-header" to={'Profile'}>
          <div className="account-info-picture">
            <img src={user.image.secure_url} alt="Account" />
          </div>
          <span style={{ marginRight: "90px" }} className='title'>{user.userName}</span>
        </Link>
        <ul className="sidebar-list mt-4">
          <li className={location.pathname.includes('Orders')? "sidebar-list-item active" : "sidebar-list-item"}>
            <Link to={"/Orders"}>
              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-inbox"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
              <span>Orders</span>
            </Link>
          </li>
          <li className={location.pathname.includes('Products') ? "sidebar-list-item active" : "sidebar-list-item"}>
            <Link to={'Products'}>
              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-bag"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1={3} y1={6} x2={21} y2={6} /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              <span>Products</span>
            </Link>
          </li>
          <li className={location.pathname.includes('Categories') ? "sidebar-list-item active" : "sidebar-list-item"}>
            <Link to={'Categories'}>
              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-pie-chart"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>
              <span>Categories</span>
            </Link>
          </li>
          <li className={location.pathname.includes('Coupons') ? "sidebar-list-item active" : "sidebar-list-item"}>
            <Link to={"Coupons"}>
              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-pie-chart"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>
              <span>Coupons</span>
            </Link>
          </li>
          <li className={location.pathname.includes('Users') ? "sidebar-list-item active" : "sidebar-list-item"}>
            <Link to={"Users"}>
              <i className="fa-solid fa-users fs-6" style={{marginRight:'10px'}} ></i>
              <span> Users</span>
            </Link>
          </li>
          <li className={location.pathname.includes('Advertisements') ? "sidebar-list-item active" : "sidebar-list-item"}>
            <Link to={"Advertisements"}>
              <i className="fa-solid fa-icons fs-6"  style={{marginRight:'10px'}}></i>
              <span> Advertisements</span>
            </Link>
          </li>
          <li className={location.pathname.includes('Contacts') ? "sidebar-list-item active" : "sidebar-list-item"}>
            <Link to={"Contacts"}>
              <i className="fa-solid fa-square-share-nodes fs-6"  style={{marginRight:'10px'}}></i>
              <span> Contacts</span>
            </Link>
          </li>
                         
          <li className="sidebar-list-item">
            <Link onClick={() => LogOut()}>
              <i className="fa fa-arrow-right-from-bracket fs-6"  style={{marginRight:'10px'}}></i>
              <span> LogOut</span>
            </Link>
          </li>
        </ul>

      </div>


    </>
  )
}
