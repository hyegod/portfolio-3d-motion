"use client";

import React from "react";

export type CodeScenePreset =
  | "bridge-fea"
  | "seismic-tower"
  | "civil-corridor"
  | "rebar-detail"
  | "bim-web-engine"
  | "autospec-calc"
  | "pulse-design-ui"
  | "parametric-node"
  | "music-daw-session"
  | "guitar-spectrum";

/* ============================================================================
   1. ACT 1 & ACT 4 — 4K VECTOR STUDIO PROPS (CIVIL × CODE × DESIGN × MUSIC)
   ============================================================================ */

export function CodeCreatorPortrait({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 460"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="jacketLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="jacketShade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient id="skinGrad" x1="20%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="55%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="45%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>

      {/* Architect Overshirt / Jacket */}
      <path
        d="M42 308C46 258 84 228 134 218L180 212L226 218C276 228 314 258 318 308L332 456H28L42 308Z"
        fill="url(#jacketLight)"
        stroke="#0F172A"
        strokeWidth="4"
      />
      {/* Dark Technical Tee */}
      <path d="M142 216L180 232L218 216L208 456H152L142 216Z" fill="#0F172A" />
      {/* Lapels */}
      <path
        d="M136 208L114 254L142 262L162 346L136 208Z"
        fill="#FFFFFF"
        stroke="#475569"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M224 208L246 254L218 262L198 346L224 208Z"
        fill="url(#jacketShade)"
        stroke="#475569"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Subtle Pocket Technical Pen */}
      <rect x="234" y="274" width="6" height="24" rx="2" fill="#0F172A" />
      <rect x="234" y="274" width="6" height="6" rx="1" fill="#B8FF3B" />

      {/* Folded Arms */}
      <path
        d="M52 332C58 292 82 268 108 268L168 338L278 332C296 332 310 356 304 384C298 408 274 416 244 416H94C64 416 48 372 52 332Z"
        fill="url(#jacketShade)"
        stroke="#0F172A"
        strokeWidth="3.5"
      />
      <path
        d="M72 356C94 334 152 328 242 336C268 338 286 356 282 378C278 398 256 406 218 404L88 396C68 394 58 370 72 356Z"
        fill="url(#jacketLight)"
        stroke="#0F172A"
        strokeWidth="3.5"
      />
      <path
        d="M96 322C106 314 126 320 136 332M90 332C102 325 122 330 132 340M88 342C100 336 116 340 126 348"
        stroke="#475569"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Neck & Ears */}
      <path
        d="M150 174H210V222C210 236 196 246 180 246C164 246 150 236 150 222V174Z"
        fill="url(#skinGrad)"
        stroke="#0F172A"
        strokeWidth="3"
      />
      <path
        d="M152 184C164 198 196 198 208 184V204C194 216 166 216 152 204V184Z"
        fill="#64748B"
        opacity="0.55"
      />
      <ellipse cx="118" cy="132" rx="11" ry="18" fill="url(#skinGrad)" stroke="#0F172A" strokeWidth="3" />
      <ellipse cx="242" cy="132" rx="11" ry="18" fill="url(#skinGrad)" stroke="#0F172A" strokeWidth="3" />

      {/* Head & Swept Hair */}
      <path
        d="M122 106C122 68 146 46 180 46C214 46 238 68 238 106V134C238 172 212 198 180 198C148 198 122 172 122 134V106Z"
        fill="url(#skinGrad)"
        stroke="#0F172A"
        strokeWidth="3.8"
      />
      <path
        d="M118 114C112 82 126 44 158 32C184 22 222 26 238 52C248 68 246 94 240 114C236 92 226 76 206 70C182 64 152 72 134 86C126 92 122 104 118 114Z"
        fill="url(#hairGrad)"
      />
      <path d="M144 42C168 30 204 34 224 52" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Eyes & Thin-Frame Glasses */}
      <path
        d="M140 108C148 103 160 103 168 107M192 107C200 103 212 103 220 108"
        stroke="#0F172A"
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      <circle cx="154" cy="122" r="5.5" fill="#0F172A" />
      <circle cx="206" cy="122" r="5.5" fill="#0F172A" />
      <circle cx="152" cy="120" r="1.8" fill="#FFFFFF" />
      <circle cx="204" cy="120" r="1.8" fill="#FFFFFF" />
      <rect x="132" y="108" width="42" height="30" rx="10" fill="#FFFFFF" fillOpacity="0.18" stroke="#0F172A" strokeWidth="3.8" />
      <rect x="186" y="108" width="42" height="30" rx="10" fill="#FFFFFF" fillOpacity="0.18" stroke="#0F172A" strokeWidth="3.8" />
      <path d="M174 120H186M120 118L132 120M228 120L240 118" stroke="#0F172A" strokeWidth="3.2" />

      {/* Nose & Smile */}
      <path d="M180 122V144C180 148 175 150 172 149" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <path d="M160 162C172 171 188 171 200 162" stroke="#0F172A" strokeWidth="3.8" strokeLinecap="round" />
    </svg>
  );
}

