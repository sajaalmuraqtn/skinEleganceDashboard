import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import '../src/assets/images/favicon.webp'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../src/assets/css/vendor/bootstrap.min.css'

import '../src/assets/css/plugins/swiper-bundle.min.css'
import '../src/assets/css/plugins/font-awesome.min.css'
import '../src/assets/css/plugins/fancybox.min.css'
import '../src/assets/css/plugins/nice-select.css'

import './App.css';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import NotFound from './Components/NotFound/NotFound';
import Login from './Pages/Login/Login.jsx';
import Register from './Pages/Register/Register.jsx';
import axios from 'axios';
import { GlobalFunctionContextProvider } from './Context/globalFunctionsContext.jsx';
import Product from './Pages/Products/Product.jsx';
import ProductDetails from './Pages/Products/productDetails.jsx';
import ForgotPassword from './Pages/ForgotPassword/forgotPassword.jsx';
import { AuthContext, AuthContextProvider } from './Context/Auth.context.jsx';
import OrderDetails from './Pages/Order/OrderDetails.jsx';
import ProtectedRouter from './ProtectedRouter/ProtectedRouter.jsx';
import { useContext, useEffect, useState } from 'react';
import UpdateProfile from './Pages/Profile/UpdateProfile.jsx';
import Profile from './Pages/Profile/Profile.jsx';
import UpdatePassword from './Pages/ForgotPassword/UpdatePassword.jsx';
import ResetPassword from './Pages/ForgotPassword/ResetPassword.jsx';
import SetCode from './Pages/ForgotPassword/SetCode.jsx';
import Orders from './Pages/Order/Orders.jsx';
import CategoryPage from './Pages/Category/category.page.jsx';
import CouponPage from './Pages/Coupon/coupon.page.jsx';
import UsersPage from './Pages/Users/Users.page.jsx';
import UserProfile from './Pages/Users/UserProfile.jsx';
import CouponDetails from './Pages/Coupon/CouponDetails.jsx';
import CategoryDetails from './Pages/Category/categoryDetails.jsx';
import CreateCoupon from './Pages/Coupon/createCoupon.page.jsx';
import UpdateCoupon from './Pages/Coupon/updateCoupon.page.jsx';
import UpdateProduct from './Pages/Products/updateProduct.jsx';
import CreateProduct from './Pages/Products/createProduct.jsx';
import UpdateCategory from './Pages/Category/updateCategory.page.jsx';
import CreateCategory from './Pages/Category/createCategory.page.jsx';
import AdvertisementPage from './Pages/Advertesment/Advertesment.page.jsx';
import CreateAdvertisement from './Pages/Advertesment/CreateAdvertesment.jsx';
import AdvertisementDetails from './Pages/Advertesment/AdvertesmentDetails.page.jsx';
import UpdateAdvertisement from './Pages/Advertesment/AdvertesmentUpdate.page.jsx';
import ServiceDetails from './Pages/Advertesment/ServiceDetails.jsx';
import UpdateService from './Pages/Advertesment/ServiceUpdate.jsx';
import CreateService from './Pages/Advertesment/CreateService.jsx';
import ContactsPage from './Pages/Contact/contact.page.jsx';
import CreateContact from './Pages/Contact/createContact.jsx';
import UpdateOrder from './Pages/Order/updateOrder.jsx';
import CancelOrder from './Pages/Order/cancelOrder.jsx';
import UpdateContactOrder from './Pages/Order/UpdateContactOrder.jsx';
import Home from './Pages/Home/Home.jsx';
import CardDetails from './Pages/Order/CardDetails.jsx';
import SupportTeamPage from './Pages/SupportTeam/supportTeamMessage.jsx';
import SupportTeamDetailsPage from './Pages/SupportTeam/SupportTeamDetailsPage.jsx';

axios.defaults.baseURL = 'https://skinelegance-ecommerce-nodejs.onrender.com';

