import { useCountUp } from "../hooks/useCountUp";

interface Props {
  end: number;
  className?: string;
  suffix?: string;
}

export default function AnimatedCounter({ end, className = "", suffix = "" }: Props) {
  const { count, ref } = useCountUp(end);
  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
}
