const baseSvgProps = {
  className: 'h-5 w-5',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

export const Icons = {
  Home: () => (
    <svg {...baseSvgProps}>
      <path d="M3.5 10.8 12 4l8.5 6.8" />
      <path d="M5.5 9.8V18a1.5 1.5 0 0 0 1.5 1.5h10A1.5 1.5 0 0 0 18.5 18v-8.2" />
      <path d="M10 19.5V14h4v5.5" />
    </svg>
  ),
  Upload: () => (
    <svg {...baseSvgProps}>
      <path d="M12 16V4.5" />
      <path d="m7.5 9 4.5-4.5L16.5 9" />
      <path d="M4 17.5v.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5" />
    </svg>
  ),
  Search: () => (
    <svg {...baseSvgProps}>
      <circle cx="11" cy="11" r="5.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  ),
  Check: () => (
    <svg {...baseSvgProps}>
      <path d="m5.5 12.5 4 4 9-9.5" />
    </svg>
  ),
  CheckCircle: () => (
    <svg {...baseSvgProps}>
      <circle cx="12" cy="12" r="8" />
      <path d="m8.5 12.5 2.2 2.2 4.8-5.2" />
    </svg>
  ),
  Calculator: () => (
    <svg {...baseSvgProps}>
      <rect x="6" y="3.5" width="12" height="17" rx="2.5" />
      <path d="M9 8.2h6M9 12h2.5M13.5 12h1.5M9 15.5h2.5M13.5 15.5h1.5" />
      <path d="M9 18.5h6" />
    </svg>
  ),
  Activity: () => (
    <svg {...baseSvgProps}>
      <path d="M3.5 15.5h3.5l2.1-6 3.1 11 2.3-5.5H20.5" />
    </svg>
  ),
  Alert: () => (
    <svg {...baseSvgProps}>
      <path d="M12 4.5 19.2 17a1.75 1.75 0 0 1-1.5 2.5H6.3A1.75 1.75 0 0 1 4.8 17L12 4.5Z" />
      <path d="M12 9.2v4.2" />
      <path d="M12 16.6h.01" />
    </svg>
  ),
  Warning: () => (
    <svg {...baseSvgProps}>
      <path d="M12 4.5 20 17.3A1.5 1.5 0 0 1 18.7 19.5H5.3A1.5 1.5 0 0 1 4 17.3L12 4.5Z" />
      <path d="M12 8.5v5.2" />
      <path d="M12 16.8h.01" />
    </svg>
  ),
  Siren: () => (
    <svg {...baseSvgProps}>
      <path d="M8.5 15.5h7l-1-7.2a3.5 3.5 0 1 0-5 0l-1 7.2Z" />
      <path d="M10 18.5h4" />
      <path d="M8 20.5h8" />
      <path d="M5.5 10.5c.4-1.3 1.3-2.2 2.6-3" />
      <path d="M18.5 10.5c-.4-1.3-1.3-2.2-2.6-3" />
    </svg>
  ),
  User: () => (
    <svg {...baseSvgProps}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 18.5c1.5-3 4-4.5 6.5-4.5s5 1.5 6.5 4.5" />
    </svg>
  ),
  Calendar: () => (
    <svg {...baseSvgProps}>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
      <path d="M8 3.5v4M16 3.5v4M3.5 9.5h17" />
    </svg>
  ),
  CalendarCheck: () => (
    <svg {...baseSvgProps}>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
      <path d="M8 3.5v4M16 3.5v4M3.5 9.5h17" />
      <path d="m8.5 14.5 2 2 5-6" />
    </svg>
  ),
  UsersFour: () => (
    <svg {...baseSvgProps}>
      <path d="M9 12.2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M4.5 18c.6-2.3 2.5-3.8 4.8-3.8 1.8 0 3.4 1 4.2 2.5" />
      <path d="M13.5 18c.6-2 2-3.2 4-3.2 1.7 0 3.2 1 4 2.3" />
    </svg>
  ),
  TrendUp: () => (
    <svg {...baseSvgProps}>
      <path d="M4 16 9.5 10.5l3.5 3.5 7-7" />
      <path d="M14.5 7H20v5.5" />
    </svg>
  ),
  HandArrowDown: () => (
    <svg {...baseSvgProps}>
      <path d="M9.5 6.5V15l-2.3-2.3-1.4 1.4L12 20.5l6.2-6.4-1.4-1.4-2.3 2.3V6.5" />
      <path d="M9.5 4.5h5" />
    </svg>
  ),
  Eye: () => (
    <svg {...baseSvgProps}>
      <path d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12s-3.6 6.5-9.5 6.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  ChevronRight: () => (
    <svg {...baseSvgProps}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  ),
  Logout: () => (
    <svg {...baseSvgProps}>
      <path d="M9 18.5H6.5A2.5 2.5 0 0 1 4 16V8a2.5 2.5 0 0 1 2.5-2.5H9" />
      <path d="m14 7 5 5-5 5" />
      <path d="M19 12H9" />
    </svg>
  ),
}
