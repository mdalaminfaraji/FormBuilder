import DragAndDropContext from "./components/DragAndDropContext";
import CustomFieldPanel from "./components/CustomFieldPanel";
import FormCanvas from "./components/FormCanvas";
import FieldProperties from "./components/FieldProperties";
import {
  FormBuilderProvider,
  useFormBuilder,
} from "./store/FormBuilderContext";
import Header from "./components/common/Header";
// FormActions component to handle API operations
function FormActions() {
  const { saveFormToApi, loadFormFromApi, state } = useFormBuilder();
  const { loading, error } = state;

  return (
    <div className="p-4 mb-4">
      <div className="flex justify-end items-center">
        <div className="space-x-2">
          <button
            onClick={loadFormFromApi}
            className="px-10 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Draft"}
          </button>
          <button
            onClick={saveFormToApi}
            className="px-5 py-2 bg-[#FF534F] text-white rounded-md hover:bg-[#ff694f] transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Save Form"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-md">
          Error: {error}
        </div>
      )}

      {loading && (
        <div className="mt-3 p-3 bg-blue-50 text-blue-700 rounded-md">
          Processing your request...
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <FormBuilderProvider>
      <DragAndDropContext>
        <div className="flex flex-col min-h-screen bg-gray-100">
          {/* Header */}
          <Header />

          {/* Main content */}
          <main className="flex-1 container mx-auto p-4">
            {/* API Controls */}

            <div className="grid grid-cols-12 gap-4">
              {/* Left panel - Custom Field */}
              <div className="col-span-3">
                <CustomFieldPanel />
              </div>

              {/* Center panel - Form Canvas */}
              <div className="col-span-6">
                <FormCanvas />
              </div>

              {/* Right panel - Field Properties */}
              <div className="col-span-3">
                <FieldProperties />
              </div>
            </div>
          </main>
          {/* Footer */}
          <footer>
            <div className="container mx-auto px-4 pb-10 flex justify-end space-x-3">
              <FormActions />
            </div>
          </footer>
        </div>
      </DragAndDropContext>
    </FormBuilderProvider>
  );
}

export default App;
