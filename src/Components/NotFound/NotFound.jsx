import React from 'react'
import pagenotfound from '../../assets/images/photos/page-not-found.webp'
import { Link } from 'react-router-dom'

export default function NotFound({title,titlePage, goTO}) {
  return (
<section className="page-not-found-area pt-5 app-container" style={{height:"100vh"}}>
  <div className="container">
    <div className="page-not-found" >
      <img src={pagenotfound} width={400} height={300} alt="Image" />
      <h3 className="title">{title}</h3>
      <h5 className="back-btn">Go to <Link to={goTO}>{titlePage}</Link> Page</h5>
    </div>
  </div>
</section>
 )
}
