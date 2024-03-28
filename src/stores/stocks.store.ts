import { create } from 'zustand'
import stocksService from '../services/stocks.service'

interface TimeSeriesResponse {
  symbol: string
  lastDate: string
  closeValue: number
  openValue: number
  highValue: number
  historicalValues: [
    {
      date: string
      close: number
    },
  ]
}

interface CustomError {
  response: {
    data: {
      message: string
    }
  }
}

interface StocksStore {
  stocks: TimeSeriesResponse[]
  symbols: string[]
  loading: boolean
  error: CustomError | null
  showMessage: boolean
  getStocks: (
    symbol: string,
    initialDate: Date,
    finalDate: Date,
  ) => Promise<void>
  getAllSymbols: () => Promise<string[]>
  hideMessage: () => void
  removeError: () => void
}

export const useStocks = create<StocksStore>((set, get) => ({
  stocks: [] as TimeSeriesResponse[],
  symbols: [] as string[],
  loading: false,
  error: null,
  showMessage: false,

  getStocks: async (symbol: string, initialDate: Date, finalDate: Date) => {
    set({ loading: true })
    try {
      const response = await stocksService.getStocks(
        symbol,
        initialDate,
        finalDate,
      )
      set({ stocks: response })
    } catch (error) {
      set({ error: error as CustomError })
      set({ showMessage: true })
    } finally {
      set({ loading: false })
    }
  },

  getAllSymbols: async () => {
    set({ loading: true })
    try {
      const response = await stocksService.getAllSymbols()
      set({ symbols: response })
      return response
    } catch (error) {
      set({ error: error as CustomError })
      set({ showMessage: true })
    } finally {
      set({ loading: false })
    }
  },

  hideMessage: () => {
    set({ showMessage: false })
  },

  removeError: () => {
    set({ error: null })
  },
}))
