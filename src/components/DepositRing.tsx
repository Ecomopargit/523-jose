type DepositRingProps = {
  days: number;
  maxDays?: number;
};

export default function DepositRing({ days, maxDays = 30 }: DepositRingProps) {
  const circumference = 2 * Math.PI * 44;
  const progress = Math.min(days / maxDays, 1);
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="104" height="104" viewBox="0 0 104 104" aria-hidden="true">
        <circle
          cx="52"
          cy="52"
          r="44"
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="10"
        />
        <circle
          cx="52"
          cy="52"
          r="44"
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 52 52)"
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3AB689" />
            <stop offset="100%" stopColor="#C68A3D" />
          </linearGradient>
        </defs>
        <text
          x="52"
          y="49"
          textAnchor="middle"
          fill="#fff"
          className="font-display"
          fontWeight="700"
          fontSize="20"
        >
          {days}
        </text>
        <text
          x="52"
          y="66"
          textAnchor="middle"
          fill="rgba(255,255,255,0.6)"
          fontSize="9.5"
        >
          dias seguidos
        </text>
      </svg>
      <p className="font-display text-[13px] text-white font-semibold mt-1">
        {days === 0 ? "Comece hoje" : `${days} dias ativos`}
      </p>
      <p className="text-[11px] text-white/50">sua sequência de depósitos</p>
    </div>
  );
}
