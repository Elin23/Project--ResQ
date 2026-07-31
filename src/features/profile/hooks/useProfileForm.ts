import { useState } from "react";
export function useProfileForm() {
  const [phone, setPhone] = useState("");
  return { phone, setPhone, submit: () => undefined };
}
