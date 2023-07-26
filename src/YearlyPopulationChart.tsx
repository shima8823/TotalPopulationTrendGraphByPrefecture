import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

interface DemographicData {
  year: number
  value: number
}

interface Props {
  demographicDatas: DemographicData[]
}

export default function YearlyPopulationChart(props: Props) {
  const { demographicDatas } = props
  return (
    <LineChart
      width={500}
      height={300}
      data={demographicDatas}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis dataKey="year" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  )
}
