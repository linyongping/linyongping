import { Otp } from "@/components/otp/Otp";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Sub() {
  const [hide, setHide] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ["config"],
    queryFn: async () => {
      const yamlConfig = await fetch("/api/sub");
      const data = await yamlConfig.text();
      return data;
    },
    enabled: !hide,
  });

  const onCopy = (data?: string) => {
    if (!data) return;
    navigator.clipboard.writeText(data);
  };

  if (hide) {
    return <Otp />;
  }

  return (
    <section>
      {isLoading && <p>Loading...</p>}
      <Button variant="outline" onClick={() => onCopy(data)}>
        Copy config
      </Button>
      <pre>{data}</pre>
    </section>
  );
}
