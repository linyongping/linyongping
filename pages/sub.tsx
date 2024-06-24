"use client";

import { useQuery } from "@tanstack/react-query";

export default function Sub() {
  const { data, isLoading } = useQuery({
    queryKey: ["sub"],
    queryFn: () => {
      return fetch("/api/sub").then((res) => res.json());
    },
  });

  return (
    <div>
      <h1>Sub Page</h1>
      {isLoading ? <div>Loading...</div> : null}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
