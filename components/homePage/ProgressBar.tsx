export const ProgressBar = ({
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
