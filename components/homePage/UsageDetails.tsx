"use client";

import React from "react";
import { ProgressBar } from "./ProgressBar";
import { useQuery } from "@tanstack/react-query";
import { DataUsageDetails } from "@/lib/dataFetcher";

const GB = 1000 * 1000 * 1000;

function getDaysLeft(specificDay: number = 0) {
  const today = new Date();
  const nextResetDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    specificDay
  );
  if (today.getDate() >= specificDay) {
    nextResetDay.setMonth(nextResetDay.getMonth() + 1);
  }
  const timeLeft = nextResetDay.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  return daysLeft;
}

export const UsageDetails = ({
  initialData,
}: {
  initialData: DataUsageDetails;
}) => {
  const { data, isFetching, refetch } = useQuery<DataUsageDetails>({
    queryKey: ["data"],
    queryFn: () => {
      return fetch("/api/proxyDataUsage", {
        method: "POST",
      }).then((res) => res.json());
    },
  });

  const { monthly_bw_limit_b, bw_counter_b, bw_reset_day_of_month } =
    initialData;
  const totalData = (data?.monthly_bw_limit_b ?? monthly_bw_limit_b) / GB;
  const usedData = (data?.bw_counter_b ?? bw_counter_b) / GB;
  const today = new Date();
  let nextResetDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    data?.bw_reset_day_of_month ?? bw_reset_day_of_month
  );

  if (today.getDate() >= (data?.bw_reset_day_of_month ?? bw_reset_day_of_month)) {
    nextResetDay.setMonth(nextResetDay.getMonth() + 1);
  }

  return (
    <div className="mb-32 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:text-left">
      <p>Total: {totalData} GB</p>
      <p>Used: {usedData.toFixed(2)} GB</p>
      <p>Remaining: {(totalData - usedData).toFixed(2)} GB</p>
      <p>Next reset: {nextResetDay.toDateString()}</p>
      <p>Left days: {getDaysLeft(bw_reset_day_of_month)} days</p>
      <br />
      <ProgressBar total={totalData} progress={usedData} />
      <button
        onClick={() => refetch()}
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
      >
        {isFetching ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
};
