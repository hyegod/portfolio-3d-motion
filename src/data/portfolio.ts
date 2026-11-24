import type { CodeScenePreset } from "@/components/ui/CodeMotionAssets";

export type ToolId =
  | "autocad"
  | "revit"
  | "typescript"
  | "python"
  | "figma"
  | "music";

export type WorkCategory =
  | "Civil Engineering"
  | "Software Engineering"
  | "UI/UX & 3D Design";

export interface WorkProject {
  id: string;
  title: string;
  subtitle: string;
  category: WorkCategory;
  year: string;
  client: string;
  metricBadge: string;
  tools: ToolId[];
  accentColor: string;
  secondaryColor: string;
  codePreset: CodeScenePreset;
  description: string;
  deliverables: string[];
  metrics: string;
}

export interface SkillCardItem {
  id: string;
  title: string;
  tag: string;
  accent: string;
  codePreset: CodeScenePreset;
}

/**
 * SINGLE SOURCE OF TRUTH
 * Swap your personal name, handle, email, experience, and project links here anytime.
 */
export const PORTFOLIO_DATA = {
  brand: {
    name: "Axis",
    markSuffix: "._",
    fullName: "Axis._",
    handle: "@axis.eng",
    roleLine: "Civil Engineer × Software Engineer",
    passionLine: "UI/UX & 3D Interactive Design",
    hobbyLine: "Off-Clock Hobby: Electric Guitar & Synth",
    email: "hello@axis-eng.dev",
    location: "Civil Infrastructure • Full-Stack Software • Worldwide",
  },

  hero: {
    scriptTitle: "Port",
    boldTitle: "Folio",
    tapeLabel: "CIVIL × CODE",
    dwgCode: "DWG NO. AX-2026 / REV 05",
    scaleLabel: "SCALE 1:100 • 60–120 FPS",
    microBio:
      "Bridging physical infrastructure and digital architecture. As a Civil Engineer and Software Engineer with a craft for UI/UX & 3D design, I build resilient structures, computational web platforms, and tactile interactive experiences.",
  },

  studio3D: {
    deskMatLabel: "AXIS._ // DIGITAL TWIN CORE",
    laptopTime: "280M",
    laptopDate: "FEA • NEXT.JS • WEBGL",
    editorialTopLeft:
      "Every long-span arch and every distributed codebase obeys the same law — clean load paths, mathematical precision, and zero wasted mass.",
    editorialBottomRight:
      "From finite-element structural twins and BIM solvers to 120 FPS TypeScript & WebGL interfaces.",
    floatingLeftLabel: "Structures",
    floatingRightLabel: "Software",
    heroGlassHeadline: "BUILD. CODE. CREATE.",
  },

  kineticBridge: {
    initialSkillText: "My 5tack ?",
    correctedSkillText: "My Craft",
  },

  skillsSection: {
    experienceLabel: "5+ Years Dual-Discipline",
    primaryStatTarget: 45,
    primaryStatSuffix: "+",
    primaryStatTop: "Structures & Apps",
    primaryStatBottom: "Engineered & Shipped",
    stripCivil: [
      {
        id: "civ-1",
        title: "Cable-Stayed Span",
        tag: "Structural FEA",
        accent: "#38BDF8",
        codePreset: "bridge-fea",
      },
      {
        id: "civ-2",
        title: "42F Seismic Tower",
        tag: "ETABS / Modal",
        accent: "#F59E0B",
        codePreset: "seismic-tower",
      },
      {
        id: "civ-3",
        title: "Corridor Alignment",
        tag: "Civil 3D / BIM",
        accent: "#4ADE80",
        codePreset: "civil-corridor",
      },
      {
        id: "civ-4",
        title: "Rebar Section Detail",
        tag: "ACI / Eurocode",
        accent: "#FF6B4A",
        codePreset: "rebar-detail",
      },
      {
        id: "civ-5",
        title: "BIM Cloud Twin",
        tag: "Revit → WebGL",
        accent: "#C6FF3D",
        codePreset: "bim-web-engine",
      },
    ] as SkillCardItem[],
    gridSoftwareCreative: [
      {
        id: "sw-1",
        title: "BIM-to-Web Engine",
        tag: "Next.js • Three.js",
        accent: "#38BDF8",
        codePreset: "bim-web-engine",
      },
      {
        id: "sw-2",
        title: "AutoSpec Calc API",
        tag: "Python • FastAPI",
        accent: "#C6FF3D",
        codePreset: "autospec-calc",
      },
      {
        id: "sw-3",
        title: "PulseOS Design UI",
        tag: "Figma • Motion",
        accent: "#C084FC",
        codePreset: "pulse-design-ui",
      },
      {
        id: "sw-4",
        title: "Parametric Scripts",
        tag: "CAD Automation",
        accent: "#FACC15",
        codePreset: "parametric-node",
      },
      {
        id: "sw-5",
        title: "FEA Cloud Telemetry",
        tag: "TypeScript • API",
        accent: "#38BDF8",
        codePreset: "bridge-fea",
      },
    ] as SkillCardItem[],
  },

  workSection: {
    title: "Selected Works",
    categories: [
      "Civil Engineering",
      "Software Engineering",
      "UI/UX & 3D Design",
    ] as WorkCategory[],
    projects: [
      {
        id: "aether-bridge-fea",
        title: "Aether Span — Cable-Stayed Bridge",
        subtitle: "Structural Analysis, Load Modeling & BIM Coordination",
        category: "Civil Engineering",
        year: "2026",
        client: "Metro Infrastructure Authority",
        metricBadge: "280m Main Span",
        tools: ["autocad", "revit", "python"],
        accentColor: "#38BDF8",
        secondaryColor: "#C6FF3D",
        codePreset: "bridge-fea",
        description:
          "Full structural load-path modeling, nonlinear cable tension optimization, and automated Python/CSI post-processing scripts for a 280-meter twin-pylon cable-stayed crossing.",
        deliverables: [
          "Finite Element Seismic Model",
          "Automated Bending-Moment Scripts",
          "LOD 400 Structural BIM Package",
        ],
        metrics: "18% steel weight reduction while exceeding seismic drift limits",
      },
      {
        id: "structflow-bim-web",
        title: "StructFlow — BIM-to-Web 3D Platform",
        subtitle: "Full-Stack TypeScript, WebGL & Engineering Telemetry",
        category: "Software Engineering",
        year: "2026",
        client: "BuildTech SaaS Platform",
        metricBadge: "120 FPS WebGL",
        tools: ["typescript", "python", "revit"],
        accentColor: "#C6FF3D",
        secondaryColor: "#38BDF8",
        codePreset: "bim-web-engine",
        description:
          "Browser-native digital twin platform transforming heavy Revit/IFC models into lightweight interactive 3D inspection dashboards with live structural sensor streams and instant clash reports.",
        deliverables: [
          "Next.js + Three.js 3D Viewer",
          "Python IFC Geometry Pipeline",
          "Real-Time Sensor Telemetry API",
        ],
        metrics: "4.6× faster field design reviews across 120+ engineers",
      },
      {
        id: "skyline-seismic-tower",
        title: "Skyline Core — 42-Story High-Rise",
        subtitle: "Seismic Drift Control & Shear-Wall Optimization",
        category: "Civil Engineering",
        year: "2025",
        client: "Horizon Urban Developments",
        metricBadge: "42 Floors • Seismic Zone 4",
        tools: ["revit", "autocad", "python"],
        accentColor: "#FF6B4A",
        secondaryColor: "#FDE047",
        codePreset: "seismic-tower",
        description:
          "Response-spectrum modal analysis and core-wall coupled beam engineering for a 42-story mixed-use tower, paired with custom automated rebar schedule extraction from Revit to Excel.",
        deliverables: [
          "ETABS Modal & Drift Verification",
          "Foundation Mat & Pile Layout",
          "Automated Rebar Quantity Takeoff",
        ],
        metrics: "Zero structural RFIs during core slip-form construction",
      },
      {
        id: "autospec-calc-suite",
        title: "AutoSpec — Structural Calculation Engine",
        subtitle: "Computational Engineering Web App (Next.js + Python)",
        category: "Software Engineering",
        year: "2026",
        client: "Internal Engineering Product",
        metricBadge: "98% Time Saved",
        tools: ["typescript", "python", "figma"],
        accentColor: "#4ADE80",
        secondaryColor: "#C6FF3D",
        codePreset: "autospec-calc",
        description:
          "Interactive cloud calculation workbench checking reinforced concrete beams, columns, and slabs under ACI 318 & Eurocode 2 load combinations (1.2D + 1.6L) with instant PDF calculation sheets.",
        deliverables: [
          "TypeScript UI + Live Stress Diagrams",
          "Python FastAPI Solver Microservice",
          "Automated PDF Calculation Export",
        ],
        metrics: "Adopted by 60+ structural engineers weekly",
      },
      {
        id: "pulse-design-system",
        title: "PulseOS — Interactive Design System",
        subtitle: "UI/UX Architecture, Micro-Motion & 3D Web Aesthetics",
        category: "UI/UX & 3D Design",
        year: "2026",
        client: "Creative Tech Collective",
        metricBadge: "80+ Tokens & Components",
        tools: ["figma", "typescript"],
        accentColor: "#C084FC",
        secondaryColor: "#38BDF8",
        codePreset: "pulse-design-ui",
        description:
          "Tactile, precision-engineered UI/UX component system crafted in Figma and shipped in Tailwind/React with custom cubic-bezier motion curves and 120fps micro-interactions.",
        deliverables: [
          "Multi-Brand Token Architecture",
          "Interactive Motion Choreography Kit",
          "Accessible React Component Library",
        ],
        metrics: "Cut product UI prototyping cycles in half",
      },
    ] as WorkProject[],
  },

  socials: [
    { label: "GitHub", href: "https://github.com", handle: "github.com/axis-eng" },
    { label: "LinkedIn", href: "https://linkedin.com", handle: "in/axis-civil-swe" },
    { label: "Behance", href: "https://behance.net", handle: "behance.net/axis-design" },
  ],

  chapters: [
    { id: "act-1", code: "01", label: "Folio" },
    { id: "act-2", code: "02", label: "3D Desk" },
    { id: "act-3", code: "03", label: "Craft" },
    { id: "act-4", code: "04", label: "Skills" },
    { id: "act-5", code: "05", label: "Works" },
    { id: "act-6", code: "06", label: "Contact" },
  ],
};
