import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialElements = [
  { id: '1', type: 'Text Input' },
  { id: '2', type: 'Textarea' },
  { id: '3', type: 'Checkbox' },
];

const FormBuilder = () => {
  const [formComponents, setFormComponents] = useState([]);
  const [savedForms, setSavedForms] = useState([]);

  useEffect(() => {
    fetchForms();
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const draggedElement = initialElements[result.source.index];
    setFormComponents([...formComponents, draggedElement]);
  };

  const saveForm = async () => {
    try {
      const response = await fetch('http://localhost/form-builder-backend/save_form.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_name: `Form_${Date.now()}`, // Assign a unique name
          form_data: formComponents, // Send the form components
        }),
      });
  
      const data = await response.json();
      console.log('Form saved:', data);
      fetchForms(); // Refresh the list after saving
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  const fetchForms = async () => {
    try {
      const response = await fetch('http://localhost/form-builder-backend/list_forms.php');
      const data = await response.json();
      console.log('Fetched Forms:', data); // Debugging fetched data
      setSavedForms(data); // Update state with fetched forms
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  return (
    <div>
      <h2>Form Builder</h2>

      {/* Drag and Drop Context */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="elements">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {initialElements.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: '10px',
                        margin: '5px',
                        border: '1px solid gray',
                        borderRadius: '4px',
                      }}
                    >
                      {item.type}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <h3>Form Preview</h3>
      <div>
        {formComponents.map((comp, index) => (
          <div key={index}>{comp.type}</div>
        ))}
      </div>

      <button onClick={saveForm}>Save Form</button>

      <h3>Saved Forms</h3>
      <ul>
        {savedForms.map((form) => (
          <li key={form.id}>
            <strong>{form.form_name}</strong>: {JSON.stringify(JSON.parse(form.form_data))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormBuilder;