/** 4K Civil Engineering Drafting Set-Square + Steel Compass Prop (Act 1 Top-Left) */
export function CodeDraftingToolsProp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-10 -10 230 230" className={`overflow-visible ${className}`} fill="none">
      <defs>
        <linearGradient id="acrylicTri" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="steelLeg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="55%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>

      {/* Transparent 45-90 Architectural Set-Square */}
      <g transform="rotate(-14 105 105)">
        <path
          d="M28 172L28 32L168 172H28ZM56 146H108L56 94V146Z"
          fill="url(#acrylicTri)"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={i}
            x1={38 + i * 11}
            y1={172}
            x2={38 + i * 11}
            y2={i % 2 === 0 ? 161 : 165}
            stroke="#0F172A"
            strokeWidth="2"
          />
        ))}
      </g>

      {/* Brushed Steel Drafting Compass Crossing Over */}
      <g transform="rotate(24 115 100)">
        <circle cx="115" cy="40" r="14" fill="url(#steelLeg)" stroke="#0F172A" strokeWidth="2.5" />
        <rect x="111" y="18" width="8" height="16" rx="3" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
        <path d="M108 52L76 168L86 170L116 56Z" fill="url(#steelLeg)" stroke="#0F172A" strokeWidth="2" />
        <path d="M122 52L154 168L144 170L114 56Z" fill="url(#steelLeg)" stroke="#0F172A" strokeWidth="2" />
        <line x1="88" y1="112" x2="142" y2="112" stroke="#FACC15" strokeWidth="4" />
        <circle cx="115" cy="112" r="5" fill="#0F172A" />
      </g>
    </svg>
  );
}

/** 4K Top-Down Espresso Cup on Porcelain Saucer */
export function CodeEspressoProp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <defs>
        <radialGradient id="porcelainSaucer" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </radialGradient>
        <radialGradient id="espressoCrema" cx="42%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#5C3317" />
          <stop offset="58%" stopColor="#261207" />
          <stop offset="100%" stopColor="#0D0603" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="84" fill="url(#porcelainSaucer)" />
      <circle cx="100" cy="100" r="64" stroke="#CBD5E1" strokeWidth="2.5" />
      <rect x="144" y="91" width="28" height="18" rx="9" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="54" fill="#FFFFFF" />
      <circle cx="100" cy="100" r="46" fill="url(#espressoCrema)" />
      <circle
        cx="100"
        cy="100"
        r="41"
        stroke="#B45309"
        strokeWidth="3.5"
        strokeDasharray="75 28 35 24"
        opacity="0.75"
      />
      <path d="M72 78C82 66 104 64 118 72" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.28" />
    </svg>
  );
}

/** 4K Custom 65% Mechanical Developer Keyboard Prop (Software Engineering — Act 1 Bottom-Center) */
export function CodeMechKeyboardProp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-12 -24 344 178" className={`overflow-visible ${className}`} fill="none">
      <g transform="rotate(-14 160 65)">
        {/* Anodized Aluminum Case */}
        <rect
          x="16"
          y="20"
          width="288"
          height="90"
          rx="12"
          fill="#0F172A"
          stroke="#64748B"
          strokeWidth="3"
        />
        <rect x="24" y="28" width="272" height="74" rx="7" fill="#1E293B" />

        {/* Row 1 Keys */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={`r1-${i}`}
            x={30 + i * 21.5}
            y={34}
            width={18}
            height={17}
            rx={3.5}
            fill={i === 0 ? "#C6FF3D" : i === 11 ? "#F43F5E" : "#F8FAFC"}
          />
        ))}
        {/* Row 2 Keys */}
        {Array.from({ length: 11 }).map((_, i) => (
          <rect
            key={`r2-${i}`}
            x={30 + i * 22.8}
            y={55}
            width={i === 10 ? 32 : 19}
            height={17}
            rx={3.5}
            fill={i === 10 ? "#38BDF8" : "#E2E8F0"}
          />
        ))}
        {/* Row 3 Spacebar + Modifiers */}
        <rect x={30} y={76} width={32} height={18} rx={3.5} fill="#94A3B8" />
        <rect x={66} y={76} width={28} height={18} rx={3.5} fill="#CBD5E1" />
        <rect x={98} y={76} width={118} height={18} rx={4} fill="#C6FF3D" />
        <rect x={220} y={76} width={26} height={18} rx={3.5} fill="#CBD5E1" />
        <rect x={250} y={76} width={40} height={18} rx={3.5} fill="#38BDF8" />
      </g>
    </svg>
  );
}

