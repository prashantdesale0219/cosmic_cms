import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaLinkedinIn, FaChevronDown, FaChevronUp, FaTwitter, FaFacebookF, FaInstagram, FaGithub, FaYoutube, FaGlobe } from "react-icons/fa6";
import api from '../services/api';



const TeamSection = () => {
  const [expandedMember, setExpandedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchTeamMembers();
  }, []);
  
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      
      // First try to get featured team members
      let response = await api.get('/team/featured');
      let teamData = response.data.data || [];
      
      // If no featured members found, get all active members
      if (teamData.length === 0) {
        response = await api.get('/team/active');
        teamData = response.data.data || [];
      }
      
      setMembers(teamData);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleBio = (name) => {
    if (expandedMember === name) {
      setExpandedMember(null);
    } else {
      setExpandedMember(name);
    }
  };
  
  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return FaLinkedinIn;
      case 'twitter': return FaTwitter;
      case 'facebook': return FaFacebookF;
      case 'instagram': return FaInstagram;
      case 'github': return FaGithub;
      case 'youtube': return FaYoutube;
      case 'website': return FaGlobe;
      default: return FaGlobe;
    }
  };
  
  if (loading) {
    return (
      <section className="relative bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    );
  }
  
  if (error || members.length === 0) {
    return null; // Don't render if no team members or error
  }
  
  return (
    <>
  <section className="relative bg-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* heading */}
      <header className="mb-12">
        <div className="border-l-4 border-primary-600 pl-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Team Cosmic</h2>
        </div>
        <p className="text-gray-600 max-w-3xl mt-6">
          The management team of Cosmic incorporates innovators and problem-solvers with a passion for making the world a better place. They bring out the best in our employees and believe in 'growing together'.
        </p>
      </header>

      <div className="mt-10">
        <p className="text-sm font-medium text-primary-600 uppercase mb-6 flex items-center">
          <span className="inline-block w-6 h-0.5 bg-primary-600 mr-2"></span>
          OUR PEOPLE
        </p>
        
        {/* cards */}
        <div className="grid gap-12 sm:gap-10 md:gap-12 sm:grid-cols-2 lg:grid-cols-3 justify-items-center mx-auto">
          {members.map((member) => {
            const isExpanded = expandedMember === member.name;
            // Handle different social media structures
            let primarySocialLink = null;
            if (member.socialMedia) {
              if (Array.isArray(member.socialMedia)) {
                primarySocialLink = member.socialMedia.find(link => link.platform === 'linkedin') || member.socialMedia[0];
              } else if (typeof member.socialMedia === 'object') {
                // Handle object structure like { linkedin: 'url', twitter: 'url' }
                const socialKeys = Object.keys(member.socialMedia).filter(key => member.socialMedia[key]);
                if (socialKeys.length > 0) {
                  const platform = socialKeys.includes('linkedin') ? 'linkedin' : socialKeys[0];
                  primarySocialLink = {
                    platform: platform,
                    url: member.socialMedia[platform]
                  };
                }
              }
            }
            const SocialIcon = primarySocialLink ? getSocialIcon(primarySocialLink.platform) : FaLinkedinIn;
            
            return (
              <div key={member._id} className="flex flex-col group border border-gray-200 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100 transition-all duration-300 overflow-hidden w-full max-w-sm mx-auto">
                <div className="relative overflow-hidden">
                  {/* Expandable Bio Section - Positioned over image */}
                  {isExpanded && (
                    <div className="absolute inset-0 bg-primary-900 bg-opacity-90 z-10 p-4 flex flex-col transition-all duration-300 ease-in-out">
                      <div className="flex items-start mb-3">
                        <h4 className="text-md font-bold text-white">{member.position}</h4>
                        {primarySocialLink && (
                          <a 
                            href={primarySocialLink.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                          >
                            <SocialIcon size={14} />
                          </a>
                        )}
                      </div>
                      <div 
                        className="text-white text-sm leading-relaxed flex-grow overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: member.bio || 'No bio available.' }}
                      />
                      <div className="h-1 w-12 bg-accent-500 mt-3"></div>
                    </div>
                  )}
                  <div className="w-full h-80 relative">
                    <img
                      src={member.image || member.photo || '/placeholder-team.jpg'}
                      alt={member.name}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-accent-600 text-sm font-medium mb-3">{member.position}</p>
                  <button 
                    onClick={() => toggleBio(member.name)}
                    className="flex items-center text-sm text-primary-600 hover:text-primary-800 font-medium bg-transparent border-none cursor-pointer p-0"
                  >
                    {isExpanded ? (
                      <>
                        HIDE BIO <FaChevronUp className="ml-1" />
                      </>
                    ) : (
                      <>
                        SHOW BIO <FaChevronDown className="ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
  

  </>
  );
};

export default TeamSection;
