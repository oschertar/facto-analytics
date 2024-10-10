export interface Metric {
  id?: number;
  created_at?: string;
  name?: string;
  value?: string | number;
  props?: string;
  account?: string | number;
}

export interface Statistics {
  max: {
    value: number;
    date: string;
    name: string;
  };
  min: {
    value: number;
    date: string;
    name: string;
  };
  average: number | null;
  total: number;
  name: string;
}

export interface MetricResponse {
  results: Metric[];
  statistics: Statistics;
}

export interface DataResponseItem {
  created_at: string;
  [key: string]: string | number;
}
