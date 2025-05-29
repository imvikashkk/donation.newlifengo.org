import React from 'react'
import { Suspense } from 'react'
import Success from "./Success"

const page = () => {
  return (
      <Suspense >
          <Success />
      </Suspense>
  )
}

export default page