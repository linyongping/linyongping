import React from "react";
import Image from "next/image";

async function getData(): Promise<{
  monthly_bw_limit_b: number;
  bw_counter_b: number;
  bw_reset_day_of_month: number;
}> {
  const res = await fetch(
    "https://justmysocks6.net/members/getbwcounter.php?service=1005699&id=60886f48-f5d7-4787-87af-5f172b056cfe"
  );
  return res.json();
}

const ProgressBar = ({
  total = 0,
  progress = 0,
}: {
  total?: number;
  progress?: number;
}) => {
  // Calculate the width percentage of the progress
  const progressPercentage = (progress / total) * 100;

  const progressBarStyle = {
    width: `${progressPercentage}%`,
    height: "100%",
    background:
      progressPercentage > 85
        ? "linear-gradient(90deg, red, darkred)"
        : "linear-gradient(90deg, #00ffff, #007f7f)",
    boxShadow:
      progressPercentage > 85
        ? "0 0 10px red, 0 0 20px red, 0 0 30px red"
        : "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff",
  };

  return (
    <div className="w-full bg-black rounded overflow-hidden h-5 border border-gray-600">
      <div className="h-full bg-cyan-400" style={progressBarStyle}></div>
    </div>
  );
};

const GB = 1000 * 1000 * 1000;

// To calculate how many days are left from the current day to the next month's specific day using JavaScript in a browser environment,
function getDaysLeft(specificDay: number) {
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

export default async function Home() {
  const data = await getData();
  const totalData = data.monthly_bw_limit_b / GB;
  const usedData = data.bw_counter_b / GB;
  const today = new Date();
  const nextResetDay = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    data.bw_reset_day_of_month
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"></p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:text-left">
        <p>Total: {totalData} GB</p>
        <p>Used: {usedData.toFixed(2)} GB</p>
        <p>Remaining: {(totalData - usedData).toFixed(2)} GB</p>
        <p>Next month reset day: {nextResetDay.toISOString()}</p>
        <p>
          Left days to next reset: {getDaysLeft(data.bw_reset_day_of_month)}{" "}
          days
        </p>
        <ProgressBar total={totalData} progress={usedData} />
      </div>
    </main>
  );
}
