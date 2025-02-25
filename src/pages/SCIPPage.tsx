import React from 'react';

const SCIPPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-indigo-900 dark:text-indigo-300 text-center">
          SCIP Interface
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
            This is the SCIP interface page. Content for the SCIP functionality will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SCIPPage;