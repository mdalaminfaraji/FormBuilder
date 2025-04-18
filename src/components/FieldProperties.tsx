import { useState } from "react";
import { useFormBuilder } from "../store/FormBuilderContext";
import { FieldOption } from "../types";
import { v4 as uuidv4 } from "uuid";

const FieldProperties = () => {
  const { state, updateField, deleteField, getFieldById } = useFormBuilder();
  const { selectedFieldId } = state;

  const selectedField = selectedFieldId ? getFieldById(selectedFieldId) : null;
  const [optionInput, setOptionInput] = useState("");

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

  const renderGeneralProperties = () => (
    <div className="mb-4">
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Field-set
        </label>
        <input
          type="text"
          name="fieldsetName"
          value="Enter field-set name"
          readOnly
          className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm bg-gray-50"
        />
      </div>

      {selectedField.type === "checkbox" && (
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Checkbox
          </label>
          <input
            type="text"
            name="label"
            value={selectedField.label}
            onChange={handleFieldUpdate}
            className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm"
            placeholder="Enter field name"
          />
        </div>
      )}

      {(selectedField.type === "text-field" ||
        selectedField.type === "number-input" ||
        selectedField.type === "combo-box" ||
        selectedField.type === "number-combo-box" ||
        selectedField.type === "radio-button" ||
        selectedField.type === "datepicker" ||
        selectedField.type === "text-area") && (
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {selectedField.type === "combo-box"
              ? "Combo Box / Dropdown"
              : selectedField.label}
          </label>
          <input
            type="text"
            name="label"
            value={selectedField.label}
            onChange={handleFieldUpdate}
            className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm"
            placeholder="Enter field name"
          />
        </div>
      )}

      <div className="mb-3 hidden">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="required"
            checked={selectedField.required || false}
            onChange={handleFieldUpdate}
            className="w-3.5 h-3.5 mr-2 text-blue-500"
          />
          <span className="text-sm">Required</span>
        </label>
      </div>
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
        {/* We don't need a label here as it's implied by the field type */}

        <div className="mb-2 space-y-1">
          {selectedField.options?.map((option, index) => (
            <div key={option.id} className="flex items-center">
              <div className="flex-grow">
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) =>
                    handleOptionChange(option.id, e.target.value)
                  }
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm"
                  placeholder={`Option ${index + 1}`}
                />
              </div>
              <button
                onClick={() => handleDeleteOption(option.id)}
                className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                title="Delete option"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3">
          <button
            onClick={handleAddOption}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-200 inline-flex items-center"
          >
            <span className="mr-1">+</span> Add new option
          </button>
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
              <button className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 text-sm font-medium">
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
