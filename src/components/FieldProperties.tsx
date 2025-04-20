import { useState, useEffect, useCallback } from "react";
import { useFormBuilder } from "../store/FormBuilderContext";
import { FieldOption } from "../types";
import { v4 as uuidv4 } from "uuid";
import { FaPlus } from "react-icons/fa6";
const FieldProperties = () => {
  const { state, updateField, deleteField, getFieldById, updateFieldset } =
    useFormBuilder();
  const { selectedFieldId } = state;

  // All useState hooks at the top to follow React rules
  const [optionInput, setOptionInput] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [fieldsetNameInput, setFieldsetNameInput] = useState("");
  console.log(hasChanges);
  // Get current fieldset containing the selected field using useCallback to avoid dependency issues
  const getCurrentFieldset = useCallback(() => {
    if (!selectedFieldId) return null;
    return state.form.fieldsets.find((fs) =>
      fs.fields.some((field) => field.id === selectedFieldId)
    );
  }, [state.form.fieldsets, selectedFieldId]);

  // Find the selected field
  const selectedField = selectedFieldId ? getFieldById(selectedFieldId) : null;

  // Initialize fieldset name when a field is selected
  useEffect(() => {
    if (selectedField) {
      const fieldset = getCurrentFieldset();
      if (fieldset) {
        setFieldsetNameInput(fieldset.name);
      }
    }
  }, [selectedField, getCurrentFieldset]);

  if (!selectedField) {
    return null;
  }

  const handleFieldUpdate = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const updatedValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    updateField({
      ...selectedField,
      [name]: updatedValue,
    });

    setHasChanges(true);
  };

  const handleAddOption = () => {
    if (!optionInput.trim()) return;

    const newOption: FieldOption = {
      id: uuidv4(),
      value: optionInput.trim(),
    };

    const options = selectedField.options
      ? [...selectedField.options, newOption]
      : [newOption];

    updateField({
      ...selectedField,
      options,
    });

    setOptionInput("");
  };

  const handleDeleteOption = (optionId: string) => {
    if (!selectedField.options) return;

    const options = selectedField.options.filter(
      (option) => option.id !== optionId
    );

    updateField({
      ...selectedField,
      options,
    });
  };

  const handleOptionChange = (optionId: string, value: string) => {
    if (!selectedField.options) return;

    const options = selectedField.options.map((option) =>
      option.id === optionId ? { ...option, value } : option
    );

    updateField({
      ...selectedField,
      options,
    });
  };

  const handleDeleteField = () => {
    if (selectedFieldId) {
      deleteField(selectedFieldId);
    }
  };

  const handleFieldsetNameUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFieldsetNameInput(value);
    setHasChanges(true);
  };

  // Apply changes to fieldset name
  const applyFieldsetNameChange = () => {
    const fieldset = getCurrentFieldset();
    if (fieldset && fieldsetNameInput !== fieldset.name) {
      updateFieldset({
        ...fieldset,
        name: fieldsetNameInput,
      });
      return true;
    }
    return false;
  };

  const renderGeneralProperties = () => (
    <div className="mb-4">
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Field-set
        </label>
        <input
          type="text"
          name="fieldsetName"
          value={fieldsetNameInput}
          onChange={handleFieldsetNameUpdate}
          className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-gray-50"
          placeholder="Enter field-set name"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {selectedField.type === "combo-box"
            ? "Combo Box / Dropdown"
            : selectedField.type === "radio-button"
            ? "Radio Button"
            : selectedField.type === "checkbox"
            ? "Checkbox"
            : selectedField.type === "text-field"
            ? "Text Field"
            : selectedField.type === "number-input"
            ? "Number Input"
            : selectedField.type === "text-area"
            ? "Text Area"
            : selectedField.type === "datepicker"
            ? "Date Picker"
            : "Field"}
        </label>
        <input
          type="text"
          name="label"
          value={selectedField.label}
          onChange={handleFieldUpdate}
          className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
          placeholder="Enter field name"
        />
      </div>
      
      {/* Placeholder input field for text-field, number-input, and text-area */}
      {(selectedField.type === "text-field" || 
        selectedField.type === "number-input" || 
        selectedField.type === "text-area") && (
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Placeholder Text
          </label>
          <input
            type="text"
            name="placeholder"
            value={selectedField.placeholder || ""}
            onChange={handleFieldUpdate}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
            placeholder="Enter placeholder text"
          />
        </div>
      )}

      {/* <div className="mb-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="required"
            checked={selectedField.required || false}
            onChange={handleFieldUpdate}
            className="w-4 h-4 mr-2 text-blue-500 rounded"
          />
          <span className="text-sm font-medium">Required field</span>
        </label>
      </div> */}
    </div>
  );

  const renderOptionsEditor = () => {
    if (
      !["combo-box", "number-combo-box", "radio-button", "checkbox"].includes(
        selectedField.type
      )
    ) {
      return null;
    }

    return (
      <div className="mb-4">
        <div className="space-y-3">
          {selectedField.options?.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2">
              <input
                type="text"
                value={option.value}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-200 rounded-md text-sm"
                placeholder={`Option ${index + 1}`}
              />
              <button
                onClick={() => handleDeleteOption(option.id)}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Delete option"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}

          {/* Add new option input field with button */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={optionInput}
              onChange={(e) => setOptionInput(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-200 rounded-md text-sm"
              placeholder="Add new option"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddOption();
                }
              }}
            />
            <button
              onClick={handleAddOption}
              className="p-2 bg-blue-100 text-blue-500 rounded-lg hover:bg-blue-200"
              title="Add option"
              disabled={!optionInput.trim()}
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full p-4">
      <h2 className="mb-4 text-lg font-semibold">Field Properties</h2>

      {selectedField ? (
        <div className="space-y-4 bg-white p-4 rounded-lg">
          {renderGeneralProperties()}
          {renderOptionsEditor()}

          <div className="border-t border-gray-200 pt-4">
            <div className="flex mt-6 space-x-2">
              <button
                onClick={handleDeleteField}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  if (applyFieldsetNameChange()) {
                    // Show feedback that changes were applied
                    // For now, just reset the changes state
                  }
                  setHasChanges(false);
                }}
                className={`flex-1 px-4 py-2 text-white rounded-md text-sm font-medium bg-rose-500 hover:bg-rose-600`}
                // disabled={!hasChanges}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full -mt-16 text-center p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <p className="text-gray-500 mb-2">No field selected</p>
          <p className="text-gray-500">
            Select a field from the canvas to edit its properties
          </p>
        </div>
      )}
    </div>
  );
};

export default FieldProperties;
