import { createContext, useContext, useReducer, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Field, FieldSet, Form, FieldType } from '../types';

// Define context types
interface FormBuilderState {
  form: Form;
  selectedFieldId: string | null;
  selectedFieldsetId: string | null;
}

type FormBuilderAction =
  | { type: 'ADD_FIELDSET'; payload: { name: string; id?: string } }
  | { type: 'ADD_FIELD'; payload: { fieldsetId: string; field: Field } }
  | { type: 'UPDATE_FIELD'; payload: { field: Field } }
  | { type: 'DELETE_FIELD'; payload: { fieldId: string } }
  | { type: 'UPDATE_FIELDSET'; payload: { fieldset: FieldSet } }
  | { type: 'DELETE_FIELDSET'; payload: { fieldsetId: string } }
  | { type: 'SELECT_FIELD'; payload: { fieldId: string } }
  | { type: 'SELECT_FIELDSET'; payload: { fieldsetId: string } }
  | { type: 'REORDER_FIELD'; payload: { fieldsetId: string; oldIndex: number; newIndex: number } }
  | { type: 'DUPLICATE_FIELD'; payload: { fieldId: string } };

interface FormBuilderContextType {
  state: FormBuilderState;
  addFieldset: (name: string, id?: string) => void;
  addField: (fieldsetId: string, type: FieldType) => void;
  updateField: (field: Field) => void;
  deleteField: (fieldId: string) => void;
  updateFieldset: (fieldset: FieldSet) => void;
  deleteFieldset: (fieldsetId: string) => void;
  selectField: (fieldId: string) => void;
  selectFieldset: (fieldsetId: string) => void;
  reorderField: (fieldsetId: string, oldIndex: number, newIndex: number) => void;
  duplicateField: (fieldId: string) => void;
  getFieldById: (fieldId: string) => Field | undefined;
  getFieldsetById: (fieldsetId: string) => FieldSet | undefined;
}

// Initial state
const initialState: FormBuilderState = {
  form: {
    id: uuidv4(),
    name: 'New Form',
    fieldsets: [],
  },
  selectedFieldId: null,
  selectedFieldsetId: null,
};

// Create context
export const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined);

// Reducer function
function formBuilderReducer(state: FormBuilderState, action: FormBuilderAction): FormBuilderState {
  switch (action.type) {
    case 'ADD_FIELDSET': {
      const newFieldset: FieldSet = {
        id: action.payload.id || uuidv4(),
        name: action.payload.name,
        fields: [],
      };
      return {
        ...state,
        form: {
          ...state.form,
          fieldsets: [...state.form.fieldsets, newFieldset],
        },
        selectedFieldsetId: newFieldset.id,
        selectedFieldId: null,
      };
    }

    case 'ADD_FIELD': {
      const { fieldsetId, field } = action.payload;
      return {
        ...state,
        form: {
          ...state.form,
          fieldsets: state.form.fieldsets.map((fieldset) =>
            fieldset.id === fieldsetId
              ? { ...fieldset, fields: [...fieldset.fields, field] }
              : fieldset
          ),
        },
        selectedFieldId: field.id,
        selectedFieldsetId: fieldsetId,
      };
    }

    case 'UPDATE_FIELD': {
      const { field } = action.payload;
      return {
        ...state,
        form: {
          ...state.form,
          fieldsets: state.form.fieldsets.map((fieldset) => ({
            ...fieldset,
            fields: fieldset.fields.map((f) => (f.id === field.id ? field : f)),
          })),
        },
      };
    }

    case 'DELETE_FIELD': {
      const { fieldId } = action.payload;
      return {
        ...state,
        form: {
          ...state.form,
          fieldsets: state.form.fieldsets.map((fieldset) => ({
            ...fieldset,
            fields: fieldset.fields.filter((field) => field.id !== fieldId),
          })),
        },
        selectedFieldId: null,
      };
    }

    case 'UPDATE_FIELDSET': {
      const { fieldset } = action.payload;
      return {
        ...state,
        form: {
          ...state.form,
          fieldsets: state.form.fieldsets.map((fs) =>
            fs.id === fieldset.id ? fieldset : fs
          ),
        },
      };
    }

    case 'DELETE_FIELDSET': {
      const { fieldsetId } = action.payload;
      return {
        ...state,
        form: {
          ...state.form,
          fieldsets: state.form.fieldsets.filter((fieldset) => fieldset.id !== fieldsetId),
        },
        selectedFieldsetId: null,
        selectedFieldId: null,
      };
    }

    case 'SELECT_FIELD': {
      const { fieldId } = action.payload;
      // Find the fieldset that contains this field
      let fieldsetId = null;
      for (const fieldset of state.form.fieldsets) {
        if (fieldset.fields.some(field => field.id === fieldId)) {
          fieldsetId = fieldset.id;
          break;
        }
      }
      
      return {
        ...state,
        selectedFieldId: fieldId,
        selectedFieldsetId: fieldsetId,
      };
    }

    case 'SELECT_FIELDSET': {
      return {
        ...state,
        selectedFieldsetId: action.payload.fieldsetId,
        selectedFieldId: null,
      };
    }

    case 'REORDER_FIELD': {
      const { fieldsetId, oldIndex, newIndex } = action.payload;
      const fieldset = state.form.fieldsets.find((fs) => fs.id === fieldsetId);
      
      if (!fieldset) return state;
      
      const newFields = [...fieldset.fields];
      const [removed] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, removed);
      
      return {
        ...state,
        form: {
          ...state.form,
          fieldsets: state.form.fieldsets.map((fs) =>
            fs.id === fieldsetId ? { ...fs, fields: newFields } : fs
          ),
        },
      };
    }

    case 'DUPLICATE_FIELD': {
      const { fieldId } = action.payload;
      let duplicatedField: Field | undefined;
      let fieldsetId: string | undefined;
      
      const updatedFieldsets = state.form.fieldsets.map((fieldset) => {
        const fieldIndex = fieldset.fields.findIndex((f) => f.id === fieldId);
        if (fieldIndex !== -1) {
          fieldsetId = fieldset.id;
          const originalField = fieldset.fields[fieldIndex];
          duplicatedField = {
            ...originalField,
            id: uuidv4(),
            name: `${originalField.name}_copy`,
            label: `${originalField.label} (Copy)`,
          };
          
          const newFields = [...fieldset.fields];
          newFields.splice(fieldIndex + 1, 0, duplicatedField);
          return { ...fieldset, fields: newFields };
        }
        return fieldset;
      });
      
      if (!duplicatedField) return state;
      
      return {
        ...state,
        form: {
          ...state.form,
          fieldsets: updatedFieldsets,
        },
        selectedFieldId: duplicatedField.id,
        selectedFieldsetId: fieldsetId || null,
      };
    }

    default:
      return state;
  }
}

