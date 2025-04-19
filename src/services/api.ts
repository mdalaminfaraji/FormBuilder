import { Form, FieldSet, Field, FieldType } from "../types";

const API_URL =
  "http://team.dev.helpabode.com:54292/api/wempro/react-dev/coding-test/alaminice1617@gmail.com";

/**
 * Convert the internal form state to the API expected format
 */
export const convertFormToApiFormat = (form: Form) => {
  return form.fieldsets.map((fieldset: FieldSet) => ({
    fieldsetName: fieldset.name,
    fieldsetTextId: fieldset.id,
    fields: fieldset.fields.map((field: Field) => ({
      labelName: field.label,
      labelTextId: field.id,
      inputType: mapFieldTypeToApiType(field.type),
      options: getFieldOptions(field),
    })),
  }));
};

/**
 * Convert API form data to internal format
 */
interface ApiField {
  labelName: string;
  labelTextId: string;
  inputType: string;
  options: string | string[];
}

interface ApiFieldset {
  fieldsetName: string;
  fieldsetTextId: string;
  fields: ApiField[];
}
interface ApiResponse {
  message: string;
  your_respons: ApiFieldset[] | string;
}

export const convertApiDataToFormState = (apiData: ApiResponse | ApiFieldset[]) => {
  console.log('API Data received:', apiData);
  
  let fieldsets: ApiFieldset[] = [];
  
  // Handle different response formats
  if (Array.isArray(apiData)) {
    // Direct array of fieldsets
    fieldsets = apiData;
  } else if (apiData?.your_respons) {
    if (typeof apiData.your_respons === 'string') {
      // String that needs to be parsed as JSON
      try {
        fieldsets = JSON.parse(apiData.your_respons);
        console.log('Parsed your_respons string into:', fieldsets);
      } catch (error) {
        console.error('Error parsing your_respons string:', error);
      }
    } else if (Array.isArray(apiData.your_respons)) {
      // Already an array
      fieldsets = apiData.your_respons;
    }
  }
  
  console.log('Fieldsets to process:', fieldsets);
  
  return {
    id: "form-" + Date.now(),
    name: "Imported Form",
    fieldsets: fieldsets.map((fieldset) => ({
      id: fieldset.fieldsetTextId,
      name: fieldset.fieldsetName,
      fields: fieldset.fields.map((field: ApiField) => ({
        id: field.labelTextId,
        type: mapApiTypeToFieldType(field.inputType),
        name: field.labelTextId, // Use labelTextId as name for unique identification
        label: field.labelName,
        required: false,
        options: parseFieldOptions(field),
      })),
    })),
  };
};

/**
 * Map internal field type to API field type
 */
const mapFieldTypeToApiType = (fieldType: string): string => {
  const typeMap: Record<string, string> = {
    "text-field": "text",
    "number-input": "number",
    "combo-box": "select",
    "radio-button": "radio",
    checkbox: "checkbox",
    datepicker: "date",
    "text-area": "textarea",
  };

  return typeMap[fieldType] || fieldType;
};

/**
 * Map API field type to internal field type
 */
const mapApiTypeToFieldType = (apiType: string): FieldType => {
  const typeMap: Record<string, FieldType> = {
    text: "text-field",
    number: "number-input",
    select: "combo-box",
    radio: "radio-button",
    checkbox: "checkbox",
    date: "datepicker",
    textarea: "text-area",
  };

  // Default to text-field if type is not recognized
  return typeMap[apiType] || "text-field";
};

/**
 * Get field options in the format expected by the API
 */
const getFieldOptions = (field: Field) => {
  if (!field.options || field.options.length === 0) {
    return "";
  }

  if (field.type === "combo-box" || field.type === "radio-button") {
    return field.options.map((opt: any) => opt.value);
  }

  return "";
};

/**
 * Parse field options from API format to internal format
 */
const parseFieldOptions = (field: ApiField) => {
  console.log('Parsing options for field:', field.labelName, 'Options:', field.options);
  
  // Handle empty options
  if (!field.options || field.options === "") {
    return [];
  }
  
  // Handle array options
  if (Array.isArray(field.options)) {
    // Create unique IDs for each option
    const timestamp = Date.now();
    return field.options.map((option: string, index: number) => ({
      id: `option-${timestamp}-${index}-${Math.random().toString(36).substring(2, 9)}`,
      value: option
    }));
  }
  
  console.warn('Unexpected options format:', field.options);
  return [];
};

/**
 * Save form to API
 */
export const saveFormToApi = async (formData: ApiFieldset[]) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving form:", error);
    throw new Error(
      "Failed to save form to API: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
};

/**
 * Load form from API
 */
export const loadFormFromApi = async () => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Raw API Response:', data);
    
    // The API response can have different structures, handle all possible cases
    if (Array.isArray(data)) {
      return data; // Direct array of fieldsets
    } else if (data.your_respons && Array.isArray(data.your_respons)) {
      return data; // Response with your_respons property
    } else if (data.your_response && Array.isArray(data.your_response)) {
      // Handle misspelling variation if needed
      return { your_respons: data.your_response };
    } else {
      console.error('Unexpected API response format:', data);
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    console.error('Error loading form:', error);
    throw new Error('Failed to load form from API: ' + (error instanceof Error ? error.message : String(error)));
  }
};
