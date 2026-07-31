import { StyleProp, ViewStyle } from "react-native";

import EmptyState from "./EmptyState";

type Props = {
  title?: string;
  description: string;
  retryTitle?: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function ErrorState({
  title = "حدث خطأ",
  description,
  retryTitle = "المحاولة مجددًا",
  onRetry,
  style,
}: Props) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon="alert-circle-outline"
      actionTitle={onRetry ? retryTitle : undefined}
      onActionPress={onRetry}
      style={style}
    />
  );
}
