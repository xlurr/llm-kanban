/**
 * Large animated network graph — monochrome, theme-aware.
 * Dense mesh of nodes and connections representing AI orchestration at scale.
 */
export function HeroIllustration({ size = 320 }: { size?: number }) {
  return (
    <div className="relative select-none" style={{ width: size, height: size }}>
      <div className="absolute inset-4 rounded-full bg-foreground/[0.02] blur-3xl" />

      <svg viewBox="0 0 480 480" className="w-full h-full relative z-10">
        <defs>
          <filter id="hg">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ══════════ CONNECTION MESH ══════════ */}
        <g className="stroke-foreground/[0.06]" strokeWidth="0.7" fill="none">
          {/* Top cluster */}
          <line x1="240" y1="30" x2="170" y2="75" />
          <line x1="240" y1="30" x2="310" y2="75" />
          <line x1="240" y1="30" x2="240" y2="90" />
          <line x1="170" y1="75" x2="110" y2="120" />
          <line x1="170" y1="75" x2="180" y2="140" />
          <line x1="310" y1="75" x2="370" y2="120" />
          <line x1="310" y1="75" x2="300" y2="140" />
          <line x1="240" y1="90" x2="180" y2="140" />
          <line x1="240" y1="90" x2="300" y2="140" />

          {/* Middle fan-out */}
          <line x1="110" y1="120" x2="50" y2="190" />
          <line x1="110" y1="120" x2="120" y2="200" />
          <line x1="110" y1="120" x2="180" y2="140" />
          <line x1="370" y1="120" x2="430" y2="190" />
          <line x1="370" y1="120" x2="360" y2="200" />
          <line x1="370" y1="120" x2="300" y2="140" />

          {/* Central hub connections */}
          <line x1="180" y1="140" x2="240" y2="210" />
          <line x1="300" y1="140" x2="240" y2="210" />
          <line x1="180" y1="140" x2="120" y2="200" />
          <line x1="300" y1="140" x2="360" y2="200" />
          <line x1="180" y1="140" x2="300" y2="140" />

          {/* Mid-layer cross connections */}
          <line x1="50" y1="190" x2="120" y2="200" />
          <line x1="430" y1="190" x2="360" y2="200" />
          <line x1="120" y1="200" x2="240" y2="210" />
          <line x1="360" y1="200" x2="240" y2="210" />
          <line x1="50" y1="190" x2="80" y2="280" />
          <line x1="430" y1="190" x2="400" y2="280" />

          {/* Lower spread */}
          <line x1="120" y1="200" x2="80" y2="280" />
          <line x1="120" y1="200" x2="160" y2="300" />
          <line x1="240" y1="210" x2="160" y2="300" />
          <line x1="240" y1="210" x2="240" y2="310" />
          <line x1="240" y1="210" x2="320" y2="300" />
          <line x1="360" y1="200" x2="320" y2="300" />
          <line x1="360" y1="200" x2="400" y2="280" />

          {/* Bottom mesh */}
          <line x1="80" y1="280" x2="160" y2="300" />
          <line x1="160" y1="300" x2="240" y2="310" />
          <line x1="240" y1="310" x2="320" y2="300" />
          <line x1="320" y1="300" x2="400" y2="280" />
          <line x1="80" y1="280" x2="110" y2="370" />
          <line x1="160" y1="300" x2="160" y2="380" />
          <line x1="240" y1="310" x2="240" y2="390" />
          <line x1="320" y1="300" x2="320" y2="380" />
          <line x1="400" y1="280" x2="370" y2="370" />

          {/* Bottom row connections */}
          <line x1="110" y1="370" x2="160" y2="380" />
          <line x1="160" y1="380" x2="240" y2="390" />
          <line x1="240" y1="390" x2="320" y2="380" />
          <line x1="320" y1="380" x2="370" y2="370" />
          <line x1="110" y1="370" x2="160" y2="440" />
          <line x1="240" y1="390" x2="240" y2="450" />
          <line x1="370" y1="370" x2="320" y2="440" />
          <line x1="160" y1="440" x2="240" y2="450" />
          <line x1="240" y1="450" x2="320" y2="440" />

          {/* Side branches */}
          <line x1="50" y1="190" x2="30" y2="260" />
          <line x1="30" y1="260" x2="80" y2="280" />
          <line x1="430" y1="190" x2="450" y2="260" />
          <line x1="450" y1="260" x2="400" y2="280" />
          <line x1="30" y1="260" x2="50" y2="340" />
          <line x1="50" y1="340" x2="110" y2="370" />
          <line x1="450" y1="260" x2="430" y2="340" />
          <line x1="430" y1="340" x2="370" y2="370" />
        </g>

        {/* ══════════ DATA PULSES ══════════ */}
        <g className="fill-foreground/30">
          <circle r="2">
            <animateMotion dur="3s" repeatCount="indefinite" path="M240,30 L170,75 L110,120 L50,190 L80,280" />
            <animate attributeName="opacity" values="0;0.5;0" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle r="2">
            <animateMotion dur="3.4s" repeatCount="indefinite" path="M240,30 L310,75 L370,120 L430,190 L400,280" begin="0.3s" />
            <animate attributeName="opacity" values="0;0.5;0" dur="3.4s" repeatCount="indefinite" begin="0.3s" />
          </circle>
          <circle r="1.5">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M240,90 L180,140 L240,210 L240,310" begin="0.6s" />
            <animate attributeName="opacity" values="0;0.6;0" dur="2.8s" repeatCount="indefinite" begin="0.6s" />
          </circle>
          <circle r="1.5">
            <animateMotion dur="3.2s" repeatCount="indefinite" path="M240,210 L160,300 L160,380 L160,440" begin="1s" />
            <animate attributeName="opacity" values="0;0.4;0" dur="3.2s" repeatCount="indefinite" begin="1s" />
          </circle>
          <circle r="1.5">
            <animateMotion dur="3.6s" repeatCount="indefinite" path="M240,210 L320,300 L370,370 L320,440" begin="1.5s" />
            <animate attributeName="opacity" values="0;0.4;0" dur="3.6s" repeatCount="indefinite" begin="1.5s" />
          </circle>
          <circle r="1.5">
            <animateMotion dur="4s" repeatCount="indefinite" path="M50,190 L30,260 L50,340 L110,370" begin="0.8s" />
            <animate attributeName="opacity" values="0;0.4;0" dur="4s" repeatCount="indefinite" begin="0.8s" />
          </circle>
          <circle r="1.5">
            <animateMotion dur="3.8s" repeatCount="indefinite" path="M430,190 L450,260 L430,340 L370,370" begin="2s" />
            <animate attributeName="opacity" values="0;0.4;0" dur="3.8s" repeatCount="indefinite" begin="2s" />
          </circle>
          <circle r="2">
            <animateMotion dur="2.5s" repeatCount="indefinite" path="M180,140 L300,140 L360,200" begin="0.4s" />
            <animate attributeName="opacity" values="0;0.5;0" dur="2.5s" repeatCount="indefinite" begin="0.4s" />
          </circle>
        </g>

        {/* ══════════ CENTRAL HUB ══════════ */}
        <g>
          <circle cx="240" cy="210" r="28" className="fill-none stroke-foreground/[0.08]" strokeWidth="1" />
          <circle cx="240" cy="210" r="28" className="fill-none stroke-foreground/15" strokeWidth="1.5" strokeDasharray="5 3">
            <animateTransform attributeName="transform" type="rotate" values="0 240 210;360 240 210" dur="25s" repeatCount="indefinite" />
          </circle>
          <circle cx="240" cy="210" r="20" className="fill-foreground/[0.06]" />
          <circle cx="240" cy="210" r="13" className="fill-foreground/[0.08]" />
          <circle cx="240" cy="210" r="5" className="fill-foreground/50" filter="url(#hg)">
            <animate attributeName="r" values="5;6.5;5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          {/* Code lines */}
          <line x1="232" y1="205" x2="237" y2="205" className="stroke-foreground/20" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="232" y1="209" x2="248" y2="209" className="stroke-foreground/20" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="232" y1="213" x2="243" y2="213" className="stroke-foreground/20" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="232" y1="217" x2="240" y2="217" className="stroke-foreground/20" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* ══════════ TOP GATEWAY ══════════ */}
        <g>
          <rect x="220" y="14" width="40" height="32" rx="9" className="fill-foreground/[0.06] stroke-foreground/[0.12]" strokeWidth="1" />
          <path d="M234 26 L246 26 M240 21 L240 31 M236 25 L240 21 L244 25" className="stroke-foreground/35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="228" y1="38" x2="252" y2="38" className="stroke-foreground/10" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* ══════════ LAYER 1: PROCESSORS ══════════ */}
        {/* Left processor */}
        <g>
          <rect x="148" y="60" width="44" height="30" rx="8" className="fill-foreground/[0.05] stroke-foreground/10" strokeWidth="0.8" />
          <path d="M160 71 L166 76 L160 81" className="stroke-foreground/25" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="168" y1="81" x2="180" y2="81" className="stroke-foreground/15" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        {/* Right processor */}
        <g>
          <rect x="288" y="60" width="44" height="30" rx="8" className="fill-foreground/[0.05] stroke-foreground/10" strokeWidth="0.8" />
          <rect x="300" y="68" width="10" height="8" rx="2" className="fill-foreground/20" />
          <circle cx="304" cy="71" r="1.2" className="fill-background/70" />
          <circle cx="308" cy="71" r="1.2" className="fill-background/70" />
          <line x1="300" y1="80" x2="320" y2="80" className="stroke-foreground/12" strokeWidth="0.8" strokeLinecap="round" />
        </g>
        {/* Middle router */}
        <g>
          <rect x="220" y="74" width="40" height="30" rx="8" className="fill-foreground/[0.04] stroke-foreground/10" strokeWidth="0.8" />
          <circle cx="232" cy="86" r="3" className="fill-none stroke-foreground/20" strokeWidth="0.8" />
          <circle cx="240" cy="86" r="3" className="fill-none stroke-foreground/20" strokeWidth="0.8" />
          <circle cx="248" cy="86" r="3" className="fill-none stroke-foreground/20" strokeWidth="0.8" />
          <line x1="235" y1="86" x2="237" y2="86" className="stroke-foreground/15" strokeWidth="0.8" />
          <line x1="243" y1="86" x2="245" y2="86" className="stroke-foreground/15" strokeWidth="0.8" />
          <line x1="228" y1="96" x2="252" y2="96" className="stroke-foreground/10" strokeWidth="0.8" strokeLinecap="round" />
        </g>

        {/* ══════════ LAYER 2: AGENTS ══════════ */}
        {/* Far left agent */}
        <g>
          <rect x="84" y="106" width="52" height="28" rx="8" className="fill-foreground/[0.05] stroke-foreground/10" strokeWidth="0.8" />
          <rect x="94" y="112" width="14" height="3" rx="1.5" className="fill-foreground/10" />
          <rect x="94" y="112" width="9" height="3" rx="1.5" className="fill-foreground/25">
            <animate attributeName="width" values="9;14;9" dur="3.5s" repeatCount="indefinite" />
          </rect>
          <rect x="94" y="118" width="14" height="3" rx="1.5" className="fill-foreground/10" />
          <rect x="94" y="118" width="6" height="3" rx="1.5" className="fill-foreground/20">
            <animate attributeName="width" values="6;12;6" dur="4.2s" repeatCount="indefinite" begin="0.5s" />
          </rect>
          <circle cx="124" cy="116" r="3" className="fill-foreground/10">
            <animate attributeName="r" values="3;4.5;3" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.1;0.04;0.1" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Far right agent */}
        <g>
          <rect x="344" y="106" width="52" height="28" rx="8" className="fill-foreground/[0.05] stroke-foreground/10" strokeWidth="0.8" />
          <rect x="354" y="112" width="14" height="3" rx="1.5" className="fill-foreground/10" />
          <rect x="354" y="112" width="11" height="3" rx="1.5" className="fill-foreground/25">
            <animate attributeName="width" values="11;5;11" dur="3s" repeatCount="indefinite" begin="0.3s" />
          </rect>
          <rect x="354" y="118" width="14" height="3" rx="1.5" className="fill-foreground/10" />
          <rect x="354" y="118" width="8" height="3" rx="1.5" className="fill-foreground/20">
            <animate attributeName="width" values="8;14;8" dur="3.8s" repeatCount="indefinite" />
          </rect>
          <circle cx="384" cy="116" r="3" className="fill-foreground/10">
            <animate attributeName="r" values="3;4.5;3" dur="2.2s" repeatCount="indefinite" begin="0.8s" />
            <animate attributeName="opacity" values="0.1;0.04;0.1" dur="2.2s" repeatCount="indefinite" begin="0.8s" />
          </circle>
        </g>
        {/* Inner left worker */}
        <g>
          <rect x="158" y="126" width="44" height="28" rx="8" className="fill-foreground/[0.04] stroke-foreground/10" strokeWidth="0.8" />
          <path d="M168 136 L174 141 L168 146" className="stroke-foreground/20" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="176" y1="146" x2="190" y2="146" className="stroke-foreground/12" strokeWidth="1" strokeLinecap="round" />
        </g>
        {/* Inner right worker */}
        <g>
          <rect x="278" y="126" width="44" height="28" rx="8" className="fill-foreground/[0.04] stroke-foreground/10" strokeWidth="0.8" />
          <rect x="290" y="134" width="8" height="6" rx="2" className="fill-foreground/15" />
          <circle cx="293" cy="136.5" r="1" className="fill-background/60" />
          <circle cx="296" cy="136.5" r="1" className="fill-background/60" />
          <line x1="290" y1="144" x2="310" y2="144" className="stroke-foreground/10" strokeWidth="0.8" strokeLinecap="round" />
        </g>

        {/* ══════════ LAYER 3: SIDE NODES ══════════ */}
        {/* Far left */}
        <circle cx="50" cy="190" r="14" className="fill-foreground/[0.04] stroke-foreground/[0.08]" strokeWidth="0.8" />
        <path d="M43 190 L48 195 L57 185" className="stroke-foreground/25" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Far right */}
        <circle cx="430" cy="190" r="14" className="fill-foreground/[0.04] stroke-foreground/[0.08]" strokeWidth="0.8" />
        <rect x="423" y="185" width="3.5" height="7" rx="1" className="fill-foreground/20" />
        <rect x="428" y="183" width="3.5" height="9" rx="1" className="fill-foreground/15" />
        <rect x="433" y="181" width="3.5" height="11" rx="1" className="fill-foreground/25" />
        {/* Mid-left cache */}
        <g>
          <rect x="98" y="186" width="44" height="28" rx="8" className="fill-foreground/[0.04] stroke-foreground/[0.08]" strokeWidth="0.8" />
          <rect x="108" y="194" width="6" height="6" rx="1.5" className="fill-none stroke-foreground/15" strokeWidth="0.8" />
          <rect x="117" y="194" width="6" height="6" rx="1.5" className="fill-none stroke-foreground/20" strokeWidth="0.8" />
          <rect x="126" y="194" width="6" height="6" rx="1.5" className="fill-none stroke-foreground/12" strokeWidth="0.8" />
          <line x1="108" y1="206" x2="132" y2="206" className="stroke-foreground/10" strokeWidth="0.8" strokeLinecap="round" />
        </g>
        {/* Mid-right cache */}
        <g>
          <rect x="338" y="186" width="44" height="28" rx="8" className="fill-foreground/[0.04] stroke-foreground/[0.08]" strokeWidth="0.8" />
          <ellipse cx="360" cy="196" rx="8" ry="3" className="fill-none stroke-foreground/15" strokeWidth="0.8" />
          <path d="M352 196 L352 204 Q352 207 360 207 Q368 207 368 204 L368 196" className="fill-none stroke-foreground/15" strokeWidth="0.8" />
        </g>

        {/* ══════════ LAYER 4: LOWER SPREAD ══════════ */}
        {/* Edge nodes */}
        <circle cx="30" cy="260" r="10" className="fill-foreground/[0.03] stroke-foreground/[0.07]" strokeWidth="0.7" />
        <circle cx="30" cy="260" r="3" className="fill-foreground/15" />
        <circle cx="450" cy="260" r="10" className="fill-foreground/[0.03] stroke-foreground/[0.07]" strokeWidth="0.7" />
        <circle cx="450" cy="260" r="3" className="fill-foreground/15" />

        {/* Wider nodes */}
        <g>
          <rect x="58" y="266" width="44" height="28" rx="8" className="fill-foreground/[0.04] stroke-foreground/[0.08]" strokeWidth="0.8" />
          <line x1="68" y1="276" x2="78" y2="276" className="stroke-foreground/15" strokeWidth="1" strokeLinecap="round" />
          <line x1="68" y1="280" x2="90" y2="280" className="stroke-foreground/20" strokeWidth="1" strokeLinecap="round" />
          <line x1="68" y1="284" x2="84" y2="284" className="stroke-foreground/12" strokeWidth="1" strokeLinecap="round" />
        </g>
        <g>
          <rect x="138" y="286" width="44" height="28" rx="8" className="fill-foreground/[0.04] stroke-foreground/[0.08]" strokeWidth="0.8" />
          <path d="M150 296 L156 301 L150 306" className="stroke-foreground/18" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="158" y1="306" x2="170" y2="306" className="stroke-foreground/10" strokeWidth="1" strokeLinecap="round" />
        </g>
        <g>
          <rect x="218" y="296" width="44" height="28" rx="8" className="fill-foreground/[0.05] stroke-foreground/10" strokeWidth="0.8" />
          <ellipse cx="240" cy="306" rx="8" ry="3" className="fill-none stroke-foreground/20" strokeWidth="0.8" />
          <path d="M232 306 L232 316 Q232 319 240 319 Q248 319 248 316 L248 306" className="fill-none stroke-foreground/20" strokeWidth="0.8" />
        </g>
        <g>
          <rect x="298" y="286" width="44" height="28" rx="8" className="fill-foreground/[0.04] stroke-foreground/[0.08]" strokeWidth="0.8" />
          <rect x="308" y="294" width="6" height="4" rx="1" className="fill-foreground/15" />
          <rect x="316" y="292" width="6" height="6" rx="1" className="fill-foreground/12" />
          <rect x="324" y="290" width="6" height="8" rx="1" className="fill-foreground/20" />
        </g>
        <g>
          <rect x="378" y="266" width="44" height="28" rx="8" className="fill-foreground/[0.04] stroke-foreground/[0.08]" strokeWidth="0.8" />
          <circle cx="392" cy="278" r="3" className="fill-none stroke-foreground/15" strokeWidth="0.8" />
          <circle cx="400" cy="278" r="3" className="fill-none stroke-foreground/15" strokeWidth="0.8" />
          <circle cx="408" cy="278" r="3" className="fill-none stroke-foreground/15" strokeWidth="0.8" />
          <line x1="395" y1="278" x2="397" y2="278" className="stroke-foreground/12" strokeWidth="0.6" />
          <line x1="403" y1="278" x2="405" y2="278" className="stroke-foreground/12" strokeWidth="0.6" />
          <line x1="388" y1="286" x2="412" y2="286" className="stroke-foreground/8" strokeWidth="0.8" strokeLinecap="round" />
        </g>

        {/* ══════════ LAYER 5: EDGE BRANCHES ══════════ */}
        <circle cx="50" cy="340" r="8" className="fill-foreground/[0.03] stroke-foreground/[0.06]" strokeWidth="0.6" />
        <circle cx="50" cy="340" r="2.5" className="fill-foreground/12" />
        <circle cx="430" cy="340" r="8" className="fill-foreground/[0.03] stroke-foreground/[0.06]" strokeWidth="0.6" />
        <circle cx="430" cy="340" r="2.5" className="fill-foreground/12" />

        {/* ══════════ LAYER 6: BOTTOM ROW ══════════ */}
        <g>
          <rect x="88" y="356" width="44" height="28" rx="8" className="fill-foreground/[0.04] stroke-foreground/[0.08]" strokeWidth="0.8" />
          <rect x="98" y="364" width="14" height="3" rx="1.5" className="fill-foreground/10" />
          <rect x="98" y="364" width="10" height="3" rx="1.5" className="fill-foreground/20">
            <animate attributeName="width" values="10;14;10" dur="4s" repeatCount="indefinite" begin="1s" />
          </rect>
          <rect x="98" y="370" width="14" height="3" rx="1.5" className="fill-foreground/10" />
          <rect x="98" y="370" width="7" height="3" rx="1.5" className="fill-foreground/15">
            <animate attributeName="width" values="7;14;7" dur="3.3s" repeatCount="indefinite" begin="0.5s" />
          </rect>
        </g>
        <g>
          <rect x="138" y="366" width="44" height="28" rx="8" className="fill-foreground/[0.04] stroke-foreground/[0.08]" strokeWidth="0.8" />
          <path d="M153 378 L159 383 L165 378" className="stroke-foreground/18" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="159" y1="383" x2="159" y2="388" className="stroke-foreground/12" strokeWidth="1" strokeLinecap="round" />
        </g>
        <g>
          <rect x="218" y="376" width="44" height="28" rx="8" className="fill-foreground/[0.05] stroke-foreground/10" strokeWidth="0.8" />
          <path d="M232 386 L238 391 L248 381" className="stroke-foreground/25" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
        <g>
          <rect x="298" y="366" width="44" height="28" rx="8" className="fill-foreground/[0.04] stroke-foreground/[0.08]" strokeWidth="0.8" />
          <line x1="310" y1="376" x2="322" y2="376" className="stroke-foreground/15" strokeWidth="1" strokeLinecap="round" />
          <line x1="310" y1="380" x2="330" y2="380" className="stroke-foreground/20" strokeWidth="1" strokeLinecap="round" />
          <line x1="310" y1="384" x2="326" y2="384" className="stroke-foreground/12" strokeWidth="1" strokeLinecap="round" />
        </g>
        <g>
          <rect x="348" y="356" width="44" height="28" rx="8" className="fill-foreground/[0.04] stroke-foreground/[0.08]" strokeWidth="0.8" />
          <rect x="356" y="364" width="10" height="8" rx="2.5" className="fill-foreground/15" />
          <circle cx="360" cy="367.5" r="1" className="fill-background/60" />
          <circle cx="364" cy="367.5" r="1" className="fill-background/60" />
          <line x1="358" y1="376" x2="380" y2="376" className="stroke-foreground/10" strokeWidth="0.8" strokeLinecap="round" />
        </g>

        {/* ══════════ BOTTOM TERMINUS ══════════ */}
        <g>
          <rect x="138" y="426" width="44" height="28" rx="8" className="fill-foreground/[0.04] stroke-foreground/[0.07]" strokeWidth="0.7" />
          <circle cx="160" cy="438" r="4" className="fill-none stroke-foreground/15" strokeWidth="0.8" />
          <circle cx="160" cy="438" r="1.5" className="fill-foreground/15" />
        </g>
        <g>
          <rect x="218" y="436" width="44" height="28" rx="8" className="fill-foreground/[0.04] stroke-foreground/[0.08]" strokeWidth="0.7" />
          <rect x="228" y="444" width="4" height="8" rx="1" className="fill-foreground/15" />
          <rect x="234" y="442" width="4" height="10" rx="1" className="fill-foreground/12" />
          <rect x="240" y="440" width="4" height="12" rx="1" className="fill-foreground/20" />
          <rect x="246" y="443" width="4" height="9" rx="1" className="fill-foreground/15" />
        </g>
        <g>
          <rect x="298" y="426" width="44" height="28" rx="8" className="fill-foreground/[0.04] stroke-foreground/[0.07]" strokeWidth="0.7" />
          <ellipse cx="320" cy="436" rx="8" ry="3" className="fill-none stroke-foreground/15" strokeWidth="0.7" />
          <path d="M312 436 L312 446 Q312 449 320 449 Q328 449 328 446 L328 436" className="fill-none stroke-foreground/15" strokeWidth="0.7" />
        </g>

        {/* ══════════ AMBIENT PARTICLES ══════════ */}
        <g className="fill-foreground/10">
          <circle cx="20" cy="140" r="1.2"><animate attributeName="opacity" values="0.1;0.03;0.1" dur="3s" repeatCount="indefinite" /></circle>
          <circle cx="460" cy="150" r="1"><animate attributeName="opacity" values="0.08;0.02;0.08" dur="4s" repeatCount="indefinite" begin="1s" /></circle>
          <circle cx="15" cy="310" r="1"><animate attributeName="opacity" values="0.08;0.02;0.08" dur="5s" repeatCount="indefinite" begin="0.5s" /></circle>
          <circle cx="465" cy="320" r="1.2"><animate attributeName="opacity" values="0.1;0.03;0.1" dur="3.5s" repeatCount="indefinite" begin="2s" /></circle>
          <circle cx="100" cy="30" r="0.8"><animate attributeName="opacity" values="0.06;0.01;0.06" dur="4.5s" repeatCount="indefinite" /></circle>
          <circle cx="380" cy="25" r="0.8"><animate attributeName="opacity" values="0.06;0.01;0.06" dur="3.8s" repeatCount="indefinite" begin="1.5s" /></circle>
          <circle cx="70" cy="420" r="1"><animate attributeName="opacity" values="0.08;0.02;0.08" dur="4.2s" repeatCount="indefinite" begin="0.8s" /></circle>
          <circle cx="420" cy="430" r="1"><animate attributeName="opacity" values="0.07;0.02;0.07" dur="3.6s" repeatCount="indefinite" begin="1.2s" /></circle>
        </g>

        {/* ══════════ ORBIT RINGS ══════════ */}
        <circle cx="240" cy="240" r="220" className="fill-none stroke-foreground/[0.03]" strokeWidth="0.5" strokeDasharray="3 8">
          <animateTransform attributeName="transform" type="rotate" values="0 240 240;360 240 240" dur="80s" repeatCount="indefinite" />
        </circle>
        <circle cx="240" cy="240" r="180" className="fill-none stroke-foreground/[0.025]" strokeWidth="0.5" strokeDasharray="2 10">
          <animateTransform attributeName="transform" type="rotate" values="360 240 240;0 240 240" dur="60s" repeatCount="indefinite" />
        </circle>
        <circle cx="240" cy="240" r="130" className="fill-none stroke-foreground/[0.02]" strokeWidth="0.4" strokeDasharray="1.5 12">
          <animateTransform attributeName="transform" type="rotate" values="0 240 240;360 240 240" dur="45s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}
