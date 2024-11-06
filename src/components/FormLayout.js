import React, { useState, useEffect } from 'react';
import './FormLayout.css'; // For styles

const FormLayout = () => {
  const [formData, setFormData] = useState({
    basicInfo: { firstName: '', lastName: '', leadType: '', leadSource: '' },
    essentialDates: { dob: '', anniversaryDate: '' },
    contactInfo: { officePhone: '', primaryEmail: '', homePhone: '' },
    addressInfo: { addressLine1: '', city: '', zip: '' },
  });

  const [savedForms, setSavedForms] = useState([]); // State for storing saved forms

  // Fetch saved forms from the backend
  const fetchForms = async () => {
    try {
      const response = await fetch('http://localhost/form-builder-backend/list_forms.php');
      const data = await response.json();
      console.log('Fetched forms:', data);
      setSavedForms(data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  // Call fetchForms when the component mounts
  useEffect(() => {
    fetchForms();
  }, []);

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/form-builder-backend/save_form.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log('Form submitted successfully:', result);

      // Refresh the saved forms after submitting
      fetchForms();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="section">
        <h2>Basic Information</h2>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            value={formData.basicInfo.firstName}
            onChange={(e) => handleInputChange('basicInfo', 'firstName', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={formData.basicInfo.lastName}
            onChange={(e) => handleInputChange('basicInfo', 'lastName', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Lead Type:</label>
          <input
            type="text"
            value={formData.basicInfo.leadType}
            onChange={(e) => handleInputChange('basicInfo', 'leadType', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Lead Source:</label>
          <input
            type="text"
            value={formData.basicInfo.leadSource}
            onChange={(e) => handleInputChange('basicInfo', 'leadSource', e.target.value)}
          />
        </div>
      </div>

      <div className="section">
        <h2>Essential Dates</h2>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            value={formData.essentialDates.dob}
            onChange={(e) => handleInputChange('essentialDates', 'dob', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Anniversary Date:</label>
          <input
            type="date"
            value={formData.essentialDates.anniversaryDate}
            onChange={(e) => handleInputChange('essentialDates', 'anniversaryDate', e.target.value)}
          />
        </div>
      </div>

      <div className="section">
        <h2>Contact Information</h2>
        <div className="form-group">
          <label>Office Phone:</label>
          <input
            type="tel"
            value={formData.contactInfo.officePhone}
            onChange={(e) => handleInputChange('contactInfo', 'officePhone', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Primary Email:</label>
          <input
            type="email"
            value={formData.contactInfo.primaryEmail}
            onChange={(e) => handleInputChange('contactInfo', 'primaryEmail', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Home Phone:</label>
          <input
            type="tel"
            value={formData.contactInfo.homePhone}
            onChange={(e) => handleInputChange('contactInfo', 'homePhone', e.target.value)}
          />
        </div>
      </div>

      <div className="section">
        <h2>Address Information</h2>
        <div className="form-group">
          <label>Address Line 1:</label>
          <input
            type="text"
            value={formData.addressInfo.addressLine1}
            onChange={(e) => handleInputChange('addressInfo', 'addressLine1', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            value={formData.addressInfo.city}
            onChange={(e) => handleInputChange('addressInfo', 'city', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>ZIP:</label>
          <input
            type="text"
            value={formData.addressInfo.zip}
            onChange={(e) => handleInputChange('addressInfo', 'zip', e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="submit-button">Submit</button>

      <h3>Saved Forms</h3>
      <ul>
        {savedForms.map((form) => (
          <li key={form.id}>
            <strong>{form.form_name}</strong>: {JSON.stringify(JSON.parse(form.form_data))}
          </li>
        ))}
      </ul>
    </form>
  );
};

export default FormLayout;
