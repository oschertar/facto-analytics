'use client';

import { useCallback, useEffect, useState } from 'react';
import { Box, Button, Spinner, Text, Input, Flex, Stat, StatLabel, StatNumber, StatHelpText, HStack, useToast, Select } from '@chakra-ui/react';
import { MetricResponse } from './types/Metric';
import LineChartCustom from './components/LineChartCustom';
import {
  AsyncSelect,
} from "chakra-react-select";
import { SelectOption } from './types/SelectOption';
import DetailsDateSelected from './components/DetailsDateSelected';
import { COLORS } from './types/Constants';
import { Config } from './types/Config';

const LIMIT_OPTIONS = COLORS.length

const Dashboard = () => {
  const [data, setData] = useState<MetricResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterName, setFilterName] = useState<string[]>([]);
  const [typeNames, setTypeNames] = useState<SelectOption[]>([]);
  const [dataSelected, setDataSelected] = useState<[]>([]);
  const [configs, setConfigs] = useState<Config[]>([]);
  const [configSelected, setConfigSelected] = useState<string>('');
  const toast = useToast();


  const fetchTypeNames = async () => {
    const response = await fetch('/api/getNameMetrics');
    const result = await response.json();
    setTypeNames(result);
    setLoading(false);
  };

  const getAccountsAvailables = async () => {
    const response = await fetch('/api/config');
    const result = await response.json();
    setConfigs(result.data);
  }

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfigSelected(e.target.value);
  };


  const fetchData = useCallback(async () => {
    setLoading(true);

    const paramsQuery = new URLSearchParams({});

    try {
      const query = '/api/metrics';

      if (fromDate) {
        paramsQuery.set('from', fromDate);
      }
      if (toDate) {
        paramsQuery.set('to', toDate);
      }
      if (filterName) {
        paramsQuery.set('name', filterName.join(','));
      }
      if (configSelected) {
        paramsQuery.set('account', configSelected);
      }

      const response = await fetch(`${query}?${paramsQuery.toString()}`);

      const result = await response.json();

      if (response.status === 200 && result.message === "Data not found for this account") {
        toast({
          title: "No data found for this account",
          status: "warning",
          duration: 3000,
        });
        setData(null);
        return null;
      }

      if (!response.ok && response.status !== 200) {
        throw new Error('Error fetching data');
      }

      setData(result);
    } catch (error) {
      setData(null);
      toast({
        title: "Error fetching data. All fields are required.",
        status: "error",
        duration: 3000,
      });
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, filterName, configSelected, toast]);

  const handleSubmit = () => {
    if (filterName) {
      fetchData();
      setDataSelected([])
    }
  };

  useEffect(() => {
    fetchTypeNames();
    getAccountsAvailables();
  }, []);

  const customComponentsSelect = {
    Input: () => (
      <Box>
        {filterName.length > 0 && (
          <Box style={{ fontWeight: 'bold' }}>
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
        {configs.length ? (
          <Box>
            <Select value={configSelected} onChange={(ev) => handleChangeSelect(ev)} required>
              <option value="">Select an account</option>
              {configs.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.name}
                </option>
              ))}
            </Select>
          </Box>
        ) : null}
        {typeNames.length ? (
          <Box>
            <Text>Type:</Text>
            <AsyncSelect
              useBasicStyles
              selectedOptionStyle="check"
              isMulti
              defaultOptions={typeNames}
              className="select-events"
              name="events"
              placeholder="Select some events..."
              closeMenuOnSelect={false}
              isOptionDisabled={() => filterName.length >= LIMIT_OPTIONS}
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

      {loading ? <Spinner /> :
        data?.results.length ?
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

              <Stat>
                <StatLabel>Average events per day</StatLabel>
                <StatNumber>{data.statistics.average}</StatNumber>
                <StatHelpText>Average of all metrics</StatHelpText>
              </Stat>
            </HStack>
            <LineChartCustom data={data.results} setDataSelected={setDataSelected} />
            <DetailsDateSelected data={dataSelected} />
          </Box>
          : <Text>No data found. Use the filters to search for data.</Text>



      }
    </Box>
  );
};

export default Dashboard;
