import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';

const EmptyState = ({
  title = 'No items found',
  description = 'Get started by creating a new item.',
  icon: Icon,
  buttonText = 'Add New',
  buttonLink = '#',
  onButtonClick,
}) => {
  const DefaultIcon = PlusIcon;
  const IconComponent = Icon || DefaultIcon;

  return (
    <div className="text-center py-12 px-4 bg-white rounded-lg shadow">
      <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
        <IconComponent className="h-6 w-6 text-primary-600" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      <div className="mt-6">
        {onButtonClick ? (
          <button
            type="button"
            onClick={onButtonClick}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {buttonText}
          </button>
        ) : (
          <Link
            to={buttonLink}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;