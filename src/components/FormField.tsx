import { useState } from "react";
import { Field } from "../types";
import { useFormBuilder } from "../store/FormBuilderContext";

interface FormFieldProps {
  field: Field;
}

const FormField = ({ field }: FormFieldProps) => {
  const { selectField, duplicateField, deleteField, state } = useFormBuilder();
  const { selectedFieldId } = state;
  const [showActions, setShowActions] = useState(false);

  const isSelected = selectedFieldId === field.id;

  const handleFieldClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectField(field.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateField(field.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteField(field.id);
  };

  const renderFieldPreview = () => {
    switch (field.type) {
      case "label":
        return <div className="font-medium text-sm">{field.label}</div>;

      case "text-field":
        return (
          <div className="flex flex-col p-2">
            <label className="mb-1 text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <input
              type="text"
              placeholder={field.placeholder}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm"
              readOnly
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        );

      case "number-input":
        return (
          <div className="flex flex-col p-2">
            <label className="mb-1 text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <input
              type="number"
              placeholder={field.placeholder}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm"
              readOnly
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        );

      case "combo-box":
        return (
          <div className="flex flex-col p-2">
            <label className="mb-1 text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <select
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="" disabled selected>
                Select an option
              </option>
              {field.options?.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
          </div>
        );

      case "number-combo-box":
        return (
          <div className="flex flex-col p-2">
            <label className="mb-1 text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <select
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="" disabled selected>
                Select a number
              </option>
              {field.options?.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
          </div>
        );

      case "radio-button":
        return (
          <div className="flex flex-col p-2">
            <label className="mb-1 text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <div className="space-y-1 ml-1">
              {field.options?.map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    type="radio"
                    id={option.id}
                    name={field.id}
                    value={option.value}
                    className="w-3.5 h-3.5 mr-2 bg-white text-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label htmlFor={option.id} className="text-sm">
                    {option.value}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div className="flex flex-col p-2">
            <label className="mb-1 text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <div className="space-y-1 ml-1">
              {field.options ? (
                field.options.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={option.id}
                      className="w-3.5 h-3.5 mr-2 bg-white text-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label htmlFor={option.id} className="text-sm">
                      {option.value}
                    </label>
                  </div>
                ))
              ) : (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={field.id}
                    className="w-3.5 h-3.5 mr-2 bg-white text-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label htmlFor={field.id} className="text-sm">
                    Option
                  </label>
                </div>
              )}
            </div>
          </div>
        );

      case "datepicker":
        return (
          <div className="flex flex-col p-2">
            <label className="mb-1 text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <input
              type="date"
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        );

      case "text-area":
        return (
          <div className="flex flex-col p-2">
            <label className="mb-1 text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <textarea
              placeholder={field.placeholder}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm"
              rows={3}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        );

      default:
        return <div>Unknown field type</div>;
    }
  };

  return (
    <div
      className={`relative p-2 border rounded-md flex bg-gray-50 border-gray-200`}
      onClick={handleFieldClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex-grow">{renderFieldPreview()}</div>
      {/* Field actions */}
      {(showActions || isSelected) && (
        <div className="absolute top-1 right-1 flex space-x-1 bg-white rounded shadow-sm border border-gray-100 p-0.5">
          <button
            onClick={handleDuplicate}
            className="p-0.5 text-gray-500 hover:text-blue-500"
            title="Duplicate"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-0.5 text-gray-500 hover:text-red-500"
            title="Delete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
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
      )}
    </div>
  );
};

export default FormField;
