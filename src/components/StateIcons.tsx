interface StateIconProps {
  className?: string;
}

export function SouthCarolinaIcon({ className = "h-4 w-4" }: StateIconProps) {
  return (
    <svg viewBox="0 0 100 80" className={className} fill="currentColor">
      <path d="M15,25 L25,20 L35,18 L45,15 L55,12 L65,10 L75,8 L85,12 L90,18 L92,25 L95,35 L92,45 L88,52 L85,58 L80,62 L75,65 L70,68 L65,70 L60,72 L55,70 L50,68 L45,65 L40,62 L35,58 L30,52 L25,45 L20,35 L15,25 Z" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none" />
    </svg>
  );
}

export function MassachusettsIcon({ className = "h-4 w-4" }: StateIconProps) {
  return (
    <svg viewBox="0 0 100 60" className={className} fill="currentColor">
      <path d="M5,35 L15,30 L25,28 L35,25 L45,22 L55,20 L65,18 L75,20 L85,22 L92,25 L95,30 L92,35 L88,40 L85,45 L80,48 L75,50 L70,52 L65,50 L60,48 L55,45 L50,42 L45,40 L40,38 L35,40 L30,42 L25,45 L20,48 L15,50 L10,48 L8,45 L5,40 L5,35 Z" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none" />
      <path d="M85,20 L88,15 L92,12 L95,15 L92,18 L88,20 L85,20 Z" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none" />
    </svg>
  );
}

export function CaliforniaIcon({ className = "h-4 w-4" }: StateIconProps) {
  return (
    <svg viewBox="0 0 60 100" className={className} fill="currentColor">
      <path d="M15,10 L20,8 L25,5 L30,8 L35,12 L40,18 L42,25 L45,32 L48,40 L50,48 L52,55 L50,62 L48,68 L45,75 L42,82 L38,88 L35,92 L30,95 L25,92 L20,88 L15,82 L12,75 L10,68 L8,62 L5,55 L8,48 L10,40 L12,32 L15,25 L18,18 L15,10 Z" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none" />
    </svg>
  );
}

export function getStateIcon(state: string, className?: string) {
  switch (state) {
    case 'SC':
      return <SouthCarolinaIcon className={className} />;
    case 'MA':
      return <MassachusettsIcon className={className} />;
    case 'CA':
      return <CaliforniaIcon className={className} />;
    default:
      return <span className={className}>📍</span>;
  }
}