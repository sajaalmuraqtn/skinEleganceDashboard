import React from 'react';
import './loading.css'
export default function Loading({margin,fontSize,height,width}) {
  return (
    <div  style={{marginTop:`-${margin}px`, display:'flex',alignItems:'center',justifyContent:'center', height:`${height}vh`, width:`${width}vh`}}>
      <span className="loader"  style={{fontSize:`${fontSize}px` }}></span>
    </div>
  );
}
