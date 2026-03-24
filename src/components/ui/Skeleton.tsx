"use client";

interface SkeletonProps {
  variant?: "card" | "row" | "chart" | "text";
  width?: string;
  height?: string;
  className?: string;
}

export function Skeleton({
  variant = "card",
  width = "100%",
  height = "100%",
  className = "",
}: SkeletonProps) {
  const baseClass = "bg-[#E8E0EC] rounded-lg animate-pulse";

  const variantClasses = {
    card: "w-full h-32",
    row: "w-full h-12",
    chart: "w-full h-64",
    text: "w-48 h-4",
  };

  const selectedHeight =
    height !== "100%" ? height : variantClasses[variant].split(" ")[1];
  const selectedWidth = width !== "100%" ? width : "w-full";

  return (
    <div
      className={`${baseClass} ${selectedWidth} ${selectedHeight} ${className}`}
      style={{
        width: width !== "100%" ? width : undefined,
        height: height !== "100%" ? height : undefined,
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4">
      <Skeleton variant="text" width="120px" height="16px" />
      <Skeleton variant="text" width="180px" height="24px" />
      <Skeleton variant="text" width="100px" height="14px" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="glass-card p-6 space-y-4">
      <Skeleton variant="row" height="40px" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} variant="row" height="48px" />
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return <Skeleton variant="chart" />;
}
