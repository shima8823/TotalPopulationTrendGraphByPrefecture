import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

const RESAS_BASEURL = 'https://opendata.resas-portal.go.jp/'

interface PrefecturesData {
  prefCode: number
  prefName: string
}

export default function MyApp() {
  const [arrayOfPrefecture, setListOfPrefecture] = useState<
    PrefecturesData[] | null
  >(null)

  useEffect(() => {
    axios
      .get(`${RESAS_BASEURL}api/v1/prefectures`, {
        headers: { 'X-API-KEY': process.env.REACT_APP_RESAS_KEY }
      })
      .then((res) => {
        setListOfPrefecture(res.data.result)
      })
      .catch(() => {})
  }, [])

  const onChange = () => {}
  return (
    <div>
      {arrayOfPrefecture
        ? arrayOfPrefecture.map((prefecture) => (
            <div key={prefecture.prefCode}>
              <input
                id={prefecture.prefName}
                type="checkbox"
                value={prefecture.prefName}
                onChange={onChange}
              />
              <label htmlFor={prefecture.prefName}>{prefecture.prefName}</label>
            </div>
          ))
        : 'Loading...'}
    </div>
  )
}
