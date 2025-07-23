import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { faqService } from '../../services/api';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { slugify } from '../../utils/helpers';

const FaqForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      question: '',
      answer: '',
      category: '',
      order: 0,
      status: 'active'
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState('');
  const [bulkJson, setBulkJson] = useState('');
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const bulkInputRef = useRef();

  useEffect(() => {
    if (isEditMode) {
      fetchFaq();
    }
  }, [id]);

  const fetchFaq = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await faqService.getFaqById(id);
      
      if (response.success) {
        const faq = response.data;
        reset({
          question: faq.question,
          category: faq.category || '',
          order: faq.order,
          status: faq.status
        });
        setAnswer(faq.answer || '');
      } else {
        setError('Failed to fetch FAQ details');
        toast.error('Failed to fetch FAQ details');
      }
    } catch (err) {
      console.error('FAQ fetch error:', err);
      setError('An error occurred while fetching FAQ details');
      toast.error('An error occurred while fetching FAQ details');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const faqData = {
        ...data,
        answer,
        isActive: data.status === 'active', // Map status to isActive
      };
      
      let response;
      
      if (isEditMode) {
        response = await faqService.updateFaq(id, faqData);
      } else {
        response = await faqService.createFaq(faqData);
      }
      
      if (response.success) {
        toast.success(isEditMode ? 'FAQ updated successfully' : 'FAQ created successfully');
        navigate('/faqs');
      } else {
        setError(response.message || (isEditMode ? 'Failed to update FAQ' : 'Failed to create FAQ'));
        toast.error(response.message || (isEditMode ? 'Failed to update FAQ' : 'Failed to create FAQ'));
      }
    } catch (err) {
      console.error('FAQ save error:', err);
      setError('An error occurred while saving the FAQ');
      toast.error('An error occurred while saving the FAQ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/faqs');
  };

  const handleBulkUpload = async () => {
    setIsBulkLoading(true);
    setError(null);
    try {
      let faqs;
      try {
        faqs = JSON.parse(bulkJson);
        if (!Array.isArray(faqs)) throw new Error('JSON must be an array of FAQ objects');
      } catch (e) {
        setError('Invalid JSON: ' + e.message);
        setIsBulkLoading(false);
        return;
      }
      const response = await faqService.bulkCreateFaqs({ faqs });
      if (response.success) {
        toast.success(`Bulk upload successful: ${response.inserted || 0} inserted, ${response.skipped || 0} skipped.`);
        setBulkJson('');
        if (bulkInputRef.current) bulkInputRef.current.value = '';
        navigate('/faqs');
      } else {
        setError(response.message || 'Bulk upload failed');
        toast.error(response.message || 'Bulk upload failed');
      }
    } catch (err) {
      setError(err.message || 'Bulk upload failed');
      toast.error(err.message || 'Bulk upload failed');
    } finally {
      setIsBulkLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? 'Edit FAQ' : 'Create New FAQ'}
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Bulk FAQ Upload Section */}
          <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bulk Add FAQs (JSON)</h3>
            <p className="text-sm text-gray-600 mb-2">Paste an array of FAQ objects in JSON format below and click <b>Bulk Upload</b>. Example:<br/>
              <code>[{'{'}"question": "Q1", "answer": "A1", "category": "cat", "order": 1, "isActive": true{'}'}]</code>
            </p>
            <textarea
              ref={bulkInputRef}
              rows={6}
              className="w-full border border-gray-300 rounded-md p-2 mb-2 font-mono text-xs"
              placeholder='[
  {"question": "What is solar?", "answer": "<p>Solar is ...</p>", "category": "general", "order": 1, "isActive": true}
]'
              onChange={e => setBulkJson(e.target.value)}
              disabled={isBulkLoading}
            />
            <button
              type="button"
              onClick={handleBulkUpload}
              disabled={isBulkLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBulkLoading ? 'Uploading...' : 'Bulk Upload'}
            </button>
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 divide-y divide-gray-200">
            <div className="space-y-8 divide-y divide-gray-200">
              <div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">FAQ Information</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Provide the question and answer for this FAQ.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                      Question *
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="question"
                        {...register('question', { required: 'Question is required' })}
                        className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.question ? 'border-red-300' : ''}`}
                      />
                    </div>
                    {errors.question && (
                      <p className="mt-2 text-sm text-red-600">{errors.question.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                      Answer *
                    </label>
                    <div className="mt-1">
                      <ReactQuill
                        theme="snow"
                        value={answer}
                        onChange={setAnswer}
                        className={`block w-full border-gray-300 rounded-md shadow-sm ${!answer ? 'quill-error' : ''}`}
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'indent': '-1'}, { 'indent': '+1' }],
                            ['link'],
                            ['clean']
                          ],
                        }}
                      />
                    </div>
                    {!answer && (
                      <p className="mt-2 text-sm text-red-600">Answer is required</p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="category"
                        {...register('category')}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                      Order
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="order"
                        {...register('order', { 
                          valueAsNumber: true,
                          validate: value => !isNaN(value) || 'Order must be a number'
                        })}
                        className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.order ? 'border-red-300' : ''}`}
                      />
                    </div>
                    {errors.order && (
                      <p className="mt-2 text-sm text-red-600">{errors.order.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="mt-1">
                      <select
                        id="status"
                        {...register('status')}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>{isEditMode ? 'Update FAQ' : 'Create FAQ'}</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FaqForm;