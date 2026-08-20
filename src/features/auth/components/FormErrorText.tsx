import AppText from "@/src/components/ui/AppText";
import { styles } from "./registrationShared.styles";

type Props = { message?: string };

export function FormErrorText({ message }: Props) {
  if (!message) return null;
  return <AppText style={styles.errorText}>{message}</AppText>;
}