/** 4K Walnut Vinyl Turntable + Electric Guitar Pick Prop (Music & Sound — Act 1 Top-Right) */
export function CodeTurntableProp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-14 -16 308 252" className={`overflow-visible ${className}`} fill="none">
      <defs>
        <linearGradient id="walnutPlinth" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C4D2B" />
          <stop offset="50%" stopColor="#523018" />
          <stop offset="100%" stopColor="#2A160A" />
        </linearGradient>
        <radialGradient id="vinylDisc" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#18181B" />
          <stop offset="70%" stopColor="#09090B" />
          <stop offset="100%" stopColor="#27272A" />
        </radialGradient>
      </defs>

      <g transform="rotate(9 135 108)">
        <rect x="16" y="18" width="228" height="174" rx="14" fill="url(#walnutPlinth)" stroke="#A16207" strokeWidth="2.5" />
        <circle cx="106" cy="105" r="74" fill="#18181B" stroke="#A1A1AA" strokeWidth="3" />
        <g className="animate-slow-spin" style={{ transformOrigin: "106px 105px" }}>
          <circle cx="106" cy="105" r="70" fill="url(#vinylDisc)" />
          <circle cx="106" cy="105" r="60" stroke="#3F3F46" strokeWidth="1" />
          <circle cx="106" cy="105" r="50" stroke="#27272A" strokeWidth="1" />
          <circle cx="106" cy="105" r="40" stroke="#3F3F46" strokeWidth="1" />
          <path d="M106 105L58 48C72 38 90 34 106 35Z" fill="#FFFFFF" opacity="0.16" />
          <path d="M106 105L154 162C140 172 122 176 106 175Z" fill="#FFFFFF" opacity="0.16" />
          <circle cx="106" cy="105" r="24" fill="#E2E8F0" />
          <circle cx="106" cy="105" r="19" fill="#F472B6" />
          <circle cx="106" cy="105" r="4.5" fill="#09090B" />
        </g>

        <circle cx="206" cy="54" r="18" fill="#E4E4E7" stroke="#52525B" strokeWidth="3" />
        <circle cx="206" cy="54" r="9" fill="#71717A" />
        <path d="M206 54L154 134L142 142" stroke="#F4F4F5" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="212" cy="134" r="7" fill="#E4E4E7" />
        <circle cx="212" cy="154" r="7" fill="#E4E4E7" />
        <circle cx="212" cy="172" r="5" fill="#C6FF3D" />
      </g>

      {/* Bonus Coral Guitar Pick Tucked at Bottom-Right Corner */}
      <g transform="translate(226, 160) rotate(28)">
        <path
          d="M18 0C30 0 36 12 32 24C28 36 22 44 18 44C14 44 8 36 4 24C0 12 6 0 18 0Z"
          fill="#F43F5E"
          stroke="#FFFFFF"
          strokeWidth="2.2"
        />
        <text x="18" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="bold">
          0.88
        </text>
      </g>
    </svg>
  );
}

/** 4K Soft-Gradient Bokeh Foliage Cluster */
export function CodeBokehLeaves({
  variant,
  className = "",
}: {
  variant: "tl" | "tr" | "bl";
  className?: string;
}) {
  return (
    <svg viewBox="0 0 360 280" className={className} fill="none">
      <defs>
        <radialGradient id={`leafG1-${variant}`} cx="45%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#BEF264" stopOpacity="0.88" />
          <stop offset="55%" stopColor="#65A30D" stopOpacity="0.62" />
          <stop offset="85%" stopColor="#15803D" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#14532D" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`leafG2-${variant}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.82" />
          <stop offset="55%" stopColor="#22C55E" stopOpacity="0.55" />
          <stop offset="85%" stopColor="#166534" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#14532D" stopOpacity="0" />
        </radialGradient>
      </defs>
      {variant === "tl" && (
        <>
          <ellipse cx="130" cy="75" rx="115" ry="54" transform="rotate(-24 130 75)" fill={`url(#leafG1-${variant})`} />
          <ellipse cx="215" cy="95" rx="110" ry="52" transform="rotate(28 215 95)" fill={`url(#leafG2-${variant})`} />
        </>
      )}
      {variant === "tr" && (
        <>
          <ellipse cx="245" cy="85" rx="125" ry="58" transform="rotate(-32 245 85)" fill={`url(#leafG1-${variant})`} />
          <ellipse cx="285" cy="145" rx="120" ry="55" transform="rotate(-12 285 145)" fill={`url(#leafG2-${variant})`} />
        </>
      )}
      {variant === "bl" && (
        <>
          <ellipse cx="95" cy="185" rx="120" ry="55" transform="rotate(-26 95 185)" fill={`url(#leafG1-${variant})`} />
          <ellipse cx="145" cy="225" rx="115" ry="50" transform="rotate(12 145 225)" fill={`url(#leafG2-${variant})`} />
        </>
      )}
    </svg>
  );
}

