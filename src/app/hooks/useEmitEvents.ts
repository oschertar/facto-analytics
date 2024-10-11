import { useState, useEffect } from "react";
import { Metric } from "../types/Metric";
import { Config } from "../types/Config";

const INITIAL_STATE = {
  id: undefined,
  created_at: "",
  name: "",
  value: "",
  props: "",
  account: "",
};

export function useEmitEvents() {
  const [isLoading, setIsLoading] = useState(false);
  const [configs, setConfigs] = useState<Config[]>([]);
  const [formData, setFormData] = useState<Metric>(INITIAL_STATE);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          created_at: formData?.created_at || new Date().toISOString(),
          name: formData?.name,
          value: formData?.value,
          props: formData?.props || null,
          account: formData?.account,
        }),
      });

      const result = await response.json();
      if (!result.error) {
        setFormData(INITIAL_STATE);
      }
      return result;
    } catch (error) {
      console.error("Error:", error);
      return { error: "An unexpected error occurred" };
    } finally {
      setIsLoading(false);
    }
  };

  const getAccountsAvailables = async () => {
    const response = await fetch("/api/config");
    const result = await response.json();
    setConfigs(result.data);
  };

  useEffect(() => {
    getAccountsAvailables();
  }, []);

  return {
    isLoading,
    configs,
    formData,
    handleChange,
    handleSubmit,
    getAccountsAvailables,
  };
}
