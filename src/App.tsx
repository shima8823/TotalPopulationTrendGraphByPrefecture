import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import YearlyPopulationChart from './YearlyPopulationChart'

const RESAS_BASEURL = 'https://opendata.resas-portal.go.jp/'

interface PrefecturesData {
  prefCode: number
  prefName: string
}

interface YearlyPopulation {
  boundaryYear: number
  data: {
    label: string
    data: {
      year: number
      value: number
    }[]
  }[]
}

interface DemographicDatas {
  prefCode: number
  data: YearlyPopulation
}

export default function MyApp() {
  const [arrayOfPrefecture, setListOfPrefecture] = useState<
    PrefecturesData[] | null
  >(null)
  const [checkedPrefectures, setCheckedPrefectures] = useState<{
    [key: string]: boolean
  }>({})
  const [demographics, setDemographics] = useState<DemographicDatas[]>([])

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
    const prefCode: number = Number(e.target.value)
    if (e.target.checked) {
      axios
        .get(
          `${RESAS_BASEURL}api/v1/population/composition/perYear?cityCode=-&prefCode=${e.target.value}`,
          {
            headers: { 'X-API-KEY': process.env.REACT_APP_RESAS_KEY }
          }
        )
        .then((res) => {
          setDemographics((prevData: DemographicDatas[]) => [
            ...prevData,
            { prefCode, data: res.data.result }
          ])
        })
    } else {
      setDemographics((prevData: DemographicDatas[]) =>
        prevData.filter((item) => item.prefCode !== prefCode)
      )
    }
  }
  return (
    <div>
      {arrayOfPrefecture
        ? arrayOfPrefecture.map((prefecture) => {
            const filteredData = demographics.filter(
              (item: DemographicDatas) => item.prefCode === prefecture.prefCode
            )

            const array: YearlyPopulation[] = filteredData.map(
              (item: DemographicDatas) => item.data
            )

            return (
              <div key={prefecture.prefCode}>
                <input
                  id={prefecture.prefCode.toString()}
                  type="checkbox"
                  value={prefecture.prefCode}
                  onChange={onChange}
                />
                <label htmlFor={prefecture.prefName}>
                  {prefecture.prefName}
                </label>
                {demographics.find(
                  (item: DemographicDatas) =>
                    item.prefCode === prefecture.prefCode
                ) && (
                  <YearlyPopulationChart
                    demographicDatas={array[0].data[0].data}
                  />
                )}
              </div>
            )
          })
        : 'Loading...'}
    </div>
  )
}
