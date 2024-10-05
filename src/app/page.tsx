'use client';

import { useCallback, useEffect, useState } from 'react';
import { Box, Button, Spinner, Text, Input, Flex, Stat, StatLabel, StatNumber, StatHelpText, HStack } from '@chakra-ui/react';
import { MetricResponse } from './types/Metric';
import LineChartCustom from './components/LineChartCustom';
import {
  AsyncSelect,
} from "chakra-react-select";
import { SelectOption } from './types/SelectOption';

const Dashboard = () => {
  const [data, setData] = useState<MetricResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterName, setFilterName] = useState<string[]>([]);
  const [typeNames, setTypeNames] = useState<SelectOption[]>([]);

  const fetchTypeNames = async () => {
    const response = await fetch('/api/getNameMetrics');
    const result = await response.json();
    setTypeNames(result);
    setLoading(false);

  };

  const fetchData = useCallback(async () => {
    // setLoading(true);

    const paramsQuery = new URLSearchParams({});

    try {
      const query = '/api/getMetrics';

      if (fromDate) {
        paramsQuery.set('from', fromDate);
      }
      if (toDate) {
        paramsQuery.set('to', toDate);
      }
      if (filterName) {
        paramsQuery.set('name', filterName.join(','));
      }

      const response = await fetch(`${query}?${paramsQuery.toString()}`);
      const result = await response.json();

      if (response.ok) {
        setData(result);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      //setLoading(false);
    }
  }, [fromDate, toDate, filterName]);

  const handleSubmit = () => {
    if (filterName) {
      fetchData();
    }
  };

  useEffect(() => {
    fetchTypeNames();
  }, []);




  if (loading) return <Spinner />;

  return (
    <Box p="4" overflow='visible'>
      <Text fontSize="xl" mb="4">Home Page</Text>
      <Flex mb="4" alignItems="flex-end" gap={4}>
        <Box>
          <Text>From Date:</Text>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={toDate}
          />
        </Box>
        <Box>
          <Text>To Date:</Text>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate}
          />
        </Box>
        {typeNames.length ? (
          <Box>
            <Text>Type:</Text>
            <AsyncSelect
              useBasicStyles
              selectedOptionStyle="check"
              isMulti
              defaultOptions={typeNames}
              name="events"
              placeholder="Select some events..."
              closeMenuOnSelect={false}
              loadOptions={(inputValue, callback) => {
                const values = typeNames.filter((i) =>
                  i.label.toLowerCase().includes(inputValue.toLowerCase())
                );
                if (values.length <= 5) {
                  callback(values);
                }
              }}
              onChange={(selectedOptions) => {
                setFilterName(selectedOptions.map((option) => option.value));
              }}
            />
          </Box>
        ) : null}
        <Button onClick={handleSubmit} colorScheme="blue">
          Submit
        </Button>
      </Flex>

      {data?.results.length ?
        <Box gap={4}>
          <HStack gap={4} wrap={'wrap'}>
            <Stat>
              <StatLabel>Highest number of {data.statistics.name}</StatLabel>
              <StatNumber>{data.statistics.max.value}</StatNumber>
              <StatHelpText>{data.statistics.max.date}</StatHelpText>
            </Stat>


            <Stat>
              <StatLabel>Lowest number of {data.statistics.name}</StatLabel>
              <StatNumber>{data.statistics.min.value}</StatNumber>
              <StatHelpText>{data.statistics.min.date}</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Average {data.statistics.name}</StatLabel>
              <StatNumber>{data.statistics.average}</StatNumber>
              <StatHelpText>In this period </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Total {data.statistics.name}</StatLabel>
              <StatNumber>{data.statistics.total}</StatNumber>
              <StatHelpText>In this period</StatHelpText>
            </Stat>

          </HStack>
          <h3>{data.statistics.name} along this period</h3>
          <LineChartCustom data={data.results} />

        </Box>

        : <Text>No data found. Use the filters to search for data.</Text>

      }



    </Box>
  );
};

export default Dashboard;
