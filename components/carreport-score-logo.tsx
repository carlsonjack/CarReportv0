interface CarReportScoreLogoProps {
  className?: string
  width?: number
  height?: number
}

export default function CarReportScoreLogo({ className = "", width = 180, height = 40 }: CarReportScoreLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 180 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background gauge shape */}
      <path
        d="M20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35Z"
        stroke="#E5E7EB"
        strokeWidth="2"
        fill="white"
      />

      {/* Gauge indicator */}
      <path
        d="M20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5"
        stroke="#2563EB"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Needle */}
      <line x1="20" y1="20" x2="28" y2="12" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />

      {/* Center dot */}
      <circle cx="20" cy="20" r="3" fill="#2563EB" />

      {/* Text elements */}
      <text x="45" y="22" fontFamily="Arial" fontSize="16" fill="#000000">
        Car
      </text>
      <text x="72" y="22" fontFamily="Arial" fontSize="16" fill="#000000">
        Report
      </text>
      <text x="130" y="22" fontFamily="Arial" fontSize="16" fill="#000000">
        Score
      </text>
    </svg>
  )
}

