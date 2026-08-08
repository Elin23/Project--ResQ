import { useMemo, useState } from "react";import { MY_REPORTS } from "../constants/myReports";import type { MyReportStatus } from "../types/myReport";
export type ReportFilter="all"|MyReportStatus;
export function useMyReports(){const[filter,setFilter]=useState<ReportFilter>("all");const[query,setQuery]=useState("");const reports=useMemo(()=>MY_REPORTS.filter(x=>(filter==="all"||x.status===filter)&&(x.title.includes(query)||x.code.includes(query))),[filter,query]);return{reports,filter,setFilter,query,setQuery,stats:{all:18,mine:4,rescued:3}}}
