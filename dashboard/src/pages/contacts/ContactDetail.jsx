import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contactService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [contact, setContact] = useState(null);

  // Fetch contact data
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
        
        // Mark as read if it's unread
        if (!response.data.read) {
          markAsRead(contactId);
        }
      } else {
        toast.error('Failed to fetch contact details');
        navigate('/contacts');
      }
    } catch (error) {
      console.error('Error fetching contact:', error);
      toast.error('An error occurred while fetching contact details');
      navigate('/contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (contactId) => {
    try {
      await contactService.updateContact(contactId, { read: true });
    } catch (error) {
      console.error('Error marking contact as read:', error);
    }
  };

  const handleBack = () => {
    navigate('/contacts');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center text-gray-500">Contact not found</div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200"
          >
            Back to Contacts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Contact Details</h2>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200"
        >
          Back to Contacts
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="text-base font-medium text-gray-900">{contact.name}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="text-base font-medium text-gray-900">{contact.email}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
            <p className="text-base font-medium text-gray-900">{contact.phone || 'N/A'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date</h3>
            <p className="text-base font-medium text-gray-900">{formatDate(contact.createdAt)}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Subject</h3>
          <p className="text-base font-medium text-gray-900">{contact.subject}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Message</h3>
          <div className="mt-2 p-4 bg-gray-50 rounded-md">
            <p className="text-gray-800 whitespace-pre-wrap">{contact.message}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${contact.read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {contact.read ? 'Read' : 'Unread'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;