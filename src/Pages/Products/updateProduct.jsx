import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import Loading from '../../Components/Loading/Loading.jsx';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
export default function UpdateProduct() {
  let [errors, setErrors] = useState([]);
  let [statusError, setStatusError] = useState('');
  let location = useLocation();

  const schema = Yup.object().shape({
    name: Yup.string().min(3, "Minimum characters is 3").max(50, "Maximum characters is 50"),
    description: Yup.string().min(2, "Minimum characters is 2").max(150000, "Maximum characters is 150000"),
    price: Yup.number().positive("Price must be a positive number"),
    discount: Yup.number().positive("Discount must be a positive number").min(1, "Minimum discount is 1"),
    status: Yup.string().oneOf(['Active', 'Inactive'], "Status must be 'Active' or 'Inactive"),
    mainImage: Yup.mixed(),
    stock: Yup.number().positive("Stock must be a positive number").integer("Stock must be an integer"),
    
    categoryId: Yup.string().min(24, "Category ID must be 24 characters").max(24, "Category ID must be 24 characters"),
    expiredDate: Yup.date().min(new Date(), "Expired date must be in the future"),
  });

  const [product, setProduct] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      discount: "",
      status: "",
      size: "",
      stock: "",
      expiredDate: "",
      categoryId: "",
      mainImage: null
    },
    onSubmit: sendUpdateData,
    validationSchema: schema
  });

  async function sendUpdateData(values) {
    try {
      let formData = new FormData();
      if (values.mainImage) {
        formData.append('mainImage', values.mainImage);
      }
      if (values.name) {
        formData.append('name', values.name);
      }
      if (values.status) {
        formData.append('status', values.status);
      }
      if (values.description) {
        formData.append('description', values.description);
      }
      if (values.price) {
        formData.append('price', values.price);
      }
      if (values.discount) {
        formData.append('discount', values.discount);
      }

      if (values.stock) {
        formData.append('stock', values.stock);
      }
      if (values.size) {
        formData.append('size', values.size);
      }
      if (values.categoryId) {
        formData.append('categoryId', values.categoryId);
      }
      if (values.expiredDate) {
        formData.append('expiredDate', values.expiredDate);
      }

      const token = localStorage.getItem("adminToken");

      let { data } = await axios.put(`/products/${location.state.productId}`, formData, { headers: { authorization: `Saja__${token}` } });
      if (data.message === "success") {
        setStatusError('');
        setErrors([]);
        toast.success("product Updated successfully");
        getProduct();
      } else {
        setErrors(data.err[0]);
      }
    } catch (error) {
       setStatusError(error.response.data.message);
    }
  }

  async function getProduct() {
    const token = localStorage.getItem("adminToken");
    const { data } = await axios.get(`/products/${location.state.productId}`, { headers: { authorization: `Saja__${token}` } });
    setProduct(data.product);
    console.log(data);
    formik.setValues({
      name: data.product.name,
      description: data.product.description,
      price: data.product.price,
      discount: data.product.discount,
      status: data.product.status,
      size: data.product.size,
      stock: data.product.stock,
      expiredDate: data.product.expiredDate,
      categoryId: data.product.categoryId,
    });
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    formik.setFieldValue(name, files[0]);
  };
  const [categories, setCategories] = useState([]);
  const getCategory = async () => {
    try {
      let url = `/catagories/active`;
      const { data } = await axios.get(url);
      if (data.message === "success") {
        setCategories(data.activeCatagories);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProduct();
    getCategory();

  }, []);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>SkinElegance|Products-{location.state.slug}-Update</title>
      </Helmet>
      <main className="main-content pb-10 container" style={{ marginTop: "-50px" }}>
        {(!product && categories.length === 0) ? <Loading height={100} fontSize={70} /> :
          <>
            <section className="page-header-area pt-10 pb-10" data-bg-color="#FFF3DA">
              <div className="container">
                <div className="page-header-st3-content mt-10">
                  <h2 className="page-header-title mt-10">Update Product</h2>
                </div>
              </div>
            </section>
            <div className="row">
              <div className="col-md-3">
                <div className="text-center">
                  <img src={product?.mainImage.secure_url} className="avatar img-circle img-thumbnail" alt="avatar" />
                  <div className="form-group mb-3">
                    <input type="file" name="mainImage" onChange={handleFileChange} className="form-control" />
                    {formik.touched.mainImage && formik.errors.mainImage ? <p className="alert alert-danger mt-2">{formik.errors.mainImage}</p> : null}
                  </div>
                </div>
              </div>
              <div className="col-md-7 personal-info" style={{ marginLeft: "30px" }}>
                <div className="my-account-form">
                  <form method="post" onSubmit={formik.handleSubmit}>
                    <div className="form-group mb-6">
                      <label htmlFor="name">Product Name </label>
                      <input type="text" id="name" name="name" value={formik.values.name} onChange={formik.handleChange} />
                      {(statusError && statusError.includes('name')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                      {formik.touched.name && formik.errors.name ? <p className="alert alert-danger mt-2">{formik.errors.name}</p> : null}
                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="description">Description </label>
                      <textarea id="description" name="description" className='form-control' value={formik.values.description} onChange={formik.handleChange}></textarea>
                      {formik.touched.description && formik.errors.description ? <p className="alert alert-danger mt-2">{formik.errors.description}</p> : null}
                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="price">Price </label>
                      <input type="text" id="price" name="price" value={formik.values.price} onChange={formik.handleChange} />
                      {formik.touched.price && formik.errors.price ? <p className="alert alert-danger mt-2">{formik.errors.price}</p> : null}
                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="discount">Discount </label>
                      <input type="text" id="discount" name="discount" value={formik.values.discount} onChange={formik.handleChange} />
                      {formik.touched.discount && formik.errors.discount ? <p className="alert alert-danger mt-2">{formik.errors.discount}</p> : null}
                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="register_expired_date">Category Name <sup>*</sup></label>
                      <select className="form-select" name='categoryId' value={formik.values.categoryId} onChange={formik.handleChange} aria-label="Default select example">
                        <option >Open menu and select Category</option>

                        {categories.map((category) => {
                          return <option value={category._id} key={category._id}>{category.name}</option>
                        }
                        )
                        }
                      </select>

                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="register_expired_date">Expired Date <sup>*</sup></label>
                      <input type="date" id="register_expired_date" name="expiredDate" value={formik.values.expiredDate} onChange={formik.handleChange} />
                      {formik.errors.expiredDate ? <p className="alert alert-danger mt-2">{formik.errors.expiredDate}</p> : ""}
                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="product_size">Size <sup>*</sup></label>
                      <input type="text" id="product_size" name="size" value={formik.values.size} onChange={formik.handleChange} />
                      {formik.errors.size ? <p className="alert alert-danger mt-2">{formik.errors.size}</p> : ""}
                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="product_stock">Stock <sup>*</sup></label>
                      <input type="text" id="product_stock" name="stock" value={formik.values.stock} onChange={formik.handleChange} />
                      {formik.errors.stock ? <p className="alert alert-danger mt-2">{formik.errors.stock}</p> : ""}
                    </div>
                    <div className="form-group mb-6">
                      <label htmlFor="status">Status </label>
                      <select id="status" name="status" className="form-select" value={formik.values.status} onChange={formik.handleChange}>
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      {(statusError && statusError.includes('advertisement')) ? <p className="alert alert-danger mt-2">{statusError}</p> : ''}
                      {formik.touched.status && formik.errors.status ? <p className="alert alert-danger mt-2">{formik.errors.status}</p> : null}
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary">Update</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        }
      </main>
    </>
  );

}
