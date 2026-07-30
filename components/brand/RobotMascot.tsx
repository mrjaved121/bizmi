import { cn } from "@/lib/utils";

type Pose = "waving" | "thinking" | "building";

export function RobotMascot({
  pose = "waving",
  className,
}: {
  pose?: Pose;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 220"
      className={cn("w-full h-full", className)}
      role="img"
      aria-label={`Bizmi robot mascot, ${pose}`}
    >
      {/* antenna */}
      <line
        x1="100"
        y1="10"
        x2="100"
        y2="34"
        stroke="var(--ink)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="100" cy="8" r="8" fill="var(--red)" />

      {/* head */}
      <rect
        x="55"
        y="34"
        width="90"
        height="70"
        rx="24"
        fill="var(--orange)"
      />
      {/* screen face */}
      <rect
        x="72"
        y="52"
        width="56"
        height="36"
        rx="12"
        fill="var(--ink)"
      />
      <circle cx="92" cy="70" r="5" fill="var(--blue-soft)" />
      <circle cx="116" cy="70" r="5" fill="var(--blue-soft)" />
      <path
        d="M92 80 Q100 87 108 80"
        stroke="var(--blue-soft)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* body */}
      <rect
        x="45"
        y="112"
        width="110"
        height="80"
        rx="28"
        fill="var(--orange)"
      />
      <rect
        x="70"
        y="130"
        width="60"
        height="44"
        rx="14"
        fill="var(--orange-soft)"
      />
      <circle cx="100" cy="152" r="10" fill="var(--yellow)" />

      {/* left arm (static) */}
      <rect
        x="20"
        y="120"
        width="26"
        height="16"
        rx="8"
        fill="var(--orange)"
      />

      {/* right arm: waving pose lifts the arm, other poses keep it lowered */}
      {pose === "waving" ? (
        <g>
          <rect
            x="150"
            y="86"
            width="16"
            height="40"
            rx="8"
            fill="var(--orange)"
            transform="rotate(25 150 86)"
          />
          <circle cx="176" cy="80" r="12" fill="var(--orange)" />
        </g>
      ) : (
        <g>
          <rect
            x="154"
            y="120"
            width="26"
            height="16"
            rx="8"
            fill="var(--orange)"
          />
          <circle cx="184" cy="128" r="10" fill="var(--orange)" />
        </g>
      )}

      {/* legs */}
      <rect x="65" y="190" width="20" height="20" rx="8" fill="var(--ink)" />
      <rect x="115" y="190" width="20" height="20" rx="8" fill="var(--ink)" />
    </svg>
  );
}
