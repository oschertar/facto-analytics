export interface Metric {
  id?: number;
  created_at?: string;
  name: string;
  value: number;
  props?: string;
  account: number;
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
