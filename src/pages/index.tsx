import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { object, string } from 'yup'
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import {
  Container,
  Flex,
  Input,
  FormLabel,
  VStack,
  Button,
  FormControl,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react'
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from '@choc-ui/chakra-autocomplete'
import LineChart from '../components/LineChart'
import { useStocks } from '../stores/stocks.store'

Chart.register(CategoryScale)

interface DataSetsProps {
  label: string
  data: number[]
  fill: boolean
  borderColor: string
  tension: number
}

interface SubmitFormProps {
  symbol: string
  initialDate: Date
  finalDate: Date
}

function IndexPage(): JSX.Element {
  const [symbolsList, setSymbolsList] = useState('')
  const [inputValue, setInputValue] = useState('')
  const toast = useToast()
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: '',
        data: [] as number[],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  })
  const {
    stocks,
    getStocks,
    symbols,
    getAllSymbols,
    loading,
    error,
    removeError,
  } = useStocks()

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        await getAllSymbols()
      } catch (error) {
        console.error('Error fetching symbols:', error)
      }
    }

    fetchSymbols()
  }, [])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Erro',
        description: error.response.data.message,
        position: 'top-right',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      removeError()
    }
  }, [error])

  const colors = ['#ffcd56', '#36a2eb', '#9966ff', '#ff6384']

  useEffect(() => {
    if (stocks) {
      const newChartData = {
        labels: [] as string[],
        datasets: [] as DataSetsProps[],
      }

      stocks.forEach((stock, index) => {
        const borderColor = colors[index % colors.length]
        newChartData.labels = stock.historicalValues.map((value) => value.date)
        newChartData.datasets.push({
          label: stock.symbol,
          data: stock.historicalValues.map((value) => value.close),
          fill: false,
          borderColor,
          tension: 0.5,
        })
      })

      setChartData(newChartData)
    }
  }, [stocks])

  const handleSymbolChange = (symbols: string[]) => {
    let groupedSymbols = ''
    symbols.forEach((symbol: string) => {
      groupedSymbols += symbol + ','
    })

    setSymbolsList(groupedSymbols.slice(0, -1))
    setInputValue('')
  }

  const handleSubmitForm = async (values: SubmitFormProps) => {
    if (!symbolsList)
      return toast({
        title: 'Erro',
        description: 'Selecione uma ação',
        position: 'top-right',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })

    await getStocks(symbolsList, values.initialDate, values.finalDate)
  }

  return (
    <Container maxW="1366px">
      <Formik
        initialValues={{ symbol: '', initialDate: '', finalDate: '' }}
        validationSchema={object({
          initialDate: string().required('Selecione uma data inicial'),
          finalDate: string().required('Selecione uma data final'),
        })}
        onSubmit={async (values) => {
          await handleSubmitForm(
            values as unknown as {
              symbol: string
              initialDate: Date
              finalDate: Date
            },
          )
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Flex gap={4} justifyContent="center" alignItems="center">
              <Flex h="6.438rem" gap={2} justifyContent="center" my={4}>
                <VStack alignItems="start">
                  <FormControl>
                    <FormLabel>Ação</FormLabel>
                    <AutoComplete
                      multiple
                      onChange={(e: string[]) => {
                        handleSymbolChange(e)
                      }}
                    >
                      <AutoCompleteInput
                        placeholder="Digite uma ação"
                        autoComplete="off"
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value)
                        }}
                      >
                        {({ tags }) =>
                          tags.map((tag, tid) => (
                            <AutoCompleteTag
                              key={tid}
                              label={tag.label}
                              onRemove={tag.onRemove}
                            />
                          ))
                        }
                      </AutoCompleteInput>
                      <AutoCompleteList>
                        {symbols.map((symbol, cid) => (
                          <AutoCompleteItem
                            key={`option-${cid}`}
                            value={symbol}
                            textTransform="capitalize"
                          >
                            {symbol}
                          </AutoCompleteItem>
                        ))}
                      </AutoCompleteList>
                    </AutoComplete>
                    <FormErrorMessage>Selecione uma ação</FormErrorMessage>
                  </FormControl>
                </VStack>
                <VStack alignItems="start">
                  <FormControl
                    isInvalid={!!touched.initialDate && !!errors.initialDate}
                  >
                    <FormLabel>Data Inicial</FormLabel>
                    <Input
                      type="date"
                      name="initialDate"
                      onChange={handleChange}
                      value={values.initialDate}
                    />
                    <FormErrorMessage>{errors.initialDate}</FormErrorMessage>
                  </FormControl>
                </VStack>
                <VStack alignItems="start">
                  <FormControl
                    isInvalid={!!touched.finalDate && !!errors.finalDate}
                  >
                    <FormLabel>Data Final</FormLabel>
                    <Input
                      type="date"
                      name="finalDate"
                      onChange={handleChange}
                      value={values.finalDate}
                    />
                    <FormErrorMessage>{errors.finalDate}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </Flex>
              <Button type="submit" isLoading={loading}>
                Buscar
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
      <Container maxW="60rem">
        <LineChart data={chartData} />
      </Container>
    </Container>
  )
}

export default IndexPage
