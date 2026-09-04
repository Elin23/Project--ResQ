import fs from "node:fs";
import path from "node:path";

const root=process.cwd(), files=[];
function walk(dir){
  const abs=path.join(root,dir);
  if(!fs.existsSync(abs)) return;
  for(const entry of fs.readdirSync(abs,{withFileTypes:true})){
    const rel=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(rel);
    else if(entry.isFile() && /\.(ts|tsx)$/.test(rel)) files.push(rel.split(path.sep).join("/"));
  }
}
walk("src"); walk("app");

const failures=[];
const read=f=>fs.readFileSync(path.join(root,f),"utf8");
const must=(f,t,label=t)=>{ if(!fs.existsSync(path.join(root,f)) || !read(f).includes(t)) failures.push(`${f}: missing ${label}`); };

for(const file of files){
  const s=read(file);
  if(file!=="src/components/ui/AppText.tsx" && /<Text(?:\s|>)/.test(s)){
    failures.push(`${file}: raw React Native Text bypasses Arabic typography primitive`);
  }
  if(/flexDirection\s*:\s*["']row-reverse["']/.test(s)){
    failures.push(`${file}: row-reverse is forbidden`);
  }
  const lines=s.split(/\r?\n/);
  for(let i=0;i<lines.length;i++){
    if(!/flexDirection\s*:\s*["']row["']/.test(lines[i])) continue;
    const window=lines.slice(i,i+5).join(" ");
    if(!/direction\s*:\s*(?:["'](?:rtl|ltr)["']|ARABIC_LAYOUT\.direction)/.test(window)){
      failures.push(`${file}:${i+1}: horizontal row has no explicit direction`);
    }
  }
}

// Core primitives define the global Arabic geometry.
must("src/components/ui/AppText.tsx",'align = ARABIC_LAYOUT.textAlign',"Arabic default text alignment");
must("src/components/ui/AppText.tsx","writingDirection: direction","text writing direction");
must("src/components/ui/Screen.tsx",'direction: "rtl"',"screen RTL contract");
must("src/components/ui/Card.tsx",'direction: "rtl"',"card RTL contract");
must("src/components/ui/Input.tsx",'direction: "rtl"',"input field RTL contract");
must("src/components/ui/Input.tsx",'textAlign={resolvedDirection === "rtl" ? "right" : "left"}',"content-aware input direction");
must("src/components/ui/ScreenHeader.tsx",'direction: "rtl"',"header RTL contract");
must("src/components/ui/ScreenHeader.tsx",'paddingHorizontal: horizontalPadding',"header/content gutter contract");
must("src/components/ui/ScreenHeader.tsx",'borderBottomWidth: StyleSheet.hairlineWidth',"header boundary contract");
must("src/components/ui/SectionHeader.tsx",'alignItems: "stretch"',"section copy stretches to Arabic start edge");
must("src/components/ui/FloatingGlassTabBar.tsx",'backdropFilter: "blur(22px) saturate(155%)"',"web glass blur");
must("src/components/ui/FloatingGlassTabBar.tsx","glassSurfaceSolid","glass material");
must("src/components/ui/FloatingGlassTabBar.tsx","topBorder","shared top border");

// Active nav must not paint a focused background behind icons.
const nav=read("src/components/ui/FloatingGlassTabBar.tsx");
if(/focused[^;\n]*backgroundColor|activeIcon[^}]*backgroundColor/s.test(nav)){
  failures.push("FloatingGlassTabBar: active icon must not receive a focused box/circle background");
}

// Known direction-sensitive surfaces.
for(const [file,tokens] of Object.entries({
  "src/features/reports/components/ReportDetailsScreen.tsx":["titleRow","timelineRow","personRow"],
  "src/features/reports/components/ReportSuccessView.tsx":["ScreenHeader","timelineRowItem"],
  "src/features/organizations/components/OrganizationCard.tsx":["direction: \"rtl\""],
})){
  for(const token of tokens) must(file,token,`direction contract ${token}`);
}

if(failures.length){
  console.error("UI consistency audit failed:\n"+failures.map(x=>`- ${x}`).join("\n"));
  process.exit(1);
}
console.log(`UI consistency audit passed: ${files.length} TS/TSX files; canonical Arabic text/screen/card/input/header contracts verified, all horizontal rows direction-explicit, raw Text eliminated, floating glass nav active state has no icon background.`);
