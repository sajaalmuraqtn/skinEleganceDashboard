import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup as a whole module
import axios from 'axios';
import Loading from '../../Components/Loading/Loading.jsx';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function UpdateCategory() {
  // Use array destructuring to get the state variable and the function to update it

  let [errors, setErrors] = useState([]);
  let [statusError, setStatusError] = useState('');
  let navigate = useNavigate();
  let location = useLocation();
  // Define the validation schema using Yup
  const schema = Yup.object({
    name: Yup.string().min(5, "Minimum characters is 5").max(30, "Maximum characters is 30"),
    status: Yup.string().required().oneOf(['Active', 'Inactive']),
    file: Yup.mixed() // Accept any file type
  });

  const [category, setCategory] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      status: '',
      file: null // Initialize file as null
    },
    onSubmit: sendUpdateData,
    validationSchema: schema
  });

  async function sendUpdateData(values) {
    let formData = new FormData();
    if (values.file) {
      formData.append('image', values.file);
    }
    if (values.name) {
      formData.append('name', values.name);
    }
    if (values.status) {
      formData.append('status', values.status);
    }

    const token = localStorage.getItem("adminToken");

    let { data } = await axios.put(`/catagories/${location.state.categoryId}`, formData, { headers: { authorization: `Saja__${token}` } }).catch((err) => {
      setStatusError(err.response.data.message);
      console.error(err.response.data.message);
    })
    if (data.message === "success") {
      setStatusError('');
      setErrors([]);
      toast.success("Category Updated successfully");
      getCategory()
      navigate('/Categories');
    } else {
      setErrors(data.err[0]);
    }
    console.log(data)
  }


  async function getCategory() {
    const token = localStorage.getItem("adminToken");
    const { data } = await axios.get(`/catagories/${location.state.categoryId}`, {}, { headers: { authorization: `Saja__${token}` } });
    setCategory(data.category);
    // Update formik's initial values after getting category details
    formik.setValues({
      name: data.category.name,
      status: data.category.status
    });
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    formik.setFieldValue(name, files[0]);
  };

  useEffect(() => {
    // Get category details when component mounts
    getCategory();
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>SkinElegance|Categories-{location.state.slug}-Update</title>
      </Helmet>
      <main className="main-content pb-10 container" style={{ height: '100vh' }}>
        {/*== Start Product Category Area Wrapper ==*/}
        {!category ? <Loading height={100} fontSize={70} />
          : <>  {/*== Start Page Header Area Wrapper ==*/}
            <section className="page-header-area pt-10 pb-10" data-bg-color="#FFF3DA">
              <div className="container">
                <div className="page-header-st3-content mt-10">
                  <h2 className="page-header-title mt-10">Update Category</h2>
                </div>
              </div>
            </section>

            <div className="row">
              {/* left column */}
              <div className="col-md-3">
                <div className="text-center">
                  {/* Display category image here */}
                  <img src={category.image.secure_url} className="avatar img-circle img-thumbnail" alt="avatar" />
                  <div className="form-group mb-3">
                    <input type="file" name="file" onChange={handleFileChange} className="form-control" id="category_image" />
                  </div>

                </div>
              </div>
              <div className="col-md-7 personal-info" style={{ marginLeft: "30px" }}>
                <div className="my-account-form">
                  <form method="post" onSubmit={formik.handleSubmit}>

                    <div className="form-group mb-6">
                      <label htmlFor="category_name">Category Name </label>
                      <input
                        type="text"
                        id="category_name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                      />
                      {(statusError && statusError.includes('name')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                      {formik.errors.name ? <p className="alert alert-danger mt-2">{formik.errors.name}</p> : ""}
                      {/* Error handling code */}
                    </div>



                    <div className="form-group mb-6">
                      <label htmlFor="category_status">Status </label>
                      <select
                        id="category_status"
                        name="status"
                        className="form-select"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      {formik.errors.status ? <p className="alert alert-danger mt-2">{formik.errors.status}</p> : ""}
                      {/* Error handling code */}
                    </div>


                    {/* Your other form fields */}
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary">Update</button>
                    </div>
                  </form>

                </div>
              </div>
            </div></>}
      </main>
    </>

  )
}
