import { useDroppable } from "@dnd-kit/core";
import { useFormBuilder } from "../store/FormBuilderContext";
import Fieldset from "./Fieldset.tsx";

const FormCanvas = () => {
  const { state } = useFormBuilder();
  const { form } = state;

  const { setNodeRef } = useDroppable({
    id: "form-canvas",
  });

  return (
    <div className="flex flex-col min-h-[97%] p-4 " ref={setNodeRef}>
      <h2 className="mb-4 text-lg font-semibold ">Your Module</h2>

      <div className="flex-1 overflow-auto bg-white rounded-lg">
        {form?.fieldsets?.length === 0 ? (
          <div className="flex flex-col mt-44 items-center justify-center h-full text-center p-8">
            <img src="/builder.png" alt="Logo" className="w-11 h-11 " />
            <p className="text-gray-500 mb-2 mt-3">
              Welcome to the Form Builder! Start by adding your first module to
            </p>
            <p className="text-gray-500">create amazing forms.</p>
          </div>
        ) : (
          <div className="space-y-6 p-4 mt-4">
            {form?.fieldsets?.map((fieldset) => (
              <Fieldset key={fieldset.id} fieldset={fieldset} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCanvas;
