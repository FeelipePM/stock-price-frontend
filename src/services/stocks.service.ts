import axios from 'axios'

const api = axios.create({
  baseURL: `${process.env.REACT_APP_PUBLIC_URL}` ?? 'http://localhost:8080/',
})

const getStocks = async (
  symbol: string,
  initialDate: Date,
  finalDate: Date,
): Promise<any> => {
  const response = await api.post(`/time-series/${symbol}`, {
    initialDate,
    finalDate,
  })
  return response.data
}

const getAllSymbols = async (): Promise<any> => {
  const response = await api.get('/time-series/symbols')
  return response.data
}

const stocksService = {
  getStocks,
  getAllSymbols,
}

export default stocksService
