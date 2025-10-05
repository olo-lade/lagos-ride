
import React, { useState } from 'react';
import { registerDriver } from '../../services/mockApi';
import { SteeringWheelIcon } from '../icons';

interface DriverRegistrationScreenProps {
    onComplete: () => void;
}

const DriverRegistrationScreen: React.FC<DriverRegistrationScreenProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    color: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ message: string, success: boolean } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);
    const result = await registerDriver(formData);
    setSubmissionStatus(result);
    setIsSubmitting(false);
    if(result.success) {
        setTimeout(onComplete, 3000);
    }
  };

  if (submissionStatus?.success) {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-2xl font-bold mt-4">Registration Submitted!</h2>
                <p className="text-gray-600 mt-2">{submissionStatus.message}</p>
                <p className="text-gray-500 mt-4 text-sm">Redirecting you shortly...</p>
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-3 mb-6">
            <SteeringWheelIcon className="h-8 w-8 text-brand-primary"/>
            <h1 className="text-3xl font-bold text-gray-800">Become a Lagos Ride Driver</h1>
        </div>
        <p className="text-gray-600 mb-8">Join our platform and start earning. Fill out the form below to get started.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold border-b pb-2 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required className="p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"/>
                    <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className="p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"/>
                    <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required className="p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary sm:col-span-2"/>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold border-b pb-2 mb-4">Vehicle Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" name="make" placeholder="Vehicle Make (e.g., Toyota)" onChange={handleChange} required className="p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"/>
                    <input type="text" name="model" placeholder="Vehicle Model (e.g., Camry)" onChange={handleChange} required className="p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"/>
                    <input type="number" name="year" placeholder="Year" onChange={handleChange} required className="p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"/>
                    <input type="text" name="color" placeholder="Color" onChange={handleChange} required className="p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"/>
                    <input type="text" name="licensePlate" placeholder="License Plate" onChange={handleChange} required className="p-3 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary sm:col-span-2"/>
                </div>
            </div>

             <div>
                <h2 className="text-xl font-semibold border-b pb-2 mb-4">Document Upload</h2>
                 <div className="space-y-3 text-sm">
                    <p className="text-gray-600">Please upload clear copies of the following documents.</p>
                    <div className="p-3 border border-gray-300 rounded-md bg-gray-50">Driver's License: <input type="file" className="text-gray-600"/></div>
                    <div className="p-3 border border-gray-300 rounded-md bg-gray-50">Vehicle Registration: <input type="file" className="text-gray-600"/></div>
                 </div>
            </div>

            {submissionStatus && !submissionStatus.success && <p className="text-red-500">{submissionStatus.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 bg-brand-secondary text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-amber-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-300 flex justify-center items-center"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Submit Registration'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default DriverRegistrationScreen;
