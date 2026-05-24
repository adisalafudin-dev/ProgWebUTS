const iconPaths = {
  home:       'M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5Z',
  bookOpen:   'M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5Zm16 0A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z',
  info:       'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm-1-11h2v7h-2v-7Zm0-4h2v2h-2V7Z',
  search:     'M10.5 18a7.5 7.5 0 1 1 5.3-12.8A7.5 7.5 0 0 1 10.5 18Zm5.8-1.7L21 21',
  eye:        'M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  collection: 'M5 4h14v3H5V4Zm0 6h14v3H5v-3Zm0 6h14v4H5v-4Z',
  users:      'M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2 21a6 6 0 0 1 12 0H2Zm11.5 0a6.5 6.5 0 0 1 8.5-6.2V21h-8.5Z',
  tag:        'M4 4h7l9 9-7 7-9-9V4Zm4 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  star:       'm12 2 2.9 6.4 7 .8-5.2 4.7 1.4 6.9-6.1-3.5-6.1 3.5 1.4-6.9L2.1 9.2l7-.8L12 2Z',
  bookmark:   'M6 3h12v19l-6-3.5L6 22V3Z',
  check:      'M5 13l4 4L19 7',
  close:      'M6 6l12 12M18 6 6 18',
  moon:       'M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z',
  sun:        'M12 4V2m0 20v-2m8-8h2M2 12h2m14.4-6.4 1.4-1.4M4.2 19.8l1.4-1.4m0-12.8L4.2 4.2m15.6 15.6-1.4-1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  filter:     'M4 5h16l-6 7v6l-4 2v-8L4 5Z',
  cloud:      'M7 18h10a4 4 0 0 0 .6-8A6 6 0 0 0 6.2 8.2 5 5 0 0 0 7 18Z',
  database:   'M5 6c0-2 14-2 14 0s-14 2-14 0Zm0 0v6c0 2 14 2 14 0V6M5 12v6c0 2 14 2 14 0v-6',
  compass:    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm4-14-2.2 5.8L8 16l2.2-5.8L16 8Z',
  globe:      'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0 0c2.2-2.4 3.5-6 3.5-10S14.2 4.4 12 2m0 20c-2.2-2.4-3.5-6-3.5-10S9.8 4.4 12 2M3 12h18',
  heart:      'M12 21s-8-4.7-8-11a4.8 4.8 0 0 1 8-3.6A4.8 4.8 0 0 1 20 10c0 6.3-8 11-8 11Z',
  flask:      'M9 3h6M10 3v5l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V3',
  pen:        'M4 20h4L19 9l-4-4L4 16v4Zm10-14 4 4',
  monitor:    'M4 5h16v11H4V5Zm5 15h6m-3-4v4',
  scroll:     'M7 4h10a3 3 0 0 1 3 3v11H8a3 3 0 0 1-3-3V6a2 2 0 0 0-2 2v9a3 3 0 0 0 3 3h12',
}

export default function Icon({ name, className = 'w-5 h-5', strokeWidth = 1.8 }) {
  const path = iconPaths[name] || iconPaths.bookOpen
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}
