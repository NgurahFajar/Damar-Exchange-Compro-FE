// components/EmailTemplate.jsx
import React from 'react';

const EmailTemplate = ({ data }) => (
    <div className="font-sans text-gray-800 leading-relaxed">
        <div className="max-w-[600px] mx-auto my-5 p-5">
            <div className="bg-gray-50 p-5 rounded-lg shadow-md">
                <div className="mb-4">
                    <p className="font-bold text-gray-600 mb-1">Name:</p>
                    <p className="bg-white p-2 rounded">{data.name}</p>
                </div>
                <div className="mb-4">
                    <p className="font-bold text-gray-600 mb-1">Subject:</p>
                    <p className="bg-white p-2 rounded">{data.subject}</p>
                </div>
                <div className="mb-4">
                    <p className="font-bold text-gray-600 mb-1">Email:</p>
                    <p className="bg-white p-2 rounded">{data.email}</p>
                </div>
                <div className="mb-4">
                    <p className="font-bold text-gray-600 mb-1">Message:</p>
                    <p className="bg-white p-2 rounded whitespace-pre-wrap">{data.message}</p>
                </div>
            </div>
        </div>
    </div>
);

export default EmailTemplate;