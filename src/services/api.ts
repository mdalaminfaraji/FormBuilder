import { Form, FieldSet, Field, FieldType } from "../types";

// Use Vite's environment variables with import.meta.env and provide a fallback
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Convert the internal form state to the API expected format
 */
export const convertFormToApiFormat = (form: Form) => {
  return form.fieldsets.map((fieldset: FieldSet) => ({
    fieldsetName: fieldset.name,
    fieldsetTextId: fieldset.id,
    fields: fieldset.fields.map((field: Field) => {
      // Base field properties
      const apiField: ApiField = {
        labelName: field.label,
        labelTextId: field.id,
        inputType: mapFieldTypeToApiType(field.type),
        options: getFieldOptions(field),
      };

      // Add placeholder if present (for text-field, number-input, text-area)
      if (
        field.placeholder &&
        ["text-field", "number-input", "text-area"].includes(field.type)
      ) {
        apiField.placeholder = field.placeholder;
      }

      return apiField;
    }),
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
  placeholder?: string; // Adding placeholder support
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

export const convertApiDataToFormState = (
  apiData: ApiResponse | ApiFieldset[]
) => {
  console.log("API Data received:", apiData);

  let fieldsets: ApiFieldset[] = [];

  // Handle different response formats
  if (Array.isArray(apiData)) {
    // Direct array of fieldsets
    fieldsets = apiData;
  } else if (apiData?.your_respons) {
    if (typeof apiData.your_respons === "string") {
      // String that needs to be parsed as JSON
      try {
        fieldsets = JSON.parse(apiData.your_respons);
        console.log("Parsed your_respons string into:", fieldsets);
      } catch (error) {
        console.error("Error parsing your_respons string:", error);
      }
    } else if (Array.isArray(apiData.your_respons)) {
      // Already an array
      fieldsets = apiData.your_respons;
    }
  }

  console.log("Fieldsets to process:", fieldsets);

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
        placeholder: field.placeholder, // Include placeholder text if available
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
    "number-combo-box": "select",
    "radio-button": "radio",
    checkbox: "checkbox",
    datepicker: "date",
    "text-area": "textarea",
  };

  console.log(
    `Mapping internal field type '${fieldType}' to API type '${
      typeMap[fieldType] || fieldType
    }'`
  );
  return typeMap[fieldType] || fieldType;
};

/**
 * Map API field type to internal field type
 */
const mapApiTypeToFieldType = (apiType: string): FieldType => {
  const typeMap: Record<string, FieldType> = {
    text: "text-field",
    number: "number-input",
    select: "combo-box", // Default select to combo-box
    radio: "radio-button",
    checkbox: "checkbox",
    date: "datepicker",
    textarea: "text-area",
  };

  console.log(
    `Mapping API field type '${apiType}' to internal type '${
      typeMap[apiType] || "text-field"
    }'`
  );
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

  // Handle all field types that have options
  if (
    field.type === "combo-box" ||
    field.type === "number-combo-box" ||
    field.type === "radio-button" ||
    field.type === "checkbox"
  ) {
    console.log(`Getting options for ${field.type} field:`, field.options);
    return field.options.map((opt) => opt.value);
  }

  return "";
};

/**
 * Parse field options from API format to internal format
 */
const parseFieldOptions = (field: ApiField) => {
  console.log(
    "Parsing options for field:",
    field.labelName,
    "Type:",
    field.inputType,
    "Options:",
    field.options
  );

  // Handle empty options
  if (!field.options || field.options === "") {
    return [];
  }

  // Handle array options for any field type that should have options
  // This includes select (combo-box), radio, checkbox
  if (
    Array.isArray(field.options) &&
    (field.inputType === "select" ||
      field.inputType === "radio" ||
      field.inputType === "checkbox")
  ) {
    // Create unique IDs for each option
    const timestamp = Date.now();
    const parsedOptions = field.options.map(
      (option: string, index: number) => ({
        id: `option-${timestamp}-${index}-${Math.random()
          .toString(36)
          .substring(2, 9)}`,
        value: option,
      })
    );
    console.log("Parsed options:", parsedOptions);
    return parsedOptions;
  }

  console.warn("Unexpected options format:", field.options);
  return [];
};

/**
 * Save form to API
 */
export const saveFormToApi = async (formData: ApiFieldset[]) => {
  try {
    // Log fields with placeholders to verify they're being sent
    const fieldsWithPlaceholders = formData.flatMap((fieldset) =>
      fieldset.fields
        .filter((field) => field.placeholder)
        .map((field) => ({
          fieldsetId: fieldset.fieldsetTextId,
          fieldId: field.labelTextId,
          type: field.inputType,
          placeholder: field.placeholder,
        }))
    );

    console.log(
      "Sending fields with placeholders to API:",
      fieldsWithPlaceholders
    );

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

    const responseData = await response.json();
    console.log("API Save Response:", responseData);
    return responseData;
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
    console.log("Raw API Response:", data);

    // The API response can have different structures, handle all possible cases
    let responseData;
    if (Array.isArray(data)) {
      responseData = data; // Direct array of fieldsets
    } else if (data.your_respons) {
      if (typeof data.your_respons === "string") {
        // Parse the JSON string if needed
        try {
          responseData = JSON.parse(data.your_respons);
        } catch (parseError) {
          console.error("Error parsing your_respons string:", parseError);
          responseData = [];
        }
      } else if (Array.isArray(data.your_respons)) {
        responseData = data.your_respons;
      }
    } else if (data.your_response && Array.isArray(data.your_response)) {
      // Handle misspelling variation if needed
      responseData = data.your_response;
    } else {
      console.error("Unexpected API response format:", data);
      throw new Error("Unexpected API response format");
    }

    // Log placeholder data to verify it's being loaded correctly
    const fieldsWithPlaceholders = responseData.flatMap(
      (fieldset: ApiFieldset) =>
        fieldset.fields
          .filter((field: ApiField) => field.placeholder)
          .map((field: ApiField) => ({
            fieldsetId: fieldset.fieldsetTextId,
            fieldId: field.labelTextId,
            type: field.inputType,
            placeholder: field.placeholder,
          }))
    );

    console.log("Fields with placeholders from API:", fieldsWithPlaceholders);

    // Create a proper ApiResponse object to match the expected type
    const apiResponse: ApiResponse = {
      message: "Success",
      your_respons: responseData,
    };

    return apiResponse;
  } catch (error) {
    console.error("Error loading form:", error);
    throw new Error(
      "Failed to load form from API: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
};
