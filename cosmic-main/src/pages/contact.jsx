import React, { useState } from "react";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Contact = () => {
  const [selectedType, setSelectedType] = useState("residential");
  const [formData, setFormData] = useState({
    fullName: "",
    city: "",
    pincode: "",
    whatsapp: "",
    email: "",
    message: "",
    systemType: "residential",
    flats: "",
    contactPerson: "",
    businessType: "",
    termsAccepted: false
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const { fetchContactMessages, submitContactForm } = useAppContext();
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);
    
    try {
      // Update system type from selected radio
      const dataToSubmit = {
        ...formData,
        systemType: selectedType
      };
      
      // Send to backend using context function
      const result = await submitContactForm(dataToSubmit);
      
      if (result.success) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          fullName: "",
          city: "",
          pincode: "",
          whatsapp: "",
          email: "",
          message: "",
          systemType: selectedType,
          flats: "",
          contactPerson: "",
          businessType: "",
          termsAccepted: false
        });
        // Refresh contact messages in context
        fetchContactMessages();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div 
        className="relative bg-cover bg-center h-[300px] flex items-center justify-center"
        style={{
          backgroundImage: `url('https://zolar.wpengine.com/wp-content/uploads/2025/01/zolar-breadcrumb-bg.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Link to="/" className="hover:text-accent-500 transition-colors">Home</Link>
            <span>—</span>
            <span className="text-accent-500">Contact</span>
          </div>
        </div>
      </div>
      
      {/* Contact Section */}
      <section className="w-full bg-accent-50 py-16 flex justify-center">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8 justify-center">
          
          {/* --------- MAP ---------- */}
          <div className="w-full lg:w-5/12 mb-8 lg:mb-0 order-last lg:order-first">
            <div className="h-full rounded-lg overflow-hidden shadow-lg">
              <iframe
                title="Company Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.422565099936!2d72.77443167502427!3d21.215085780481296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04d5afda3a0e1%3A0x632ce1cca595b896!2sCosmic%20Powertech%20Solution!5e0!3m2!1sen!2sin!4v1750488844475!5m2!1sen!2sin"
                width="100%"
                height="100%"
                className="rounded-lg grayscale-[25%] contrast-125 h-[600px] lg:h-full"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* --------- FORM CARD ---------- */}
          <div className="w-full lg:w-5/12 order-first lg:order-last">
            <div
                className="rounded-lg p-6 md:p-10 shadow-lg relative overflow-hidden bg-gradient-to-b from-accent-200 to-accent-500"
              >
              {/* Background Image */}
              <div 
                className="absolute inset-0 z-0 opacity-10"
                style={{
                  backgroundImage: "url('/contact-from-bg.jpeg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              ></div>
              
              <div className="relative z-10">
                <p className="text-center text-xs tracking-widest mb-2 text-accent-600">
                  —☘ ASK US ☘—
                </p>

                <h2 className="font-extrabold text-3xl md:text-4xl mb-6 md:mb-8 leading-tight text-center text-accent-800">
                  Contact Us For Any <br className="hidden lg:block" /> Queries?
                </h2>

                {submitStatus === 'success' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start gap-4">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-green-800 text-lg">Message Sent Successfully!</h3>
                      <p className="text-green-700 mt-1">Thank you for contacting us. We'll get back to you shortly.</p>
                      <button 
                        onClick={() => setSubmitStatus(null)} 
                        className="mt-4 text-sm font-medium text-green-700 hover:text-green-900"
                      >
                        Send another message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                  >
                  {/* System Type Selection */}
                  <div className="flex flex-wrap gap-3 justify-center mb-2">
                    {["residential","housing_society","commercial"].map((type) => (
                      <label key={type} className="relative cursor-pointer">
                        <input 
                          type="radio" 
                          name="systemType" 
                          value={type}
                          className="peer sr-only"
                          checked={selectedType===type}
                          onChange={() => setSelectedType(type)}
                        />
                        <div className="px-6 py-2 rounded-full bg-white/50 text-accent-800 peer-checked:bg-accent-800 peer-checked:text-white transition-all hover:bg-white/70">
                          {type.replace("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Dynamic Fields */}
                  {selectedType === "residential" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">Full Name <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required 
                            className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                          />
                      </div>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-medium text-accent-800">City <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required 
                            className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-medium text-accent-800">Pin code</label>
                          <input 
                            type="text" 
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">WhatsApp number <span className="text-red-500">*</span></label>
                        <input 
                          type="tel" 
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          required 
                          className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">Message</label>
                        <textarea 
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows="3" 
                          className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                        ></textarea>
                      </div>
                    </>
                  )}

                  {selectedType === "housing_society" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">Society Name <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required 
                            className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                          />
                      </div>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-medium text-accent-800">City <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required 
                            className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-medium text-accent-800">Pin code</label>
                          <input 
                            type="text" 
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">Number of Flats</label>
                        <input 
                          type="number" 
                          name="flats"
                          value={formData.flats || ""}
                          onChange={handleInputChange}
                          className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">Contact Person <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          name="contactPerson"
                          value={formData.contactPerson || ""}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">WhatsApp number <span className="text-red-500">*</span></label>
                        <input 
                          type="tel" 
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          required 
                          className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">Message</label>
                        <textarea 
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows="3" 
                          className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                        ></textarea>
                      </div>
                    </>
                  )}

                  {selectedType === "commercial" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">Company Name <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required 
                            className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                          />
                      </div>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-medium text-accent-800">City <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required 
                            className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-xs font-medium text-accent-800">Pin code</label>
                          <input 
                            type="text" 
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">Business Type</label>
                        <input 
                          type="text" 
                          name="businessType"
                          value={formData.businessType || ""}
                          onChange={handleInputChange}
                          className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">Contact Person <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          name="contactPerson"
                          value={formData.contactPerson || ""}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">WhatsApp number <span className="text-red-500">*</span></label>
                        <input 
                          type="tel" 
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          required 
                          className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-accent-800">Message</label>
                        <textarea 
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows="3" 
                          className="w-full rounded-lg px-5 py-3 bg-white/70 text-accent-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-800 border border-white/30"
                        ></textarea>
                      </div>
                    </>
                  )}

                  {/* Terms & button */}
                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      id="terms" 
                      name="termsAccepted"
                      type="checkbox" 
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="w-4 h-4 accent-accent-800" 
                      required 
                    />
                    <label htmlFor="terms" className="text-xs text-accent-800">
                      I agree to Cosmic Powertech's <a href="#" className="text-accent-600 hover:underline">terms</a> & <a href="#" className="text-accent-600 hover:underline">privacy</a>
                    </label>
                  </div>
                  
                  {submitStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-500" />
                      <p className="text-xs text-red-700">There was an error submitting your message. Please try again.</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`mt-2 inline-flex items-center gap-2 self-start rounded-full bg-accent-800 text-white px-6 py-3 font-semibold hover:bg-accent-600 transition-all shadow-md hover:shadow-accent-800/20 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Submitting...' : 'Submit Details'}
                    {!loading && <ArrowRight size={18} strokeWidth={2} />}
                  </button>
                </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;
