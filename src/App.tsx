import DragAndDropContext from "./components/DragAndDropContext";
import CustomFieldPanel from "./components/CustomFieldPanel";
import FormCanvas from "./components/FormCanvas";
import FieldProperties from "./components/FieldProperties";
import { FormBuilderProvider } from "./store/FormBuilderContext";
import Header from "./components/common/Header";
function App() {
  const handleSaveForm = () => {
    console.log("Form saved");
    // Implement save functionality if needed
  };

  const handleDraftForm = () => {
    console.log("Form saved as draft");
    // Implement draft save functionality if needed
  };

  return (
    <FormBuilderProvider>
      <DragAndDropContext>
        <div className="flex flex-col min-h-screen bg-gray-100">
          {/* Header */}
          <Header />

          {/* Main content */}
          <main className="flex-1 container mx-auto p-4">
            <div className="grid grid-cols-12 gap-4 h-[calc(100vh-10rem)]">
              {/* Left panel - Custom Field */}
              <div className="col-span-3">
                <CustomFieldPanel />
              </div>

              {/* Center panel - Form Canvas */}
              <div className="col-span-5">
                <FormCanvas />
              </div>

              {/* Right panel - Field Properties */}
              <div className="col-span-4">
                <FieldProperties />
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-end space-x-3">
              <button
                onClick={handleDraftForm}
                className="px-5 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
              >
                Draft
              </button>
              <button
                onClick={handleSaveForm}
                className="px-5 py-1.5 bg-rose-500 text-white rounded-md hover:bg-rose-600 text-sm font-medium"
              >
                Save Form
              </button>
            </div>
          </footer>
        </div>
      </DragAndDropContext>
    </FormBuilderProvider>
  );
}

export default App;
