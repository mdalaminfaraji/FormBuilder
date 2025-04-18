import { useState } from 'react';
import DragAndDropContext from './components/DragAndDropContext';
import CustomFieldPanel from './components/CustomFieldPanel';
import FormCanvas from './components/FormCanvas';
import FieldProperties from './components/FieldProperties';
import { FormBuilderProvider } from './store/FormBuilderContext';

function App() {
  const [formName] = useState('Form Builder');
  
  const handleSaveForm = () => {
    console.log('Form saved');
    // Implement save functionality if needed
  };
  
  const handleDraftForm = () => {
    console.log('Form saved as draft');
    // Implement draft save functionality if needed
  };

  return (
    <FormBuilderProvider>
      <DragAndDropContext>
        <div className="flex flex-col min-h-screen bg-gray-100">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <img src="https://codeiem.com/images/codeiem-logo.svg" alt="Logo" className="w-8 h-8 mr-2" />
                <div>
                  <h1 className="text-lg font-medium">{formName}</h1>
                  <p className="text-xs text-gray-500">Add and customize forms for your needs</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">
                  Changes saved 2 mins ago
                </span>
                <button className="text-gray-400 hover:text-gray-600 w-5 h-5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
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
