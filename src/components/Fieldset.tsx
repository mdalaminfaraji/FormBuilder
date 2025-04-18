import { useDroppable } from '@dnd-kit/core';
import { useFormBuilder } from '../store/FormBuilderContext';
import { FieldSet } from '../types';
import FormField from './FormField.tsx';

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

  // This function handles input click to prevent propagation to the fieldset
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleClick = () => {
    selectFieldset(fieldset.id);
  };

  return (
    <div
      ref={setNodeRef}
      className={`border rounded-md ${isSelected ? 'border-blue-400' : 'border-gray-200'} ${isOver ? 'bg-blue-50' : 'bg-white'}`}
      onClick={handleClick}
    >
      <div className="p-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <input 
            type="text" 
            className="flex-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-400 font-medium bg-white"
            value={fieldset.name}
            onChange={(e) => updateFieldset({
              ...fieldset,
              name: e.target.value,
            })}
            onClick={handleInputClick}
            placeholder="Enter field-set name"
          />
        </div>
        <span className="text-gray-400 text-xs px-2 py-1 bg-gray-50 rounded-md">{fieldset.fields.length} field(s)</span>
        <div className="flex space-x-1 text-gray-400">
          <button className="p-1 hover:text-gray-600" title="Move">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </button>
          <button className="p-1 hover:text-gray-600" title="More options">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {fieldset.fields.length === 0 ? (
        <div className="p-4 border-2 border-dashed border-gray-200 rounded-md m-4 text-center text-gray-400 text-sm">
          Drop fields here
        </div>
      ) : (
        <div className="p-2 space-y-2">
          {fieldset.fields.map((field) => (
            <FormField key={field.id} field={field} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Fieldset;
