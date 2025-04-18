import DragAndDropContext from "./components/DragAndDropContext";
import CustomFieldPanel from "./components/CustomFieldPanel";
import FormCanvas from "./components/FormCanvas";
import FieldProperties from "./components/FieldProperties";
import { FormBuilderProvider } from "./store/FormBuilderContext";
import { MdOutlineRemoveRedEye } from "react-icons/md";
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
          <header className="bg-white">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="pr-6 border-r-2 border-gray-200">
                  <img
                    src="/wempro_logo.png"
                    alt="Logo"
                    className="w-11 h-11 "
                  />
                </div>
                <div>
                  <h1 className="text-lg font-semibold ">Form Builder</h1>
                  <p className="text-sm text-[#636366] font-medium">
                    Add and customize forms for your needs
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-[#636366] font-medium mr-2">
                  Changes saved 2 mins ago
                </span>
                <button className="bg-[#E8EDF4]  w-10 h-10 rounded-xl flex items-center justify-center">
                  <MdOutlineRemoveRedEye className="w-5 h-5 text-[#1C51B8" />
                </button>
              </div>
            </div>
          </header>

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
