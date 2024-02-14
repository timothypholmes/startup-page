import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import Cookies from 'js-cookie';
import settings from '../config/settings.json';
import { HiOutlineCog } from "react-icons/hi";

function SettingsButton() {
  const [open, setOpen] = useState(false);
  const [settingsState, setSettingsState] = useState(() => {
    const savedSettings = Cookies.get('settings');
    return savedSettings ? JSON.parse(savedSettings) : settings;
  });

  const handleSave = () => {
    Cookies.set('settings', JSON.stringify(settingsState));
    setOpen(false);
    window.location.reload();
  };

  const handleReset = () => {
    Cookies.remove('settings');
    setSettingsState(settings);
  };

  const handleTopLevelChange = (event, key) => {
    const newValue = event.target.value;
    setSettingsState(prevSettings => ({
      ...prevSettings,
      [key]: newValue
    }));
  };

  const handleTitleChange = (event, key, index) => {
    const newSettingsState = { ...settingsState };
    newSettingsState[key][index].title = event.target.value;
    setSettingsState(newSettingsState);
  };

  const handleContentChange = (event, key, index, subIndex, subKey) => {
    const newKeyArray = [...settingsState[key]];
    newKeyArray[index].content[subIndex][subKey] = event.target.value;
    setSettingsState({ ...settingsState, [key]: newKeyArray });
  };

  const handleNestedObjectChange = (event, subKey, subValue) => {
    setSettingsState(prevSettings => {
      const updatedSubSettings = { ...prevSettings[subKey] };
      updatedSubSettings[subValue] = event.target.value;
      return {
        ...prevSettings,
        [subKey]: updatedSubSettings
      };
    });
  };
  
  const handleAdd = (key, index) => {
    const newSettingsState = { ...settingsState };
    newSettingsState[key][index].content.push({ name: '', url: '' });
    setSettingsState(newSettingsState);
  };

  const handleRemove = (key, index) => {
    const newSettingsState = { ...settingsState };
    const contentArray = newSettingsState[key][index].content;
    if (contentArray.length > 0) {
      contentArray.pop();
    }
    setSettingsState(newSettingsState);
  };

  const renderInput = (key, value, handleChange) => (
    <div key={key} className="space-y-1">
      <label className="block text-sm font-medium text-black dark:text-white">{key}</label>
      <input
        name={key}
        value={value}
        onChange={handleChange}
        className="py-2 px-5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm m-auto"
        placeholder={`Enter ${key}`}
      />
    </div>
  );
  
  const renderSection = (key, value) => {
    if (!value) {
      const newSettingsState = { ...settingsState };
      newSettingsState[key] = "";
    }

    if (value === undefined || value === null){
      value="";
    }
  
    if (Array.isArray(value)) {
      if (typeof value[0] === 'string') { // Check for array of strings
        return renderInput(key, value.join(', '), (event) => handleTopLevelChange(event, key));
      } else {
        return value.map((item, i) => (
          <div key={i} className="space-y-1">
            {renderInput('title', item.title, (event) => handleTitleChange(event, key, i))}
            {item.content && Array.isArray(item.content) ? item.content.map((content, j) => (
              <div key={j} className="space-x-4 flex justify-center">
                {Object.keys(content).map((subKey) => renderInput(subKey, content[subKey], (event) => handleContentChange(event, key, i, j, subKey)))}
              </div>
            )) : console.warn(`Content is undefined for item: ${JSON.stringify(item)}`)}
            <button
              className="mt-4 mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md dark:white-text"
              onClick={() => handleAdd(key, i)}
            >
              + Add
            </button>
            <button
              className="mt-4 ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md dark:white-text"
              onClick={() => handleRemove(key, i)}
            >
              - Remove
            </button>
          </div>
        ));
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return (
        <div key={key} className="space-y-1">
          {Object.keys(value).map((subKey) => (
            <div key={subKey}>
              {renderInput(subKey, value[subKey], (event) => handleNestedObjectChange(event, key, subKey))}
            </div>
          ))}
        </div>
      );
      } else {
      return renderInput(key, value, (event) => handleTopLevelChange(event, key));
    }
  };
  
  return (
    <>
      <button
        className="text-off-white2 text-5xl cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <HiOutlineCog />
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} className="items-center justify-center z-10">
        <Dialog.Overlay className="" />
        <div className="items-center justify-center bg-off-white1 dark:bg-blue5 dark:text-white w-full h-full p-4 md:p-6 space-y-6 text-center overflow-auto max-h-96">
          <Dialog.Title className="text-lg font-medium leading-6 dark:text-white">Settings</Dialog.Title>
          {Object.keys(settingsState).map((key) => renderSection(key, settingsState[key]))}
          <button
            className="mt-4 mr-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md dark:text-white"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="mt-4 ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md dark:text-white"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </Dialog>
    </>
  );
}

export default SettingsButton;
