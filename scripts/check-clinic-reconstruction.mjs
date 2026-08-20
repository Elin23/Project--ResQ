import fs from "node:fs";
import path from "node:path";
const root=process.cwd(), read=(f)=>fs.readFileSync(path.join(root,f),"utf8"), errors=[];
const must=(f,t)=>{if(!fs.existsSync(path.join(root,f))||!read(f).includes(t))errors.push(`${f}: ${t}`)};
for(const f of [
"src/features/clinic-dashboard/screens/ClinicDashboardScreen.tsx","src/features/clinic-dashboard/screens/ClinicProfileScreen.tsx",
"src/features/clinic-dashboard/screens/EditClinicProfileScreen.tsx","app/clinic/(adoption)/adoption.tsx",
"app/clinic/(notifications)/notifications.tsx","app/clinic/(profile)/reports/index.tsx","app/clinic-profile/edit.tsx"]) if(!fs.existsSync(path.join(root,f)))errors.push(`missing ${f}`);
const layout=read("app/clinic/_layout.tsx");
for(const x of ['"(adoption)"','"(map)"','"(notifications)"','"(profile)"'])if(!layout.includes(x))errors.push(`clinic tab ${x}`);
if(layout.includes('name="cases"')||layout.includes('name="services"'))errors.push("medical tabs remain");
const policy=read("src/features/session/accessPolicy.ts");
const ub=policy.match(/user:\s*new Set\(\[([\s\S]*?)\]\)/)?.[1]??"", cb=policy.match(/clinic:\s*new Set\(\[([\s\S]*?)\]\)/)?.[1]??"";
for(const c of ["browse","create-report","create-feeding-point","create-adoption-listing","view-own-submissions","view-notifications","view-adoption","apply-adoption","view-personal-account","edit-personal-account","view-personal-reports"])if(ub.includes(`"${c}"`)&&!cb.includes(`"${c}"`))errors.push(`missing user capability ${c}`);
for(const c of ["view-clinic-dashboard","manage-clinic-profile","manage-campaigns"])if(!cb.includes(`"${c}"`))errors.push(`missing clinic capability ${c}`);
if(policy.includes("manage-clinic-services"))errors.push("obsolete clinic services capability");
for(const t of ["اسم الشخص المسؤول","رقم الهاتف","واتساب","العنوان","الموقع الدقيق","طوارئ 24 ساعة","ساعات العمل","حفظ التعديلات"])must("src/features/clinic-dashboard/screens/EditClinicProfileScreen.tsx",t);
must("src/data/repositories/inMemoryServicePlaceRepository.ts","getClinicByAccountId");
must("src/data/repositories/inMemoryServicePlaceRepository.ts","updateClinicByAccountId");
for(const f of ["app/clinic/cases.tsx","app/clinic/services.tsx","src/features/clinic-dashboard/screens/ClinicCasesScreen.tsx","src/features/clinic-dashboard/screens/ClinicServicesScreen.tsx"])if(fs.existsSync(path.join(root,f)))errors.push(`obsolete ${f}`);
if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log("Clinic reconstruction check passed: user-equivalent permissions + clinic identity/campaign management; medical ERP removed.");
