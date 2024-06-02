import React, { useContext, useEffect, useState } from 'react'
import Loading from '../../Components/Loading/Loading.jsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function CardDetails() {
   const [cardDetails, setCardDetails] = useState(null);
  let [statusError, setStatusError] = useState('');
  let navigate = useNavigate();
  let location = useLocation()
  const getOrder = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        return navigate("/Login");
      }
      const { data } = await axios.get(`/order/${location.state.orderId}`, { headers: { authorization: `Saja__${token}` } });
      console.log(data);
      if (data.message === "success") {
         setCardDetails(data.order.cardDetails);
       }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getOrder();
  }
    , []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>SkinElegance|Card-Details</title>
      </Helmet>
      {/*== Start Product Area Wrapper ==*/}
      {!cardDetails ? <Loading height={100} fontSize={70} width={1200} /> : <section className="app-container section-space" style={{ marginTop: "-150px",height:'120vh' }} >

        <> <div className="container row">
          <div className="app-content-header">
            <h1 className="app-content-headerText">Card Details</h1>

          </div>
          <div className='row mt-3 mb-5'>
            <div className="col-md-1">
            </div>
            <div className="col-md-4">
            </div>
          </div>
          
          <div className="col-6 col-lg-7" style={{ marginTop: "-200px" }} >
            <div className="cart-totals-wrap">
              <h2 className="title">Card Details</h2>
              <table>
                <tbody>
                  <tr className="shipping-totals">
                    <th> Holder Name</th>
                    <td>
                      <p className="destination"><strong>{cardDetails.cardholderName} </strong>.</p>
                    </td>
                  </tr>
                  <tr className="shipping-totals">
                    <th>cardType</th>
                    <td>
                      <p className="destination"><strong>{cardDetails?.cardType}  </strong>.</p>
                    </td>
                  </tr> 

                  <tr className="shipping-totals">
                    <th>expiryDate</th>
                    <td>
                      <p className="destination"><strong>{cardDetails.expiryDate}</strong>.</p>
                    </td>
                  </tr>
                 
                  <tr className="shipping-totals">
                    <th>cvc</th>
                    <td>
                      <p className="destination"><strong>{cardDetails.cvc}</strong>.</p>
                    </td>
                  </tr>
                   
                  
                     
                </tbody>
              </table>
             
            </div>

           </div>
        </div>
        </> 

        </section>}

      {/*== End Product Area Wrapper ==*/}
    </>
  )
}