/* ============================================================================
   2. ACT 4 & ACT 5 — 4K BY-CODE SCENES (CIVIL, SOFTWARE, DESIGN, MUSIC)
   ============================================================================ */

export function CodeMotionScene({
  preset,
  compact = false,
}: {
  preset: CodeScenePreset;
  compact?: boolean;
}) {
  switch (preset) {
    /* ----------------------------------------------------------------------
       1. CIVIL ENGINEERING: CABLE-STAYED BRIDGE FEA + MOMENT DIAGRAM
       ---------------------------------------------------------------------- */
    case "bridge-fea":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_30%,#0C4A6E_0%,#082F49_48%,#020617_100%)] select-none">
          <div className="blueprint-grid absolute inset-0 opacity-45" />
          <svg viewBox="0 0 720 420" className="relative z-10 h-full w-full">
            <defs>
              <linearGradient id="stressFill" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#B8FF3B" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Dimension Top Line */}
            {!compact && (
              <g opacity="0.8">
                <line x1="205" y1="62" x2="515" y2="62" stroke="#B8FF3B" strokeWidth="1.5" strokeDasharray="6 4" />
                <text x="360" y="54" textAnchor="middle" fill="#B8FF3B" fontSize="13" fontFamily="monospace" fontWeight="bold">
                  MAIN SPAN = 280.0 m • SF 2.15
                </text>
              </g>
            )}

            {/* Stay Cables Left Pylon */}
            {[80, 115, 150, 250, 290, 330].map((tx, i) => (
              <line
                key={`lc-${i}`}
                x1="205"
                y1={98 + (i % 3) * 18}
                x2={tx}
                y2="256"
                stroke="#7DD3FC"
                strokeWidth="1.6"
                strokeOpacity="0.8"
              />
            ))}
            {/* Stay Cables Right Pylon */}
            {[390, 430, 470, 570, 605, 640].map((tx, i) => (
              <line
                key={`rc-${i}`}
                x1="515"
                y1={98 + (i % 3) * 18}
                x2={tx}
                y2="256"
                stroke="#7DD3FC"
                strokeWidth="1.6"
                strokeOpacity="0.8"
              />
            ))}

            {/* Twin Concrete A-Frame Pylons */}
            <path d="M205 78L191 348H219L205 78Z" fill="#E2E8F0" stroke="#38BDF8" strokeWidth="2" />
            <path d="M515 78L501 348H529L515 78Z" fill="#E2E8F0" stroke="#38BDF8" strokeWidth="2" />
            {/* Bridge Deck Girder */}
            <rect x="30" y="254" width="660" height="14" rx="3" fill="#FFFFFF" />
            <rect x="30" y="264" width="660" height="4" fill="#38BDF8" />

            {/* Live Parabolic Bending-Moment Diagram Under Deck */}
            <path
              d="M30 274Q205 245 360 335Q515 245 690 274V270H30Z"
              fill="url(#stressFill)"
              stroke="#B8FF3B"
              strokeWidth="2.2"
            />
            {/* Load Vectors */}
            {!compact &&
              [280, 360, 440].map((lx, i) => (
                <g key={i}>
                  <line x1={lx} y1="218" x2={lx} y2="246" stroke="#F59E0B" strokeWidth="2.5" />
                  <polygon points={`${lx - 5},242 ${lx + 5},242 ${lx},251`} fill="#F59E0B" />
                </g>
              ))}
          </svg>
        </div>
      );

    /* ----------------------------------------------------------------------
       2. CIVIL ENGINEERING: 42-STORY SEISMIC TOWER (ETABS MODAL DRIFT)
       ---------------------------------------------------------------------- */
    case "seismic-tower":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#1E293B_0%,#0F172A_60%,#020617_100%)] select-none">
          <div className="blueprint-grid absolute inset-0 opacity-30" />
          <svg viewBox="0 0 640 400" className="relative z-10 h-full w-full">
            {/* Ground Datum */}
            <line x1="80" y1="348" x2="560" y2="348" stroke="#64748B" strokeWidth="2" />
            {/* Structural Frame Tower (Slight Modal Deflection Curve) */}
            {Array.from({ length: 14 }).map((_, i) => {
              const y = 330 - i * 20;
              const drift = Math.pow(i / 13, 1.8) * 18;
              return (
                <g key={i}>
                  <line
                    x1={235 + drift}
                    y1={y}
                    x2={395 + drift}
                    y2={y}
                    stroke="#38BDF8"
                    strokeWidth="2"
                  />
                  {/* Columns */}
                  {[235, 288, 342, 395].map((cx, j) => (
                    <line
                      key={j}
                      x1={cx + drift}
                      y1={y}
                      x2={cx + Math.pow(Math.max(0, i - 1) / 13, 1.8) * 18}
                      y2={y + 20}
                      stroke={j === 1 || j === 2 ? "#F59E0B" : "#94A3B8"}
                      strokeWidth={j === 1 || j === 2 ? "3.5" : "2"}
                    />
                  ))}
                  {/* Lateral Seismic Force Vector Bars on Left */}
                  {!compact && i > 2 && i % 2 === 0 && (
                    <g>
                      <line
                        x1={195 - i * 4.5}
                        y1={y}
                        x2={224 + drift}
                        y2={y}
                        stroke="#FACC15"
                        strokeWidth="2.5"
                      />
                      <polygon
                        points={`${220 + drift},${y - 4} ${220 + drift},${y + 4} ${229 + drift},${y}`}
                        fill="#FACC15"
                      />
                    </g>
                  )}
                </g>
              );
            })}
            {/* Highlighted Shear Wall Core */}
            <path
              d="M288 348L306 70H360L342 348Z"
              fill="#F59E0B"
              fillOpacity="0.18"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {!compact && (
              <g transform="translate(445, 96)">
                <rect width="142" height="92" rx="10" fill="#0F172A" fillOpacity="0.88" stroke="#38BDF8" strokeWidth="1.5" />
                <text x="14" y="26" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  ETABS MODAL
                </text>
                <text x="14" y="48" fill="#FFFFFF" fontSize="13" fontFamily="monospace">
                  T1 = 3.42 sec
                </text>
                <text x="14" y="68" fill="#B8FF3B" fontSize="12" fontFamily="monospace" fontWeight="bold">
                  DRIFT 0.011 OK
                </text>
              </g>
            )}
          </svg>
        </div>
      );

    /* ----------------------------------------------------------------------
       3. CIVIL ENGINEERING: CIVIL 3D TOPOGRAPHIC CORRIDOR ALIGNMENT
       ---------------------------------------------------------------------- */
    case "civil-corridor":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#062019] select-none">
          <svg viewBox="0 0 420 260" className="h-full w-full">
            {/* Topographic Elevation Contours */}
            {[28, 56, 86, 118, 152].map((r, i) => (
              <ellipse
                key={i}
                cx="310"
                cy="90"
                rx={r * 1.4}
                ry={r * 0.85}
                stroke="#10B981"
                strokeOpacity={0.35 - i * 0.04}
                strokeWidth="1.5"
                fill="none"
              />
            ))}
            {/* Highway Alignment Centerline Curve */}
            <path
              d="M24 220C110 215 155 125 235 120C315 115 350 65 404 42"
              stroke="#4ADE80"
              strokeWidth="22"
              strokeOpacity="0.22"
              fill="none"
            />
            <path
              d="M24 220C110 215 155 125 235 120C315 115 350 65 404 42"
              stroke="#B8FF3B"
              strokeWidth="3"
              strokeDasharray="10 6"
              fill="none"
            />
            {/* Stationing Nodes */}
            {[
              [84, 200, "0+100"],
              [190, 134, "0+250"],
              [315, 92, "0+400"],
            ].map(([x, y, label]) => (
              <g key={String(label)}>
                <circle cx={Number(x)} cy={Number(y)} r="5.5" fill="#B8FF3B" />
                <text
                  x={Number(x) + 10}
                  y={Number(y) + 14}
                  fill="#ECFCCB"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  STA {label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      );

    /* ----------------------------------------------------------------------
       4. CIVIL ENGINEERING: REINFORCED CONCRETE REBAR CROSS-SECTION
       ---------------------------------------------------------------------- */
    case "rebar-detail":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#18181B] select-none">
          <div className="blueprint-grid absolute inset-0 opacity-25" />
          <svg viewBox="0 0 360 240" className="relative z-10 h-full w-full">
            {/* Concrete Beam Outer Section */}
            <rect
              x="108"
              y="32"
              width="144"
              height="176"
              rx="4"
              fill="#27272A"
              stroke="#94A3B8"
              strokeWidth="3"
            />
            {/* Closed Steel Stirrup */}
            <rect
              x="126"
              y="50"
              width="108"
              height="140"
              rx="10"
              fill="none"
              stroke="#FB923C"
              strokeWidth="3.5"
            />
            {/* 8 Longitudinal Rebar Dots (8-D22) */}
            {[
              [136, 60],
              [180, 60],
              [224, 60],
              [136, 120],
              [224, 120],
              [136, 180],
              [180, 180],
              [224, 180],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="7.5" fill="#FACC15" stroke="#09090B" strokeWidth="2" />
            ))}
            <text x="266" y="72" fill="#FACC15" fontSize="11" fontFamily="monospace" fontWeight="bold">
              8-D22
            </text>
            <text x="266" y="92" fill="#FB923C" fontSize="10" fontFamily="monospace">
              D10-150
            </text>
          </svg>
        </div>
      );

    /* ----------------------------------------------------------------------
       5. SOFTWARE ENGINEERING: BIM-TO-WEB CLOUD 3D ENGINE (IDE + WEBGL)
       ---------------------------------------------------------------------- */
    case "bim-web-engine":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#020617] p-4 sm:p-8 select-none">
          <div className="relative flex h-full max-h-[390px] w-full max-w-[600px] flex-col overflow-hidden rounded-2xl border border-sky-400/30 bg-[#0B1120] shadow-[0_24px_65px_rgba(2,132,199,0.28)]">
            {/* Browser / IDE Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0F172A] px-3.5 py-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-[10px] text-slate-400">
                  structflow-twin.tsx
                </span>
              </div>
              <span className="rounded bg-[#B8FF3B]/15 px-2 py-0.5 font-mono text-[9px] font-bold text-[#B8FF3B]">
                120 FPS • WebGL2
              </span>
            </div>

            {/* Split Code + Live 3D Wireframe Viewport */}
            <div className="grid flex-1 grid-cols-12">
              {!compact && (
                <div className="col-span-5 border-r border-white/10 bg-[#090D16] p-3.5 font-mono text-[10px] leading-relaxed text-slate-300">
                  <p className="text-sky-400">export async function</p>
                  <p className="text-amber-300">solveTrussMesh(ifc) &#123;</p>
                  <p className="pl-3 text-slate-400">const K = assembleStiff();</p>
                  <p className="pl-3 text-slate-400">const U = solveLU(K, F);</p>
                  <p className="pl-3 text-emerald-400">return streamGPU(U);</p>
                  <p className="text-amber-300">&#125;</p>
                  <div className="mt-4 rounded-lg border border-sky-500/30 bg-sky-500/10 p-2 text-[9px] text-sky-300">
                    NODES: 14,820 • CLASH: 0
                  </div>
                </div>
              )}

              {/* Live Isometric 3D Structural Truss Viewport */}
              <div
                className={`relative flex items-center justify-center bg-[radial-gradient(circle_at_50%_50%,#1E293B_0%,#020617_85%)] ${
                  compact ? "col-span-12" : "col-span-7"
                }`}
              >
                <svg viewBox="0 0 280 200" className="h-full w-full p-3">
                  {/* Isometric 3D Truss Prism */}
                  <g stroke="#38BDF8" strokeWidth="2" fill="none">
                    <polygon points="40,145 140,95 240,145 140,185" fill="#38BDF8" fillOpacity="0.08" />
                    <polygon points="40,65 140,20 240,65 140,108" fill="#B8FF3B" fillOpacity="0.1" stroke="#B8FF3B" />
                    <line x1="40" y1="65" x2="40" y2="145" />
                    <line x1="140" y1="20" x2="140" y2="95" />
                    <line x1="240" y1="65" x2="240" y2="145" />
                    <line x1="140" y1="108" x2="140" y2="185" stroke="#B8FF3B" />
                    {/* Diagonal Bracing */}
                    <line x1="40" y1="65" x2="140" y2="185" stroke="#B8FF3B" strokeDasharray="4 3" />
                    <line x1="240" y1="65" x2="140" y2="185" stroke="#B8FF3B" strokeDasharray="4 3" />
                  </g>
                  {[
                    [40, 65],
                    [140, 20],
                    [240, 65],
                    [140, 108],
                    [140, 185],
                  ].map(([nx, ny], i) => (
                    <circle key={i} cx={nx} cy={ny} r="4.5" fill="#B8FF3B" />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      );

    /* ----------------------------------------------------------------------
       6. SOFTWARE ENGINEERING: AUTOSPEC COMPUTATIONAL CALCULATION ENGINE
       ---------------------------------------------------------------------- */
    case "autospec-calc":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#052E16] via-[#09090B] to-[#0F172A] p-4 sm:p-8 select-none">
          <div className="relative w-full max-w-[560px] rounded-2xl border border-emerald-400/30 bg-[#090D12]/95 p-5 shadow-[0_24px_65px_rgba(34,197,94,0.2)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                AUTOSPEC // ACI 318-19 SOLVER
              </span>
              <span className="rounded-full bg-emerald-400 px-2.5 py-0.5 font-mono text-[10px] font-black text-black">
                DCR 0.78 • PASS
              </span>
            </div>

            {!compact && (
              <p className="mt-2 font-mono text-xs text-zinc-400">
                Load Combo: <span className="text-white">1.2D + 1.6L</span> • Beam B-14 (400×650mm)
              </p>
            )}

            {/* Shear & Moment Live SVG Plot */}
            <svg viewBox="0 0 460 140" className="mt-3 h-28 sm:h-36 w-full">
              <line x1="20" y1="70" x2="440" y2="70" stroke="#334155" strokeWidth="1.5" />
              {/* Shear Force Step */}
              <path
                d="M20 70L20 28L230 112L440 28L440 70"
                fill="#38BDF8"
                fillOpacity="0.16"
                stroke="#38BDF8"
                strokeWidth="2.5"
              />
              {/* Parabolic Bending Moment */}
              <path
                d="M20 70Q230 150 440 70"
                fill="#B8FF3B"
                fillOpacity="0.22"
                stroke="#B8FF3B"
                strokeWidth="3"
              />
              <circle cx="230" cy="110" r="5" fill="#B8FF3B" />
              <text x="230" y="132" textAnchor="middle" fill="#B8FF3B" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Mu = 412.6 kN·m ≤ φMn
              </text>
            </svg>

            {/* Utilization Progress Meter */}
            {!compact && (
              <div className="mt-3">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[#38BDF8] via-[#4ADE80] to-[#B8FF3B]" />
                </div>
              </div>
            )}
          </div>
        </div>
      );

    /* ----------------------------------------------------------------------
       7. UI/UX & MOTION DESIGN: PULSEOS DESIGN SYSTEM & BEZIER CURVE LAB
       ---------------------------------------------------------------------- */
    case "pulse-design-ui":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#3B0764] via-[#1E1033] to-[#09090B] p-4 sm:p-8 select-none">
          <div className="relative grid w-full max-w-[560px] grid-cols-12 gap-3 rounded-2xl border border-purple-400/35 bg-[#120B21]/90 p-5 shadow-[0_24px_65px_rgba(168,85,247,0.3)]">
            {/* Motion Curve Editor */}
            <div className="col-span-7 rounded-xl border border-white/10 bg-black/50 p-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-purple-300">
                Easing Graph • 120fps
              </span>
              <svg viewBox="0 0 220 150" className="mt-2 h-28 sm:h-36 w-full">
                <rect x="16" y="14" width="188" height="122" stroke="#334155" strokeWidth="1" fill="none" />
                {/* Control Tangents */}
                <line x1="16" y1="136" x2="64" y2="14" stroke="#F472B6" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="204" y1="14" x2="128" y2="14" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 3" />
                {/* Snappy Expo Curve */}
                <path
                  d="M16 136C64 14 128 14 204 14"
                  stroke="#B8FF3B"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="64" cy="14" r="6" fill="#F472B6" />
                <circle cx="128" cy="14" r="6" fill="#38BDF8" />
              </svg>
            </div>

            {/* Design System Swatch & Typography Stack */}
            <div className="col-span-5 flex flex-col justify-between gap-2.5">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="font-display text-xl sm:text-2xl font-black text-white leading-none">
                  Aa Bb
                </p>
                <p className="mt-1 font-mono text-[9px] text-purple-300">
                  Bricolage / Mono
                </p>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <span className="h-9 rounded-lg bg-[#7C2AE8]" />
                <span className="h-9 rounded-lg bg-[#B8FF3B]" />
                <span className="h-9 rounded-lg bg-[#38BDF8]" />
              </div>
              {!compact && (
                <div className="rounded-lg bg-[#7C2AE8] px-3 py-1.5 text-center font-mono text-[10px] font-bold text-white">
                  TOKENS READY
                </div>
              )}
            </div>
          </div>
        </div>
      );

    /* ----------------------------------------------------------------------
       8. COMPUTATIONAL CAD: PARAMETRIC NODE PIPELINE
       ---------------------------------------------------------------------- */
    case "parametric-node":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#0F172A] select-none">
          <div className="blueprint-grid absolute inset-0 opacity-30" />
          <svg viewBox="0 0 380 220" className="relative z-10 h-full w-full">
            <path d="M108 72C145 72 145 110 176 110" stroke="#FACC15" strokeWidth="3" fill="none" />
            <path d="M108 148C145 148 145 110 176 110" stroke="#38BDF8" strokeWidth="3" fill="none" />
            <path d="M254 110C280 110 280 110 296 110" stroke="#B8FF3B" strokeWidth="3" fill="none" />

            <rect x="24" y="48" width="84" height="44" rx="8" fill="#1E293B" stroke="#FACC15" strokeWidth="2" />
            <text x="66" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
              GRID.JSON
            </text>

            <rect x="24" y="124" width="84" height="44" rx="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
            <text x="66" y="150" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
              LOADS.PY
            </text>

            <rect x="176" y="84" width="78" height="52" rx="8" fill="#312E81" stroke="#B8FF3B" strokeWidth="2.5" />
            <text x="215" y="114" textAnchor="middle" fill="#B8FF3B" fontSize="10" fontFamily="monospace" fontWeight="bold">
              SOLVER
            </text>

            <rect x="296" y="88" width="64" height="44" rx="8" fill="#14532D" stroke="#4ADE80" strokeWidth="2" />
            <text x="328" y="114" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
              REVIT
            </text>
          </svg>
        </div>
      );

    /* ----------------------------------------------------------------------
       9. MUSIC & AUDIO: LIVE STUDIO DAW + MIDI PIANO ROLL + SPINNING VINYL
       ---------------------------------------------------------------------- */
    case "music-daw-session":
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#3B0764] via-[#18181B] to-[#09090B] p-4 sm:p-8 select-none">
          <div className="relative flex w-full max-w-[580px] flex-col gap-3 rounded-2xl border border-pink-400/30 bg-[#0D0B14]/95 p-5 shadow-[0_24px_65px_rgba(236,72,153,0.28)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-pink-500 animate-pulse" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-pink-300">
                  NOCTURNE.ALS // 112 BPM • D MINOR
                </span>
              </div>
              <span className="rounded bg-amber-400/20 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-300">
                GUITAR + SYNTH
              </span>
            </div>

            {/* Multi-Track MIDI Piano Roll & Audio Regions */}
            <div className="space-y-2">
              <div className="flex h-7 items-center gap-2 rounded-lg bg-white/5 px-2">
                <span className="w-12 font-mono text-[9px] text-pink-300">GTR</span>
                <div className="h-4 w-28 rounded bg-gradient-to-r from-pink-500 to-rose-400" />
                <div className="h-4 w-36 rounded bg-gradient-to-r from-pink-500 to-amber-400" />
              </div>
              <div className="flex h-7 items-center gap-2 rounded-lg bg-white/5 px-2">
                <span className="w-12 font-mono text-[9px] text-sky-300">KEYS</span>
                <div className="ml-8 h-4 w-44 rounded bg-gradient-to-r from-sky-400 to-indigo-500" />
                <div className="h-4 w-20 rounded bg-sky-400/75" />
              </div>
              {!compact && (
                <div className="flex h-7 items-center gap-2 rounded-lg bg-white/5 px-2">
                  <span className="w-12 font-mono text-[9px] text-lime-300">DRUM</span>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-4 flex-1 rounded-sm bg-[#B8FF3B]/80"
                      style={{ opacity: i % 2 === 0 ? 0.95 : 0.45 }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Live Equalizer Frequency Bars */}
            <div className="mt-1 flex h-16 items-end justify-between gap-1.5 rounded-xl bg-black/60 px-3 py-2">
              {[34, 68, 52, 92, 76, 44, 86, 98, 60, 48, 82, 64, 38, 72, 54, 42].map(
                (h, i) => (
                  <span
                    key={i}
                    className="w-full rounded-t-full bg-gradient-to-t from-pink-600 via-purple-400 to-amber-300"
                    style={{ height: `${h}%` }}
                  />
                )
              )}
            </div>
          </div>
        </div>
      );

    /* ----------------------------------------------------------------------
       10. MUSIC & SOUND: GUITAR FRETBOARD & HARMONIC WAVEFORM
       ---------------------------------------------------------------------- */
    default:
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#4C0519] via-[#18181B] to-[#09090B] select-none">
          <svg viewBox="0 0 360 220" className="h-full w-full">
            {/* Rosewood Guitar Neck */}
            <rect x="24" y="64" width="312" height="92" rx="6" fill="#29150E" stroke="#F59E0B" strokeWidth="2" />
            {/* Frets */}
            {[80, 136, 192, 248, 304].map((fx) => (
              <line key={fx} x1={fx} y1="64" x2={fx} y2="156" stroke="#CBD5E1" strokeWidth="2.5" />
            ))}
            {/* 6 Strings */}
            {[74, 88, 102, 116, 130, 144].map((sy, i) => (
              <line
                key={sy}
                x1="24"
                y1={sy}
                x2="336"
                y2={sy}
                stroke="#FDE68A"
                strokeOpacity="0.85"
                strokeWidth={1 + i * 0.25}
              />
            ))}
            {/* Glowing Maj9 Chord Voicing Dots */}
            {[
              [108, 130],
              [164, 116],
              [164, 88],
              [220, 102],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="7.5" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" />
            ))}
            {/* Harmonic Sine Overlay */}
            <path
              d="M16 110Q60 26 110 110T210 110T344 110"
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeOpacity="0.6"
              fill="none"
            />
          </svg>
        </div>
      );
  }
}
