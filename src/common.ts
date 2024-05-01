export interface Field {
  name: string;
  polaceholder: string;
  lable: boolean;
  labelValue: string;
  type: types;
  required: boolean;
  state: boolean;
}
export interface formSettings {
  generateState: boolean;
  componentType: componentType;
  stateType: stateType;
}

export enum stateType {
  multiple = "multiple",
  singleObject = "single Object",
}
export enum componentType {
  functional = "functional",
  class = "class",
}
export enum types {
  text = "text",
  number = "number",
  email = "email",
  password = "password",
}
