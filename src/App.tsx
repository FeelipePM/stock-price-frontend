import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import IndexPage from './pages'

function App(): JSX.Element {
  return (
    <div>
      <ChakraProvider>
        <IndexPage />
      </ChakraProvider>
    </div>
  )
}

export default App
