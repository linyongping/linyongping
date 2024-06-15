"use client";

import React from "react";
import { ProgressBar } from "./ProgressBar";
import { useQuery } from "@tanstack/react-query";

const GB = 1000 * 1000 * 1000;

function getDaysLeft(specificDay: number = 0) {
  const today = new Date();
  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    specificDay
  );
  const timeLeft = nextMonth.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  return daysLeft;
}

export const UsageDetails = ({
  initialData,
}: {
  initialData: {
    monthly_bw_limit_b: number;
    bw_counter_b: number;
    bw_reset_day_of_month: number;
  };
}) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["data"],
    queryFn: () => {
      return fetch("/api/proxyDataUsage").then((res) => res.json());
    },
  });

  const { monthly_bw_limit_b, bw_counter_b, bw_reset_day_of_month } =
    initialData;
  const totalData = monthly_bw_limit_b / GB;
  const usedData = bw_counter_b / GB;
  const today = new Date();
  const nextResetDay = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    bw_reset_day_of_month
  );

  return (
    <div className="mb-32 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:text-left">
      <p>Total: {totalData} GB</p>
      <p>Used: {usedData.toFixed(2)} GB</p>
      <p>Remaining: {(totalData - usedData).toFixed(2)} GB</p>
      <p>Next month reset day: {nextResetDay.toISOString()}</p>
      <p>
        Left days to next reset: {getDaysLeft(bw_reset_day_of_month)} days
      </p>
      <br />
      <ProgressBar total={totalData} progress={usedData} />
      <button
        onClick={() =>refetch()}
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
      >
        {isFetching ? "Refreshing..." : "Refresh"}
      </button>

      <p>{ data && data}</p>
    </div>
  );
};
