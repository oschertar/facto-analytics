'use client';

import { useCallback, useEffect, useState } from 'react';
import { Box, Button, Spinner, Text, Input, Flex, Stat, StatLabel, StatNumber, StatHelpText, HStack, useToast } from '@chakra-ui/react';
import { MetricResponse } from './types/Metric';
import LineChartCustom from './components/LineChartCustom';
import {
  AsyncSelect,
} from "chakra-react-select";
import { SelectOption } from './types/SelectOption';
import DetailsDateSelected from './components/DetailsDateSelected';
import { COLORS } from './types/Constants';

const LIMIT_OPTIONS = COLORS.length

const Dashboard = () => {
  const [data, setData] = useState<MetricResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterName, setFilterName] = useState<string[]>([]);
  const [typeNames, setTypeNames] = useState<SelectOption[]>([]);
  const [dataSelected, setDataSelected] = useState<[]>([]);
  const toast = useToast();


  const fetchTypeNames = async () => {
    const response = await fetch('/api/getNameMetrics');
    const result = await response.json();
    setTypeNames(result);
    setLoading(false);

  };

  const fetchData = useCallback(async () => {
    setLoading(true);

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
      setLoading(false);
    }
  }, [fromDate, toDate, filterName]);

  const handleSubmit = () => {
    if (filterName) {
      fetchData();
      setDataSelected([])
    }
  };

  useEffect(() => {
    fetchTypeNames();
  }, []);

  const customComponentsSelect = {
    Input: (props) => (
      <Box>
        {filterName.length > 0 && (
          <Box style={{ padding: '8px', fontWeight: 'bold' }}>
            <Text>{filterName.length} option{filterName.length > 1 ? 's' : ''} selected</Text>
          </Box>
        )}
      </Box>
    ),
    MultiValue: () => {
      return (<></>);
    },
  };


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
                callback(values);
              }}
              onChange={(selectedOptions) => {
                if (selectedOptions.length > LIMIT_OPTIONS) {
                  toast({
                    title: `Max options selected ${LIMIT_OPTIONS}.`,
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                  });
                  return;
                }
                setFilterName(selectedOptions.map((option) => option.value));
              }}
              hideSelectedOptions={false}
              isClearable={true}
              components={customComponentsSelect}
            />
          </Box>
        ) : null}
        <Button onClick={handleSubmit} colorScheme="blue" type="submit">
          Submit
        </Button>
      </Flex>

      {data?.results.length ?
        <Box gap={4}>
          <Text fontSize={'3xl'} fontWeight={"bold"} mt={4} mb={4}>Data along this period</Text>
          <HStack gap={4} wrap={'wrap'} mb={4}>
            <Stat>
              <StatLabel>Highest number of {data.statistics.max.name}</StatLabel>
              <StatNumber>{data.statistics.max.value}</StatNumber>
              <StatHelpText>{data.statistics.max.date}</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Lowest number of {data.statistics.min.name}</StatLabel>
              <StatNumber>{data.statistics.min.value}</StatNumber>
              <StatHelpText>{data.statistics.min.date}</StatHelpText>
            </Stat>
          </HStack>
          <LineChartCustom data={data.results} setDataSelected={setDataSelected} />
        </Box>
        : <Text>No data found. Use the filters to search for data.</Text>
      }

      <DetailsDateSelected data={dataSelected} />
      {loading ? <Spinner /> : null}
    </Box>
  );
};

export default Dashboard;