function App() {
  const { getProfile, user } = useContext(AuthContext);

  useEffect(() => {
    if (localStorage.getItem("adminToken")) {
      getProfile()
      console.log(user);
    }
  }, [])

  let routes = createBrowserRouter([{
    path: '', element: <AuthContextProvider> <Layout /> </AuthContextProvider>, children: [
      { index: true, element:<Home/>},
      { path: 'Categories', element: <ProtectedRouter><CategoryPage /></ProtectedRouter>  },
      { path: 'Categories/:categoryId', element: <ProtectedRouter><CategoryDetails /></ProtectedRouter> },
      { path: 'Categories/Add', element: <ProtectedRouter><CreateCategory /></ProtectedRouter> },
      { path: 'Categories/Update/:categoryId', element: <ProtectedRouter><UpdateCategory /></ProtectedRouter> },
      { path: 'Products', element: <ProtectedRouter><Product /></ProtectedRouter> },
      { path: 'Products/Add', element:<ProtectedRouter> <CreateProduct /></ProtectedRouter>},
      { path: "Products/:productId", element:<ProtectedRouter><ProductDetails /></ProtectedRouter>},
      { path: "Products/Update/:productId", element:<ProtectedRouter><UpdateProduct /></ProtectedRouter>},
      { path: 'Advertisements', element: <ProtectedRouter><AdvertisementPage /></ProtectedRouter> },
      { path: 'Advertisements/Add', element:<ProtectedRouter> <CreateAdvertisement /></ProtectedRouter>},
      { path: "Advertisements/:advertisementId", element:<ProtectedRouter><AdvertisementDetails /></ProtectedRouter>},
      { path: "Advertisements/:advertisementId/AddService", element:<ProtectedRouter><CreateService /></ProtectedRouter>},
      { path: "Advertisements/Update/:advertisementId", element:<ProtectedRouter><UpdateAdvertisement /></ProtectedRouter>},
      { path: "Advertisements/:advertisementId/:serviceId", element:<ProtectedRouter><ServiceDetails /></ProtectedRouter>},
      { path: "Advertisements/:advertisementId/:serviceId/Update", element:<ProtectedRouter><UpdateService /></ProtectedRouter>},
      { path: 'Coupons', element: <ProtectedRouter><CouponPage /></ProtectedRouter> },
      { path: 'Coupons/:couponId', element: <ProtectedRouter><CouponDetails /></ProtectedRouter> },
      { path: 'Coupons/Add', element: <ProtectedRouter><CreateCoupon /> </ProtectedRouter>},
      { path: 'Coupons/Update/:couponId', element: <ProtectedRouter><UpdateCoupon /></ProtectedRouter> },
       { path: 'Orders', element:<ProtectedRouter><Orders /></ProtectedRouter> },
      { path: 'Orders/CardDetails', element:<ProtectedRouter><CardDetails /></ProtectedRouter> },
      { path: 'Orders/OrderDetails', element:<ProtectedRouter><OrderDetails /></ProtectedRouter> },
      { path: 'Orders/Order/Update', element:<ProtectedRouter><UpdateOrder /></ProtectedRouter> },
      { path: 'Orders/Order/Cancel', element:<ProtectedRouter><CancelOrder /></ProtectedRouter> },
      { path: 'Orders/Order/UpdateContact', element:<ProtectedRouter><UpdateContactOrder/></ProtectedRouter> },
      { path: 'Contacts', element:<ProtectedRouter><ContactsPage /></ProtectedRouter> },
      { path: 'SupportTeamContact', element:<ProtectedRouter><SupportTeamPage /></ProtectedRouter> },
      { path: 'SupportTeamContact/:userId', element:<ProtectedRouter><SupportTeamDetailsPage /></ProtectedRouter> },
      { path: 'Contacts/Add', element:<ProtectedRouter><CreateContact /></ProtectedRouter> },
      { path: 'Users', element: <AuthContextProvider><ProtectedRouter><UsersPage /></ProtectedRouter></AuthContextProvider> },
      { path: 'Users/:userId', element: <ProtectedRouter><UserProfile /></ProtectedRouter> },
      { path: 'Profile', element: <AuthContextProvider><ProtectedRouter><Profile /></ProtectedRouter></AuthContextProvider> },
      { path: 'UpdateProfile', element: <AuthContextProvider><ProtectedRouter><UpdateProfile /></ProtectedRouter></AuthContextProvider> },
      { path: 'ForgotPassword', element: <AuthContextProvider><ForgotPassword /></AuthContextProvider> },
      { path: 'UpdatePassword', element: <AuthContextProvider><ProtectedRouter><UpdatePassword /></ProtectedRouter></AuthContextProvider> },
      { path: 'ResetPassword', element: <AuthContextProvider><ResetPassword /></AuthContextProvider> },
      { path: 'SetCode', element: <AuthContextProvider><SetCode /></AuthContextProvider> },
      { path: 'Login', element: <Login /> },
      { path: 'Register', element: <AuthContextProvider> <Register /></AuthContextProvider> },
      { path: '*', element: <NotFound title={'Opps! You Lost'} titlePage={'Home'} goTO={''} /> },
    ]
  }


  ])


  return (
    <div className="App app-container">
      <GlobalFunctionContextProvider>

          <AuthContextProvider>
            <RouterProvider router={routes}>

            </RouterProvider>
          </AuthContextProvider>
      </GlobalFunctionContextProvider>
    </div>
  );
}

export default App;
