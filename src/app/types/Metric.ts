export interface Metric {
  id?: number;
  created_at?: string;
  name: string;
  value: number;
  props?: string;
  account: number;
}
