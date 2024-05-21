import React, { useEffect, useState } from 'react'
import Loading from '../Loading/Loading.jsx'
import axios from 'axios';
import CouponComponent from './coupon.component.jsx';

export default function CouponSection() {

    const [coupons, setCoupons] = useState([]);

    const getCoupons = async () => {
        try {
            let url =`/coupon/active`;
            const { data } = await axios.get(url);

            if (data.message === "success") {
                setCoupons(data.coupons);
                console.log(coupons);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCoupons();

    }, []);

    return (
        <section className="section-space" style={{marginTop:"-130px",marginBottom:"-50px"}}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title text-center">
                            <h2 className="title">Coupons</h2>
                        </div>
                    </div>
                </div>
                <div className="row mb-n9">
                    {
                        coupons.length === 0 ? (
                            <Loading margin={100} height={200} fontSize={70} />
                        ) :
                            coupons.map((coupon) => (
                                <CouponComponent coupon={coupon} key={coupon._id} />

                            ))
                    }
                </div>
            </div>
        </section>

    )
}
