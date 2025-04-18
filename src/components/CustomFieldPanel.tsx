import { useDraggable } from "@dnd-kit/core";
import { FieldType } from "../types";
import {
  MdCheckBoxOutlineBlank,
  MdDragIndicator,
  MdLabel,
  MdOutlineRectangle,
} from "react-icons/md";
import { FaBox } from "react-icons/fa";
import { IoMdRadioButtonOff } from "react-icons/io";
import { CiText } from "react-icons/ci";
interface FieldItemProps {
  type: FieldType;
  label: string;
  icon?: React.ReactNode;
}

export const FieldItem = ({ type, label, icon }: FieldItemProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${type}`,
    data: {
      type,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center p-4 my-4 bg-white rounded-md border border-gray-200 cursor-grab hover:bg-gray-50"
    >
      <div className="w-5 h-5 mr-2 text-gray-500">{icon}</div>
      <span className="text-sm">{label}</span>
      <div className="ml-auto text-gray-400">
        <MdDragIndicator />
      </div>
    </div>
  );
};

const CustomFieldPanel = () => {
  const getIcon = (type: FieldType) => {
    switch (type) {
      case "label":
        return <MdLabel className="w-5 h-5" />;
      case "text-field":
        return <MdOutlineRectangle className="w-6 h-6" />;
      case "number-input":
        return <MdOutlineRectangle className="w-6 h-6" />;
      case "combo-box":
        return <FaBox className="w-5 h-5 text-gray-300" />;
      case "number-combo-box":
        return <FaBox className="w-5 h-5 text-gray-300" />;
      case "radio-button":
        return <IoMdRadioButtonOff className="w-5 h-5" />;
      case "checkbox":
        return <MdCheckBoxOutlineBlank className="w-5 h-5" />;
      case "datepicker":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
        );
      case "text-area":
        return <CiText className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const fieldTypes = [
    { type: "text-field", label: "Text Field" },
    { type: "number-input", label: "Number Input" },
    { type: "combo-box", label: "Combo Box / Dropdown" },
    { type: "number-combo-box", label: "Number Combo Box" },
    { type: "radio-button", label: "Radio Button" },
    { type: "checkbox", label: "Checkbox" },
    { type: "datepicker", label: "Datepicker" },
    { type: "label", label: "Label" },
    { type: "text-area", label: "Text Area" },
  ] as const;

  return (
    <div className="h-full bg-gray-100 rounded-md shadow-sm">
      <h2 className="p-4 text-lg font-semibold border-b border-gray-200">
        Custom Field
      </h2>
      <div className="px-4 pb-4">
        {fieldTypes.map((field) => (
          <FieldItem
            key={field.type}
            type={field.type}
            label={field.label}
            icon={getIcon(field.type)}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomFieldPanel;
