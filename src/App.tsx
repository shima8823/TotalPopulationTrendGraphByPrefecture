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
  const [checkedPrefectures, setCheckedPrefectures] = useState<{
    [key: string]: boolean
  }>({})

  useEffect(() => {
    axios
      .get(`${RESAS_BASEURL}api/v1/prefectures`, {
        headers: { 'X-API-KEY': process.env.REACT_APP_RESAS_KEY }
      })
      .then((res) => {
        setListOfPrefecture(res.data.result)
        const initialChecks = res.data.result.reduce(
          (acc: { [key: string]: boolean }, curr: PrefecturesData) => ({
            ...acc,
            [curr.prefName]: false
          }),
          {}
        )
        setCheckedPrefectures(initialChecks)
      })
      .catch(() => {})
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedPrefectures({
      ...checkedPrefectures,
      [e.target.value]: e.target.checked
    })
    if (e.target.checked) {
      axios
        .get(
          `${RESAS_BASEURL}api/v1/population/composition/perYear?cityCode=-&prefCode=${e.target.value}`,
          {
            headers: { 'X-API-KEY': process.env.REACT_APP_RESAS_KEY }
          }
        )
        .then((res) => {
          // 保存
          // eslint-disable-next-line
          console.log(res)
        })
    }
  }
  return (
    <div>
      {arrayOfPrefecture
        ? arrayOfPrefecture.map((prefecture) => (
            <div key={prefecture.prefCode}>
              <input
                id={prefecture.prefCode.toString()}
                type="checkbox"
                value={prefecture.prefCode}
                onChange={onChange}
              />
              <label htmlFor={prefecture.prefName}>{prefecture.prefName}</label>
            </div>
          ))
        : 'Loading...'}
    </div>
  )
}
