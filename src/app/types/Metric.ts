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
  };
  min: {
    value: number;
    date: string;
  };
  average: number | null;
  total: number;
  name: string;
}

export interface MetricResponse {
  results: Metric[];
  statistics: Statistics;
}
