export type ProjectFormMode =
  | { kind: 'edit'; projectId: string; redirectTo?: string }
  | { kind: 'create'; redirectTo?: (projectId: string) => string };
