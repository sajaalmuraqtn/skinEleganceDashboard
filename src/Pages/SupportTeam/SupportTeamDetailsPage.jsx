import React, { useContext, useEffect, useState } from 'react'
import Loading from '../../Components/Loading/Loading.jsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function SupportTeamDetailsPage() {
  const [contactDetails, setContactDetails] = useState(null);
   let navigate = useNavigate();
  let location = useLocation()
  const getContactDetails = async () => {
    try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      return navigate("/Login");
    }
    const { data } = await axios.get(`/ContactSupport/getSpecificContactSupport/${location.state.contactId}`, { headers: { authorization: `Saja__${token}` } });
    if (data.message === "success") {
      setContactDetails(data.contact);
    } } catch (error) {
    }
  };
  const schema = Yup.object({
    replay: Yup.string()
      .min(20, "Message can't be less than 20 characters")
      .max(150000, "Message can't be more than 150000 characters")
      .required('Message is required')
  });

  const formik = useFormik({
    initialValues: {
      replay: ""
    },
    onSubmit: sendReplayData,
    validationSchema: schema
  });

  async function sendReplayData(values) {
    try {
    const token = localStorage.getItem("adminToken");
    const { data } = await axios.put(`/ContactSupport/Replay/${location.state.contactId}`, values, { headers: { authorization: `Saja__${token}` } });
    if (data.message === "success") {
      toast.success('Replay Send Successfully');
      getContactDetails();
    }
  } catch (error) {
  }
  }

  useEffect(() => {
    getContactDetails();
  }
    , []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>SkinElegance|Contact-Details</title>
      </Helmet>
      {/*== Start Product Area Wrapper ==*/}
      {!contactDetails ? <Loading height={100} fontSize={70} width={1200} /> : <section className="app-container section-space" style={{ marginTop: "-80px" }} >

        <> <div className="container row">
          <div className="app-content-header">
            <h1 className="app-content-headerText">Contact Message Details</h1>

          </div>

          <div className="col-6 col-lg-7 mt-10">
            <div className="cart-totals-wrap">
              <h2 className="title">Message Details</h2>
              <table>
                <tbody>
                  <tr className="shipping-totals">
                    <th>From</th>
                    <td>
                      <Link to={`/Users/${contactDetails.createdByUser?.slug}`} state={{ userId: contactDetails.createdByUser?._id, slug: contactDetails.createdByUser?.slug }}>{contactDetails?.email}</Link>
                    </td>
                  </tr>
                  <tr className="shipping-totals">
                    <th> Title</th>
                    <td>
                      <p className="destination"><strong>{contactDetails.title} </strong>.</p>
                    </td>
                  </tr>
                  <tr>
                    <th>Message:</th>
                    <th>
                      {contactDetails.message.length > 66 ? <br /> : ''}
                      <p className="destination text-capitalize text-start" style={{ width: '100%' }}><strong>{contactDetails.message}</strong>.</p>
                    </th></tr>
                </tbody>
              </table>

            </div>

          </div>

         { contactDetails.replied? 
          <div className="col-6 col-lg-7 mt-10">
            <div className="cart-totals-wrap">
              <h2 className="title">Replay Details</h2>
              <table>
                <tbody>
                  <tr className="shipping-totals">
                    <th>From</th>
                    <td>
                     <p className="destination"><img src={contactDetails?.repliedBy.image?.secure_url} alt="Profile" className='rounded-circle' style={{marginRight:'5px'}} width={'30px'}/>{contactDetails?.repliedBy.userName}</p>
                    </td>
                  </tr>
                  <tr className="shipping-totals">
                    <th> Title</th>
                    <td>
                      <p className="destination"><strong>{contactDetails.title} </strong>.</p>
                    </td>
                  </tr>
                  <tr>
                    <th>Replay:</th>
                    <th>
                      {contactDetails.replay.length > 66 ? <br /> : ''}
                      <p className="destination text-capitalize text-start" style={{ width: '100%' }}><strong>{contactDetails.replay}</strong>.</p>
                    </th></tr>
                </tbody>
              </table>

            </div>

          </div>:<div className="col-lg-6 mb-8 mt-10" >
            <div className="section-title">
              <h2 className="title">Replay</h2>
              <div className="faq-line" />
            </div>
            {/*== Start Contact Form ==*/}
            <div className="contact-form">
              <form id="contact-form" onSubmit={formik.handleSubmit}>
                <div className="row">
                 
                  <div className="col-12">
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        name="replay"
                        placeholder="Replay"
                        value={formik.values.replay}
                        onChange={formik.handleChange}
                        rows={5}
                      />
                      {formik.errors.replay ? <p className="alert alert-danger mt-2">{formik.errors.replay}</p> : ""}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group mb-0">
                      <button className="btn btn-sm" type="submit">Send</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            {/*== End Contact Form ==*/}
            {/*== Message Notification ==*/}
            <div className="form-message" />
          </div>}
        </div>
        </>

      </section>}

      {/*== End Product Area Wrapper ==*/}
    </>
  )
}
