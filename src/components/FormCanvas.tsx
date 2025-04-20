import { useState } from "react";
import { useDroppable, useDndMonitor } from "@dnd-kit/core";
import { useFormBuilder } from "../store/FormBuilderContext";
import Fieldset from "./Fieldset.tsx";

const FormCanvas = () => {
  const { state } = useFormBuilder();
  const { form } = state;
  // Track when a custom field is being dragged and which drop zone is active
  const [isDragging, setIsDragging] = useState(false);
  const [dropTarget, setDropTarget] = useState<number | null>(null);

  // Setup monitor for drag events from custom field panel
  useDndMonitor({
    onDragStart(event) {
      // Check if it's a draggable item from the custom field panel
      const { active } = event;
      if (
        active?.id &&
        typeof active.id === "string" &&
        active.id.startsWith("draggable-")
      ) {
        console.log("Field being dragged from panel:", active.id);
        setIsDragging(true);
        // Initialize with the end position as default target
        setDropTarget(form?.fieldsets?.length || 0);
      }
    },
    onDragEnd() {
      // Hide drop zones when drag ends
      setIsDragging(false);
      setDropTarget(null);
    },
    onDragOver(event) {
      // Determine which drop zone is being targeted
      const { over } = event;

      if (over?.id === "form-canvas") {
        // If over the canvas but not a specific drop zone, default to the end
        setDropTarget(form?.fieldsets?.length || 0);
      } else if (
        over?.id &&
        typeof over.id === "string" &&
        over.id.startsWith("drop-zone-")
      ) {
        // Extract the drop zone index from the ID
        const indexStr = over.id.replace("drop-zone-", "");
        const index = parseInt(indexStr, 10);
        if (!isNaN(index)) {
          setDropTarget(index);
        }
      } else {
        // Not over any valid drop target
        setDropTarget(null);
      }
    },
  });

  const { setNodeRef } = useDroppable({
    id: "form-canvas",
  });

  return (
    <div className="flex flex-col min-h-[97%] p-4 " ref={setNodeRef}>
      <h2 className="mb-4 text-lg font-semibold ">Your Module</h2>

      <div className="flex-1 overflow-auto bg-white rounded-lg">
        {form?.fieldsets?.length === 0 && !isDragging ? (
          <div className="flex flex-col mt-44 items-center justify-center h-full text-center p-8">
            <img src="/builder.png" alt="Logo" className="w-11 h-11 " />
            <p className="text-gray-500 mb-2 mt-3">
              Welcome to the Form Builder! Start by adding your first module to
            </p>
            <p className="text-gray-500">create amazing forms.</p>

            {/* Drop zone when canvas is empty - simplified to always highlight when empty */}
            {isDragging && (
              <div
                id="drop-zone-0"
                className="border-2 border-dashed border-rose-400 rounded-md p-5 mt-8 w-full
                    flex items-center justify-center text-sm text-rose-300 
                    bg-rose-100 bg-opacity-50 transition-all duration-200 shadow-md"
              >
                Drop here to create a module
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 p-4 mt-4 relative">
            {/* Only show the active drop zone - at the beginning if selected */}
            {isDragging && dropTarget === 0 && (
              <div
                id="drop-zone-0"
                className="border-2 border-dashed border-rose-400 rounded-md p-4 mb-5
                     flex items-center justify-center text-sm text-rose-300 
                     bg-rose-100 bg-opacity-50 shadow-md transition-all duration-200"
              >
                Drop here to create a module
              </div>
            )}

            {form?.fieldsets?.map((fieldset, index) => (
              <div key={fieldset.id} className="relative">
                {/* The fieldset itself */}
                <Fieldset fieldset={fieldset} />

                {/* Only show drop zone after this fieldset if it's the active target */}
                {isDragging && dropTarget === index + 1 && (
                  <div
                    id={`drop-zone-${index + 1}`}
                    className="border-2 border-dashed border-rose-400 rounded-md p-4 my-4
                         flex items-center justify-center text-sm text-rose-300 
                         bg-rose-100 bg-opacity-50 shadow-md transition-all duration-200"
                  >
                    Drop here to create a module
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCanvas;
