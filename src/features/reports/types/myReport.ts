export type MyReportStatus = "review" | "rescue" | "rescued";
export type MyReport = { id:string; title:string; code:string; location:string; imageUrl?:string; status:MyReportStatus; activeStep:0|1|2|3 };
