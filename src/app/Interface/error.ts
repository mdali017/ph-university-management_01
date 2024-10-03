export type TErrorSource = {
  path: string;
  message: string;
}[];

export type TGenericResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSource;
};
