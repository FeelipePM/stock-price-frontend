import React from 'react'
import { Line } from 'react-chartjs-2'

interface DataSetsProps {
  label: string
  data: number[]
  fill: boolean
  borderColor: string
  tension: number
}

interface DataProps {
  labels: string[]
  datasets: DataSetsProps[]
}

interface LineChartProps {
  data: DataProps
}

function LineChart({ data }: LineChartProps): JSX.Element {
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Cotação de ativos',
      },
      legend: {
        display: true,
      },
    },
  }
  return (
    <>
      <Line data={data} options={options} />
    </>
  )
}

export default LineChart
