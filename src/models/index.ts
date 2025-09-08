
export interface Field {
  name: string;
  type: string;
  required?: boolean;
  default?: any;
  description?: string;
}

export interface Options {
  fields: Field[];
}

export interface Module {
  moduleName: string;
  options: Options;
}