// Provider component
export const FormBuilderProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(formBuilderReducer, initialState);

  // Helper function to find a field by ID
  const getFieldById = (fieldId: string): Field | undefined => {
    for (const fieldset of state.form.fieldsets) {
      const field = fieldset.fields.find((f) => f.id === fieldId);
      if (field) return field;
    }
    return undefined;
  };

  // Helper function to find a fieldset by ID
  const getFieldsetById = (fieldsetId: string): FieldSet | undefined => {
    return state.form.fieldsets.find((fs) => fs.id === fieldsetId);
  };

  // Actions
  const addFieldset = (name: string, id?: string) => {
    dispatch({ type: 'ADD_FIELDSET', payload: { name, id } });
  };

  const addField = (fieldsetId: string, type: FieldType) => {
    // Create a new field with default values based on type
    const newField: Field = {
      id: uuidv4(),
      type,
      name: `${type}_${uuidv4().slice(0, 8)}`,
      label: getDefaultLabelForType(type),
      placeholder: type === 'text-field' || type === 'number-input' || type === 'text-area' ? 'Enter value...' : undefined,
      required: false,
      options: (type === 'combo-box' || type === 'number-combo-box' || type === 'radio-button') 
        ? [
            { id: uuidv4(), value: 'Option 1' },
            { id: uuidv4(), value: 'Option 2' },
            { id: uuidv4(), value: 'Option 3' },
          ] 
        : undefined,
    };

    dispatch({ type: 'ADD_FIELD', payload: { fieldsetId, field: newField } });
  };

  const updateField = (field: Field) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { field } });
  };

  const deleteField = (fieldId: string) => {
    dispatch({ type: 'DELETE_FIELD', payload: { fieldId } });
  };

  const updateFieldset = (fieldset: FieldSet) => {
    dispatch({ type: 'UPDATE_FIELDSET', payload: { fieldset } });
  };

  const deleteFieldset = (fieldsetId: string) => {
    dispatch({ type: 'DELETE_FIELDSET', payload: { fieldsetId } });
  };

  const selectField = (fieldId: string) => {
    dispatch({ type: 'SELECT_FIELD', payload: { fieldId } });
  };

  const selectFieldset = (fieldsetId: string) => {
    dispatch({ type: 'SELECT_FIELDSET', payload: { fieldsetId } });
  };

  const reorderField = (fieldsetId: string, oldIndex: number, newIndex: number) => {
    dispatch({ type: 'REORDER_FIELD', payload: { fieldsetId, oldIndex, newIndex } });
  };

  const duplicateField = (fieldId: string) => {
    dispatch({ type: 'DUPLICATE_FIELD', payload: { fieldId } });
  };

  // Helper function to get default label for field type
  function getDefaultLabelForType(type: FieldType): string {
    switch (type) {
      case 'label':
        return 'Label';
      case 'text-field':
        return 'Text Field';
      case 'number-input':
        return 'Number Input';
      case 'combo-box':
        return 'Combo Box';
      case 'number-combo-box':
        return 'Number Combo Box';
      case 'radio-button':
        return 'Radio Button';
      case 'checkbox':
        return 'Checkbox';
      case 'datepicker':
        return 'Date Picker';
      case 'text-area':
        return 'Text Area';
      default:
        return 'Field';
    }
  }

  return (
    <FormBuilderContext.Provider
      value={{
        state,
        addFieldset,
        addField,
        updateField,
        deleteField,
        updateFieldset,
        deleteFieldset,
        selectField,
        selectFieldset,
        reorderField,
        duplicateField,
        getFieldById,
        getFieldsetById,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};

// Custom hook to use the form builder context
export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
};
