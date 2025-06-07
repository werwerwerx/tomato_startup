export type ApiResponse<M extends string, E extends string, D = unknown> = {
  message?: M;
  data?: D;
  error?: E | null;
};