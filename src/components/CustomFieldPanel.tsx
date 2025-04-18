import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
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
  icon: React.ReactNode;
  index: number;
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
}

export const FieldItem = ({
  type,
  label,
  icon,
  index,
  onReorder,
}: FieldItemProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isOverDropArea, setIsOverDropArea] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${type}-${index}`,
    data: {
      type,
      index,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
      }
    : undefined;

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(false);
    if (isOverDropArea) {
      // Get the drop target element
      let clientX = 0;
      let clientY = 0;

      if ("clientX" in e.nativeEvent) {
        // It's a MouseEvent
        clientX = e.nativeEvent.clientX;
        clientY = e.nativeEvent.clientY;
      } else if (
        e.nativeEvent instanceof TouchEvent &&
        e.nativeEvent.touches.length > 0
      ) {
        // It's a TouchEvent
        clientX = e.nativeEvent.touches[0].clientX;
        clientY = e.nativeEvent.touches[0].clientY;
      }

      const elements = document.elementsFromPoint(clientX, clientY);

      // Find the target FieldItem
      const targetItem = elements.find(
        (el) => el.classList.contains("field-item") && el !== e.currentTarget
      );

      if (targetItem) {
        const targetIndex = parseInt(
          targetItem.getAttribute("data-index") || "0",
          10
        );
        // Call onReorder to swap positions
        onReorder(index, targetIndex);
      }
    }
    setIsOverDropArea(false);
  };

  const handleDragOver = (e: React.MouseEvent) => {
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    // Check if hovering over another field item
    const isOverItem = elements.some(
      (el) => el.classList.contains("field-item") && el !== e.currentTarget
    );
    setIsOverDropArea(isOverItem);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`field-item flex items-center p-4 my-4 bg-white rounded-lg border-gray-200 cursor-grab hover:bg-gray-50`}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={isDragging ? handleDragOver : undefined}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
      data-index={index}
    >
      <div className="w-5 h-5 mr-2 text-gray-500">{icon}</div>
      <span className="text-sm">{label}</span>
      <div
        className={`ml-auto ${isDragging ? "text-[#4DAC85]" : "text-gray-400"}`}
      >
        <MdDragIndicator size={18} />
      </div>
    </div>
  );
};

const CustomFieldPanel = () => {
  const [fieldItems, setFieldItems] = useState([
    { type: "text-field" as const, label: "Text Field" },
    { type: "number-input" as const, label: "Number Input" },
    { type: "combo-box" as const, label: "Combo Box / Dropdown" },
    { type: "number-combo-box" as const, label: "Number Combo Box" },
    { type: "radio-button" as const, label: "Radio Button" },
    { type: "checkbox" as const, label: "Checkbox" },
    { type: "datepicker" as const, label: "Datepicker" },
    { type: "label" as const, label: "Label" },
    { type: "text-area" as const, label: "Text Area" },
  ]);

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

  const handleReorder = (sourceIndex: number, destinationIndex: number) => {
    const updatedItems = [...fieldItems];
    const [removed] = updatedItems.splice(sourceIndex, 1);
    updatedItems.splice(destinationIndex, 0, removed);
    setFieldItems(updatedItems);
  };

  return (
    <div className="h-full bg-gray-100 rounded-md ">
      <h2 className="px-4 pt-4 text-lg font-semibold ">Custom Field</h2>
      <div className=" pb-4">
        {fieldItems.map((field, index) => (
          <FieldItem
            key={`${field.type}-${index}`}
            type={field.type}
            label={field.label}
            icon={getIcon(field.type)}
            index={index}
            onReorder={handleReorder}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomFieldPanel;
