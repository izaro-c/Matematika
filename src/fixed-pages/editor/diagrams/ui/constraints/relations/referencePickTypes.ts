export interface ReferencePickSession {
  key: string;
  allowedIds: readonly string[];
  hint: string;
  onPick: (id: string) => void;
  onReject?: (id: string) => void;
}
