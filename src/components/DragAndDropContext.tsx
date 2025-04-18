import { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useFormBuilder } from '../store/FormBuilderContext';
import { v4 as uuidv4 } from 'uuid';
import { FieldType } from '../types';

interface DragAndDropContextProps {
  children: React.ReactNode;
}

const DragAndDropContext = ({ children }: DragAndDropContextProps) => {
  const { addField, addFieldset } = useFormBuilder();
  const [, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = () => {
    // Optional: Add visual feedback when dragging over valid drop areas
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    // Handle dropping a field from sidebar onto a fieldset
    if (active.id.toString().startsWith('draggable-') && over.id.toString().startsWith('fieldset-')) {
      const fieldType = active.data.current?.type as FieldType;
      const fieldsetId = (over.id as string).replace('fieldset-', '');
      
      if (fieldsetId && fieldType) {
        addField(fieldsetId, fieldType);
      }
      return;
    }

    // Handle dropping a field from sidebar onto the canvas (create new fieldset)
    if (active.id.toString().startsWith('draggable-') && over.id === 'form-canvas') {
      const fieldType = active.data.current?.type as FieldType;
      if (fieldType) {
        // Create a new fieldset
        const fieldsetName = `Field-set ${uuidv4().slice(0, 5)}`;
        addFieldset(fieldsetName);
        
        // The field will be added in the next render cycle as we need the new fieldset ID
        // The FormBuilderProvider handles this with the 'ADD_FIELDSET' action
      }
      return;
    }

    // Handle re-ordering fields (implement later if needed)
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
};

export default DragAndDropContext;
