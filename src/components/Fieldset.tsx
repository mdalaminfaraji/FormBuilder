import { useDroppable } from "@dnd-kit/core";
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useFormBuilder } from "../store/FormBuilderContext";
import { FieldSet, Field } from "../types";
import FormField from "./FormField.tsx";
import { MdDragIndicator } from "react-icons/md";

interface FieldsetProps {
  fieldset: FieldSet;
}

// Sortable Field component for drag and drop reordering
const SortableField = ({ field, fieldsetId }: { field: Field; fieldsetId: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
    data: {
      type: 'field',
      field,
      fieldsetId
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`group relative mt-2 ${isDragging ? 'z-10' : ''}`}
    >
      {/* Drag handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-1 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 cursor-move"
      >
        <MdDragIndicator size={24} className={`${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
      </div>
      <div className="pl-6">
        <FormField field={field} />
      </div>
    </div>
  );
};

const Fieldset = ({ fieldset }: FieldsetProps) => {
  const { updateFieldset, selectFieldset, reorderField, state } = useFormBuilder();
  const { selectedFieldsetId } = state;

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 }, // Minimum distance before drag starts
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 }, // Touch delay and tolerance
    })
  );

  // Field drop area
  const { setNodeRef, isOver } = useDroppable({
    id: `fieldset-${fieldset.id}`,
    data: {
      fieldsetId: fieldset.id,
    },
  });

  const isSelected = selectedFieldsetId === fieldset.id;

  // Handle field reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fieldset.fields.findIndex(field => field.id === active.id);
      const newIndex = fieldset.fields.findIndex(field => field.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderField(fieldset.id, oldIndex, newIndex);
      }
    }
  };

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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fieldset.fields.map(field => field.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {fieldset.fields.map((field) => (
                  <SortableField 
                    key={field.id} 
                    field={field} 
                    fieldsetId={fieldset.id} 
                  />
                ))}

                {/* Drop area for new fields with dashed border */}
                {isOver && (
                  <div className="border-2 border-dashed border-rose-100 rounded-md p-4 flex items-center justify-center text-sm text-rose-300 bg-rose-50 bg-opacity-30">
                    Drop field here
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default Fieldset;
