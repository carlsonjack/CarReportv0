export default function CarReportLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M170 90c0-5.523-4.477-10-10-10H40c-5.523 0-10 4.477-10 10v30c0 5.523 4.477 10 10 10h120c5.523 0 10-4.477 10-10V90z"
        fill="url(#paint0_linear)"
        fillOpacity="0.8"
      />
      <path
        d="M50 130v20c0 5.523 4.477 10 10 10h10c5.523 0 10-4.477 10-10v-10M120 130v20c0 5.523 4.477 10 10 10h10c5.523 0 10-4.477 10-10v-10"
        stroke="url(#paint1_linear)"
        strokeWidth="15"
        strokeLinecap="round"
      />
      <path
        d="M30 90L10 90c-5.523 0-10 4.477-10 10v10c0 5.523 4.477 10 10 10h20M170 90l20 0c5.523 0 10 4.477 10 10v10c0 5.523-4.477 10-10 10h-20"
        stroke="url(#paint2_linear)"
        strokeWidth="15"
        strokeLinecap="round"
      />
      <circle cx="60" cy="100" r="10" stroke="#E0F7FA" strokeWidth="2" />
      <circle cx="140" cy="100" r="10" stroke="#E0F7FA" strokeWidth="2" />
      <path d="M100 40L150 90L100 140L50 90L100 40Z" fill="url(#paint3_linear)" fillOpacity="0.9" />
      <path d="M100 70L130 100L100 130L70 100L100 70Z" fill="white" fillOpacity="0.3" />
      <defs>
        <linearGradient id="paint0_linear" x1="30" y1="90" x2="170" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4FC3F7" />
          <stop offset="1" stopColor="#29B6F6" />
        </linearGradient>
        <linearGradient id="paint1_linear" x1="50" y1="130" x2="150" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4FC3F7" />
          <stop offset="1" stopColor="#29B6F6" />
        </linearGradient>
        <linearGradient id="paint2_linear" x1="0" y1="90" x2="200" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4FC3F7" />
          <stop offset="1" stopColor="#29B6F6" />
        </linearGradient>
        <linearGradient id="paint3_linear" x1="50" y1="40" x2="150" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4FC3F7" />
          <stop offset="1" stopColor="#29B6F6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

