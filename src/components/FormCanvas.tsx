import { useDroppable } from "@dnd-kit/core";
import { useFormBuilder } from "../store/FormBuilderContext";
import Fieldset from "./Fieldset.tsx";

const FormCanvas = () => {
  const { state } = useFormBuilder();
  const { form } = state;

  const { setNodeRef, isOver } = useDroppable({
    id: "form-canvas",
  });

  // No demo data initialization - canvas starts empty
  // Form elements will be added only through user drag and drop actions

  return (
    <div
      className="flex flex-col h-full p-4 bg-white rounded-md shadow-sm"
      ref={setNodeRef}
    >
      <h2 className="mb-4 text-lg font-semibold border-b border-gray-200 pb-3">
        Your Module
      </h2>

      <div className="flex-1 overflow-auto">
        {form.fieldsets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-500 mb-2">
              Welcome to the Form Builder! Start by adding your first module to
            </p>
            <p className="text-gray-500">create amazing forms.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {form.fieldsets.map((fieldset) => (
              <Fieldset key={fieldset.id} fieldset={fieldset} />
            ))}
          </div>
        )}
      </div>

      {/* Invisible drop area indicator when dragging */}
      {/* {isOver && (
        <div className="absolute inset-0 bg-blue-100 bg-opacity-20 pointer-events-none border-2 border-blue-300 rounded" />
      )} */}
    </div>
  );
};

export default FormCanvas;
