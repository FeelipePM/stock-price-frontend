import React from 'react'
import { Box, Stat, StatLabel, StatNumber } from '@chakra-ui/react'
interface StatsCardProps {
  title: string
  stat: string
}

function StatsCard({ title, stat }: StatsCardProps): JSX.Element {
  return (
    <Box maxW="7xl" mx="auto" pt={5} px={2}>
      <Stat
        px={{ base: 4, md: 8 }}
        py={5}
        shadow="xl"
        border="1px solid"
        borderColor="gray.800"
        rounded="lg"
      >
        <StatLabel textTransform="uppercase" fontWeight="medium">
          {title}
        </StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold">
          {stat}
        </StatNumber>
      </Stat>
    </Box>
  )
}

export default StatsCard
