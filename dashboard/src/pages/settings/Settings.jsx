import React, { useState } from 'react';
import GeneralSettings from './GeneralSettings';
import AdvancedSettings from './AdvancedSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General Settings' },
    { id: 'advanced', label: 'Advanced Settings' },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Site Settings</h1>
        <p className="text-gray-500 mt-1">Manage your website configuration</p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'advanced' && <AdvancedSettings />}
        </div>
      </div>
    </div>
  );
};

export default Settings;