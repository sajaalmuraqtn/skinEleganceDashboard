import React, { useContext } from 'react'
import { GlobalFunctionContext } from '../../Context/globalFunctionsContext.jsx';

export default function CouponComponent({ coupon }) {


    const {selectRandomColor } = useContext(GlobalFunctionContext); // Access the context

    return (
        <div className="col-sm-6 col-lg-4 mb-8">
            {/*== Start Product Category Item ==*/}
            <div className="post-item">
                <a className="thumb">
                    <img src={coupon.image.secure_url} width={370} height={320} alt="Image-HasTech" />
                </a>
                <div className="content" style={{marginLeft:'10px'}}>
                    <a className="post-category post-category-three text-capitalize title" style={{ backgroundColor: selectRandomColor() }} >{coupon.name} </a>
                    <h4 className="post-date fw-5" style={{marginLeft:'10px'}}>Exp <a style={{fontSize:'20px'}}>{coupon.expiredDate.split('T')[0]}</a></h4>
                </div>
            </div>
            {/*== End Product Category Item ==*/}
        </div>
    )
}
