import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { contactService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

const ContactForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [contact, setContact] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm();

  // Fetch contact data if in edit mode
  useEffect(() => {
    if (id) {
      fetchContact(id);
    }
  }, [id]);

  const fetchContact = async (contactId) => {
    try {
      setIsLoading(true);
      const response = await contactService.getContactById(contactId);
      
      if (response.success) {
        setContact(response.data);
        
        // Populate form fields
        const fields = ['name', 'email', 'phone', 'subject', 'message'];
        fields.forEach(field => {
          if (response.data[field]) {
            setValue(field, response.data[field]);
          }
        });
        
        // Mark as read if it's unread
        if (!response.data.read) {
          markAsRead(contactId);
        }
      } else {
        toast.error('Failed to fetch contact details');
        navigate('/contacts');
      }
    } catch (err) {
      console.error('Contact fetch error:', err);
      toast.error('An error occurred while fetching contact details');
      navigate('/contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (contactId) => {
    try {
      await contactService.markContactAsRead(contactId);
      // Update the local contact state to reflect the read status
      setContact(prev => prev ? { ...prev, read: true } : prev);
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // In this component, we're only viewing/updating notes, not creating new contacts
      if (id) {
        const response = await contactService.updateContact(id, {
          adminNotes: data.adminNotes
        });
        
        if (response.success) {
          toast.success('Contact notes updated successfully');
          navigate('/contacts');
        } else {
          toast.error(response.message || 'Failed to update contact notes');
        }
      }
    } catch (err) {
      console.error('Contact update error:', err);
      toast.error('An error occurred while updating contact notes');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Contact Details</h1>
          <button
            type="button"
            onClick={() => navigate('/contacts')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to List
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : contact ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Contact Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Details and message from the contact.
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{contact.name}</dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <a href={`mailto:${contact.email}`} className="text-primary-600 hover:text-primary-900">
                        {contact.email}
                      </a>
                    </dd>
                  </div>
                  {contact.phone && (
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{contact.phone}</dd>
                    </div>
                  )}
                  {contact.subject && (
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Subject</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{contact.subject}</dd>
                    </div>
                  )}
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Date received</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(contact.createdAt)}</dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${contact.read ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {contact.read ? 'Read' : 'Unread'}
                      </span>
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Message</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                      {contact.message}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Admin Notes Form */}
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Admin Notes
                </h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (only visible to administrators)
                    </label>
                    <textarea
                      id="adminNotes"
                      rows={4}
                      className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.adminNotes ? 'border-red-300' : ''}`}
                      placeholder="Add private notes about this contact..."
                      {...register('adminNotes')}
                      defaultValue={contact.adminNotes || ''}
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate('/contacts')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : 'Save Notes'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="flex space-x-3">
                  <a
                    href={`mailto:${contact.email}?subject=Re: ${contact.subject || 'Your message'}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Reply via Email
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this contact message? This action cannot be undone.')) {
                        contactService.deleteContact(contact._id)
                          .then(response => {
                            if (response.success) {
                              toast.success('Contact deleted successfully');
                              navigate('/contacts');
                            } else {
                              toast.error(response.message || 'Failed to delete contact');
                            }
                          })
                          .catch(err => {
                            console.error('Contact delete error:', err);
                            toast.error('An error occurred while deleting the contact');
                          });
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Contact not found</h3>
              <p className="mt-1 text-sm text-gray-500">
                The contact you are looking for does not exist or has been deleted.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/contacts')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Go back to contacts
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;