import { useState } from "react";
import { Config } from "../types/Config";

export function useConfigApi() {
  const [configs, setConfigs] = useState<Config[]>([]);

  const getAccountsAvailables = async () => {
    const response = await fetch("/api/config?showAll=true");
    const result = await response.json();
    setConfigs(result.data);
    return result;
  };

  const updateConfig = async (config: Config) => {
    const response = await fetch("/api/config", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: config.id,
        enabled: !config.enabled,
      }),
    });
    const result = await response.json();
    if (!result.error) {
      setConfigs((prevConfigs) =>
        prevConfigs.map((prevConfig) =>
          prevConfig.id === config.id
            ? { ...prevConfig, enabled: !config.enabled }
            : prevConfig
        )
      );
    }
    return result;
  };

  const createAccount = async (name: string) => {
    const response = await fetch("/api/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        enabled: true,
      }),
    });
    const result = await response.json();
    if (!result.error) {
      setConfigs((prevConfigs) => [...prevConfigs, result.data]);
    }
    return result;
  };

  return { configs, getAccountsAvailables, updateConfig, createAccount };
}
