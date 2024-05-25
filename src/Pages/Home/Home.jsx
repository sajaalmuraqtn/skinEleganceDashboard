import React, { useState } from 'react'

import HomeContent from '../../Components/HomeContent/HomeContent.jsx'
import { Helmet } from 'react-helmet'
export default function Home() {

  return (
    < >
      <Helmet>
        <meta charSet="utf-8" />
        <title>SkinElegance|Dashboard</title>
      </Helmet>
      <HomeContent />

    </ >
  )
}
