import { useDroppable } from "@dnd-kit/core";
import { useFormBuilder } from "../store/FormBuilderContext";
import { FieldSet } from "../types";
import FormField from "./FormField.tsx";
import { MdDragIndicator } from "react-icons/md";

interface FieldsetProps {
  fieldset: FieldSet;
}

const Fieldset = ({ fieldset }: FieldsetProps) => {
  const { updateFieldset, selectFieldset, state } = useFormBuilder();
  const { selectedFieldsetId } = state;

  const { setNodeRef, isOver } = useDroppable({
    id: `fieldset-${fieldset.id}`,
    data: {
      fieldsetId: fieldset.id,
    },
  });

  const isSelected = selectedFieldsetId === fieldset.id;

  // Handle click on the fieldset
  const handleClick = () => {
    selectFieldset(fieldset.id);
  };

  // Handle field-set name input to prevent propagation
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      className={`relative border rounded-lg ${
        isSelected ? "border-blue-400" : "border-gray-200"
      } 
                 ${isOver ? "bg-blue-50" : "bg-white"}`}
      onClick={handleClick}
    >
      {/* Field-set name as legend */}
      <div className="absolute -top-3.5 left-3 bg-white px-2">
        <input
          type="text"
          className="w-36 px-2 py-0.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={fieldset.name}
          onChange={(e) =>
            updateFieldset({
              ...fieldset,
              name: e.target.value,
            })
          }
          onClick={handleInputClick}
          placeholder="Field-set"
        />
      </div>

      {/* Field-set content */}
      <div className="pt-5 pb-3 px-4">
        {fieldset.fields.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-gray-200 rounded-md text-center text-gray-400 text-sm">
            Drop fields here
          </div>
        ) : (
          <div className="space-y-3">
            {fieldset.fields.map((field) => (
              <div key={field.id} className="group relative mt-2">
                {/* Drag handle */}
                <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 cursor-move">
                  <MdDragIndicator size={24} className="text-gray-400" />
                </div>
                <div className="pl-6">
                  <FormField field={field} />
                </div>
              </div>
            ))}

            {/* Drop area for new fields with dashed border */}
            {isOver && (
              <div className="border-2 border-dashed border-rose-100 rounded-md p-4 flex items-center justify-center text-sm text-rose-300 bg-rose-50 bg-opacity-30">
                Drop field here
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Fieldset;
