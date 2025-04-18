export type FieldType = 
  | 'label'
  | 'text-field'
  | 'number-input'
  | 'combo-box'
  | 'number-combo-box'
  | 'radio-button'
  | 'checkbox'
  | 'datepicker'
  | 'text-area';

export interface FieldOption {
  id: string;
  value: string;
}

export interface Field {
  id: string;
  type: FieldType;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  value?: string | number | boolean | Date;
}

export interface FieldSet {
  id: string;
  name: string;
  fields: Field[];
}

export interface Form {
  id: string;
  name: string;
  fieldsets: FieldSet[];
}
