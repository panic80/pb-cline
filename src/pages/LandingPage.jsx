import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  WindowIcon,
  BuildingLibraryIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';
import '../styles/sticky-footer.css'; // Import the sticky footer CSS

export default function LandingPage() {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('elite-chat-theme');
    if (storedTheme) return storedTheme;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('elite-chat-theme', newTheme);
      return newTheme;
    });
  };

  // Update document when theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    
    // Force a repaint to ensure theme changes are applied immediately
    document.documentElement.style.display = 'none';
    document.documentElement.offsetHeight; // Trigger reflow
    document.documentElement.style.display = '';
  }, [theme]);

  useEffect(() => {
    // Preload the chat route for faster navigation
    const preloadChat = () => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/chat';
      document.head.appendChild(link);
    };
    preloadChat();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showSOPSubmodal, setShowSOPSubmodal] = useState(false);
  const [showOnboardingSubmodal, setShowOnboardingSubmodal] = useState(false);
  
  // Refs for submodals to detect clicks outside
  const sopSubmodalRef = useRef(null);
  const onboardingSubmodalRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle clicks outside submodals
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if SOP submodal is open and click is outside
      if (showSOPSubmodal &&
          sopSubmodalRef.current &&
          !sopSubmodalRef.current.contains(event.target) &&
          !event.target.closest('[data-sop-trigger="true"]')) {
        setShowSOPSubmodal(false);
      }
      
      // Check if Onboarding submodal is open and click is outside
      if (showOnboardingSubmodal &&
          onboardingSubmodalRef.current &&
          !onboardingSubmodalRef.current.contains(event.target) &&
          !event.target.closest('[data-onboarding-trigger="true"]')) {
        setShowOnboardingSubmodal(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSOPSubmodal, showOnboardingSubmodal]);

  const handleAboutClick = (e) => {
    e.preventDefault();
    setShowAboutModal(true);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <div className="bg-[var(--background)] text-[var(--text)] pt-12">
            {/* Theme Toggle - Positioned more prominently */}
            <div className="fixed top-4 right-4 z-50">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center p-3 bg-[var(--card)] text-[var(--text)] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[var(--primary)] hover:bg-[var(--background-secondary)] hover:scale-110"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  // Moon icon for light mode
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 14.12A7.78 7.78 0 019.88 4a7.78 7.78 0 002.9 15.1 7.78 7.78 0 007.22-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  // Sun icon for dark mode
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 2v2m0 16v2M2 12h2m16 0h2m-3-7l-1.5 1.5M4.93 4.93l1.5 1.5m11.14 11.14l1.5 1.5M4.93 19.07l1.5-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Hero Section */}
            <main className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
              <div className="w-full max-w-4xl mx-auto text-center">
                <div className="mb-10 flex justify-center">
                  <BuildingLibraryIcon className="w-24 h-24 text-[var(--primary)]" aria-hidden="true" />
                </div>
                <h1 className="text-4xl md:text-6xl font-semibold mb-4 animate-fade-in" role="heading" aria-level="1">
                  32 CBG G8 Administration Hub
                  <span className="block text-xl md:text-2xl mt-4 text-[var(--text-secondary)] font-normal">Streamlined Military Administration Portal</span>
                </h1>
                <p className="text-xl text-center max-w-2xl mx-auto mt-6 mb-8 text-[var(--text)] opacity-80">
                  Your comprehensive digital gateway to administrative resources, claims processing, and policy information. Designed to simplify and expedite your administrative tasks.
                </p>
              </div>
            </main>

            {/* Features Section */}
            <section className="pt-2 pb-16 md:pt-4 md:pb-24 px-4 sm:px-6 lg:px-8 bg-[var(--background-secondary)]" aria-label="Features">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <Link
                  to="/chat"
                  className="p-4 rounded-lg bg-[var(--card)] transform transition-all duration-300 hover:scale-115 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] hover:border-4 hover:border-blue-500 cursor-pointer"
                  aria-label="Access Policy Chat Beta"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3">
                      <QuestionMarkCircleIcon className="w-12 h-12 text-[var(--primary)]" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-medium mb-3 text-[var(--text)]">
                      Policy Assistant
                    </h3>
                    <p className="text-[var(--text)] opacity-80">
                      Interactive AI-powered guide for policy inquiries and administrative procedures. <span className="text-amber-500">(Beta)</span>
                    </p>
                  </div>
                </Link>
                <a
                  href="https://apps.powerapps.com/play/e/default-325b4494-1587-40d5-bb31-8b660b7f1038/a/75e3789b-9c1d-4feb-9515-20665ab7d6e8?tenantId=325b4494-1587-40d5-bb31-8b660b7f1038&amp;hint=c63b9850-8dc3-44f2-a186-f215cf7de716&amp;sourcetime=1738854913080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg bg-[var(--card)] transform transition-all duration-300 hover:scale-115 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] hover:border-4 hover:border-blue-500 cursor-pointer"
                  aria-label="Access SCIP Platform"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3">
                      <DocumentTextIcon className="w-12 h-12 text-[var(--primary)]" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-medium mb-3 text-[var(--text)]">
                      SCIP Portal
                    </h3>
                    <p className="text-[var(--text)] opacity-80">
                      Streamlined Claims Interface Platform for efficient digital submission and processing of administrative claims.
                    </p>
                  </div>
                </a>
                <div
                  onClick={() => setShowModal(true)}
                  className="p-4 rounded-lg bg-[var(--card)] transform transition-all duration-300 hover:scale-115 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] hover:border-4 hover:border-blue-500 cursor-pointer"
                  aria-label="Open Other Tools"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3">
                      <WindowIcon className="w-12 h-12 text-[var(--primary)]" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-medium mb-3 text-[var(--text)]">
                      Administrative Tools
                    </h3>
                    <p className="text-[var(--text)] opacity-80">
                      Essential resources including Kiosk Manager, SOPs, and operational guidelines.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        
        {/* Footer - Now as a standard element at the bottom of the page */}
        <footer className="mt-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]" role="contentinfo">
          <div className="max-w-5xl mx-auto py-6">
            {/* Mobile-optimized footer content */}
            <div className="md:hidden">
              <nav className="flex justify-around my-2" aria-label="Footer Navigation">
                <a
                  href="#"
                  onClick={handleAboutClick}
                  className="inline-flex flex-col items-center text-[var(--text)] opacity-70 hover:opacity-100 hover:text-[var(--primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded px-2 py-1"
                >
                  <InformationCircleIcon className="w-5 h-5" aria-hidden="true" />
                  <span className="text-xs mt-1">About</span>
                </a>
                <a
                  href="mailto:g8@sent.com?subject=Contacting%20from%20G8%20homepage"
                  className="inline-flex flex-col items-center text-[var(--text)] opacity-70 hover:opacity-100 hover:text-[var(--primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded px-2 py-1"
                >
                  <EnvelopeIcon className="w-5 h-5" aria-hidden="true" />
                  <span className="text-xs mt-1">Contact</span>
                </a>
                <div
                  onClick={() => setShowPrivacyModal(true)}
                  className="inline-flex flex-col items-center text-[var(--text)] opacity-70 hover:opacity-100 hover:text-[var(--primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded px-2 py-1 cursor-pointer"
                >
                  <ShieldCheckIcon className="w-5 h-5" aria-hidden="true" />
                  <span className="text-xs mt-1">Privacy</span>
                </div>
              </nav>
              <div className="text-center text-xs text-[var(--text)] opacity-50 mt-1">
                <p>© {new Date().getFullYear()} G8 Administration Hub</p>
              </div>
            </div>
            
            {/* Desktop footer content */}
            <div className="hidden md:block">
              <nav className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-4" aria-label="Footer Navigation">
                <a
                  href="#"
                  onClick={handleAboutClick}
                  className="inline-flex items-center space-x-2 text-[var(--text)] opacity-70 hover:opacity-100 hover:text-[var(--primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded px-2 py-1"
                >
                  <InformationCircleIcon className="w-5 h-5" aria-hidden="true" />
                  <span>About</span>
                </a>
                <a
                  href="mailto:g8@sent.com?subject=Contacting%20from%20G8%20homepage"
                  className="inline-flex items-center space-x-2 text-[var(--text)] opacity-70 hover:opacity-100 hover:text-[var(--primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded px-2 py-1"
                >
                  <EnvelopeIcon className="w-5 h-5" aria-hidden="true" />
                  <span>Contact</span>
                </a>
                <div
                  onClick={() => setShowPrivacyModal(true)}
                  className="inline-flex items-center space-x-2 text-[var(--text)] opacity-70 hover:opacity-100 hover:text-[var(--primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded px-2 py-1 cursor-pointer"
                >
                  <ShieldCheckIcon className="w-5 h-5" aria-hidden="true" />
                  <span>Privacy Policy</span>
                </div>
              </nav>
              <div className="flex justify-between items-center text-sm text-[var(--text)] opacity-50">
                <p>© {new Date().getFullYear()} G8 Administration Hub. All rights reserved. Not affiliated with DND or CAF.</p>
                <p>Last updated: February 26, 2025</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
      {showModal && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 z-40 animate-fade-in"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal */}
          <div 
            className="fixed z-50 animate-float-up max-w-lg w-[90vw] mx-auto"
            style={{ 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)' 
            }}
          >
            <div className="bg-[var(--card)] text-[var(--text)] rounded-xl border border-[var(--border)] shadow-2xl">
              {/* Header */}
              <div className="p-6 border-b border-[var(--border)]">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Other Tools</h2>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-[var(--background-secondary)] rounded-full transition-colors"
                    aria-label="Close modal"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <ul className="divide-y divide-[var(--border)]">
                  <li className="py-3 first:pt-0">
                    <a 
                      href="https://fss-kiosk.replit.app" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-all duration-200 group"
                    >
                      <div className="p-2 rounded-lg bg-[var(--background-secondary)] group-hover:bg-[var(--primary)] transition-colors">
                        <WindowIcon className="w-6 h-6 text-[var(--primary)] group-hover:text-white" />
                      </div>
                      <div className="ml-4">
                        <span className="block font-medium group-hover:text-[var(--primary)] transition-colors">Kiosk Manager</span>
                        <span className="text-sm text-[var(--text-secondary)]">Manage kiosk settings and content</span>
                      </div>
                      <svg className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </li>
                  <li className="py-3 relative group/item">
                    <div
                      className="flex items-center p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-all duration-200 group cursor-pointer"
                      onClick={() => setShowSOPSubmodal(true)}
                      data-sop-trigger="true"
                    >
                      <div className="p-2 rounded-lg bg-[var(--background-secondary)] group-hover:bg-[var(--primary)] transition-colors">
                        <DocumentTextIcon className="w-6 h-6 text-[var(--primary)] group-hover:text-white" />
                      </div>
                      <div className="ml-4">
                        <span className="block font-medium group-hover:text-[var(--primary)] transition-colors">Standard Operating Procedures</span>
                        <span className="text-sm text-[var(--text-secondary)]">Access SOPs and guidelines</span>
                      </div>
                      <svg className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div
                      ref={sopSubmodalRef}
                      className={`absolute top-0 md:w-72 w-full bg-[var(--card)] text-[var(--text)] rounded-xl border border-[var(--border)] shadow-2xl transition-all duration-300 ${showSOPSubmodal ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'}`}
                      style={{
                        backdropFilter: 'none',
                        WebkitBackdropFilter: 'none',
                        zIndex: 100,
                        left: windowWidth < 768 ? '0' : 'calc(100% - 100px)',
                        maxHeight: windowWidth < 768 ? '60vh' : 'none',
                        overflowY: windowWidth < 768 ? 'auto' : 'visible'
                      }}>
                      <div className="bg-[var(--background-secondary)] rounded-xl" style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}>
                        <div className="p-4 border-b border-[var(--border)]">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Standard Operating Procedures</h3>
                            <button
                              className="p-2 hover:bg-[var(--background)] rounded-full transition-colors"
                              aria-label="Close submenu"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowSOPSubmodal(false);
                              }}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <ul className="divide-y divide-[var(--border)]">
                            <li className="py-2">
                              <a href="https://scribehow.com/embed-preview/Boots_Reimbursement_Submission_in_SCIP__oWwTYHb2QUeKqvtYJ3DMkg?as=video" target="_blank" rel="noopener noreferrer" className="block cursor-pointer hover:bg-[var(--background)] hover:text-[var(--primary)] transition-colors duration-200 rounded px-2">How to Submit Boot Claims</a>
                            </li>
                            <li className="py-2">
                              <a href="https://scribehow.com/embed-preview/Initiating_TD_Claim_in_SCIP__GGXSDQBnSNq6H5GX_cZUuQ?as=video" target="_blank" rel="noopener noreferrer" className="block cursor-pointer hover:bg-[var(--background)] hover:text-[var(--primary)] transition-colors duration-200 rounded px-2">How to Submit TD Claims</a>
                            </li>
                            <li className="py-2">
                              <a href="https://scribehow.com/embed-preview/Finalizing_a_TD_Claim_in_SCIP__w_JFn6AuTA--OpCHeFqYxA?as=video" target="_blank" rel="noopener noreferrer" className="block cursor-pointer hover:bg-[var(--background)] hover:text-[var(--primary)] transition-colors duration-200 rounded px-2">How to Finalize TD Claims</a>
                            </li>
                          </ul>
                        </div>
                        <div className="p-4 border-t border-[var(--border)]">
                          <button
                            onClick={() => setShowSOPSubmodal(false)}
                            className="w-full px-4 py-2 text-center text-[var(--text)] bg-[var(--card)] hover:bg-[var(--primary)] hover:text-white rounded-lg transition-colors duration-200"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="py-3 last:pb-0 relative group/item">
                    <div
                      className="flex items-center p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-all duration-200 group cursor-pointer"
                      onClick={() => setShowOnboardingSubmodal(true)}
                      data-onboarding-trigger="true"
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-[var(--background-secondary)] group-hover:bg-[var(--primary)] transition-colors">
                          <BuildingLibraryIcon className="w-6 h-6 text-[var(--primary)] group-hover:text-white" />
                        </div>
                        <div className="ml-4 text-left">
                          <span className="block font-medium group-hover:text-[var(--primary)] transition-colors">Onboarding Guide</span>
                          <span className="text-sm text-[var(--text-secondary)]">Collection of Onboarding SCIP Guides</span>
                        </div>
                        <svg className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <div
                      ref={onboardingSubmodalRef}
                      className={`absolute top-0 md:w-72 w-full bg-[var(--card)] text-[var(--text)] rounded-xl border border-[var(--border)] shadow-2xl transition-all duration-300 ${showOnboardingSubmodal ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'}`}
                      style={{
                        backdropFilter: 'none',
                        WebkitBackdropFilter: 'none',
                        zIndex: 100,
                        left: windowWidth < 768 ? '0' : 'calc(100% - 100px)',
                        maxHeight: windowWidth < 768 ? '60vh' : 'none',
                        overflowY: windowWidth < 768 ? 'auto' : 'visible'
                      }}>
                      <div className="bg-[var(--background-secondary)] rounded-xl" style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}>
                        <div className="p-4 border-b border-[var(--border)]">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Other Resources</h3>
                            <button
                              className="p-2 hover:bg-[var(--background)] rounded-full transition-colors cursor-pointer"
                              aria-label="Close submenu"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowOnboardingSubmodal(false);
                              }}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <ul className="divide-y divide-[var(--border)]">
                            <li className="py-2">
                              <a href="https://scribehow.com/embed-preview/SCIP_Mobile_Onboarding__qa62L6ezQi2nTzcp3nqq1Q?as=video" className="block cursor-pointer hover:bg-[var(--background)] hover:text-[var(--primary)] transition-colors duration-200 rounded px-2">SCIP Mobile Onboarding Guide</a>
                             </li>
                             <li className="py-2">
                               {/* <a href="/scip-desktop" className="block cursor-pointer hover:bg-[var(--background)] hover:text-[var(--primary)] transition-colors duration-200 rounded px-2">SCIP Desktop Onboarding Guide</a> */}
                             </li>
                           </ul>
                         </div>
                        <div className="p-4 border-t border-[var(--border)]">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowOnboardingSubmodal(false);
                            }}
                            className="w-full px-4 py-2 text-center text-[var(--text)] bg-[var(--card)] hover:bg-[var(--primary)] hover:text-white rounded-lg transition-colors duration-200"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[var(--border)] bg-[var(--background-secondary)] rounded-b-xl">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-2 text-center text-[var(--text)] bg-[var(--card)] hover:bg-[var(--primary)] hover:text-white rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-40 animate-fade-in"
            onClick={() => setShowPrivacyModal(false)}
          />
          
          <div 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-float-up"
          >
            <div 
              className="w-[min(90vw,_32rem)] bg-[var(--card)] text-[var(--text)] rounded-xl border border-[var(--border)] shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-[var(--border)]">
                {/* Header content */}
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Privacy Policy</h2>
                  <button 
                    onClick={() => setShowPrivacyModal(false)}
                    className="p-2 hover:bg-[var(--background-secondary)] rounded-full transition-colors"
                    aria-label="Close privacy modal"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
                <div className="p-4 space-y-4">
                  {/* Content */}
                  <h3 className="text-lg font-semibold">General Privacy Notice</h3>
                  <p className="text-[var(--text)] leading-relaxed">
                    We prioritize the protection of your personal information and are committed to maintaining your trust.
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-6">Data Collection & Usage</h3>
                  <ul className="list-disc pl-5 space-y-2 text-[var(--text)] opacity-80">
                    <li>We collect only essential information needed for the service</li>
                    <li>Your data is encrypted and stored securely</li>
                    <li>We do not sell or share your personal information</li>
                    <li>You have control over your data and can request its deletion</li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-6">AI Processing (Gemini)</h3>
                  <p className="text-[var(--text)] leading-relaxed">
                    This application uses Google's Gemini AI. When you interact with our AI features:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-[var(--text)] opacity-80">
                    <li>Your conversations may be processed to improve responses</li>
                    <li>No personally identifiable information is retained by the AI</li>
                    <li>Conversations are not used to train the core AI model</li>
                    <li>You can opt out of AI features at any time</li>
                  </ul>

                  <p className="text-sm text-[var(--text-secondary)] mt-6">
                    For more details about Gemini's data handling, please visit Google's AI privacy policy.
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-[var(--border)] bg-[var(--background-secondary)] rounded-b-xl">
                {/* Footer content */}
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full px-4 py-2 text-center text-[var(--text)] bg-[var(--card)] hover:bg-[var(--primary)] hover:text-white rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-40 animate-fade-in" 
            onClick={() => setShowAboutModal(false)}
          />
          <div 
            className="fixed z-50 animate-float-up max-w-lg w-[90vw] mx-auto" 
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <div className="bg-[var(--card)] text-[var(--text)] rounded-xl border border-[var(--border)] shadow-2xl">
              <div className="p-6 border-b border-[var(--border)]">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">About This Page</h2>
                  <button onClick={() => setShowAboutModal(false)}
                          className="p-2 hover:bg-[var(--background-secondary)] rounded-full transition-colors"
                          aria-label="Close modal">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 16rem)" }}>
                <p className="mb-4">
                  This unofficial site is not affiliated with the Department of National Defence (DND), the Canadian Armed Forces (CAF), or any associated departments or services. Use of this site is entirely at your own discretion.
                </p>
                <h3 className="font-semibold mb-2">Purpose</h3>
                <p className="mb-4">
                  Our goal is to provide Primary Reserve (P Res) members with quick and convenient access to essential G8 resources. We strive to streamline administrative processes and ensure you can locate accurate, up-to-date information whenever you need it.
                </p>
                <h3 className="font-semibold mb-2">Currently Available</h3>
                <ul className="list-disc list-inside mb-4">
                  <li>SCIP – Your centralized portal for financial and administrative functions</li>
                  <li>SOPs – Standard Operating Procedures for day-to-day reference</li>
                  <li>Onboarding Guide – A step-by-step manual to welcome and orient new members</li>
                </ul>
                <h3 className="font-semibold mb-2">Coming Soon</h3>
                <ul className="list-disc list-inside mb-4">
                  <li>Unofficial Policy Chatbot – An interactive tool designed to answer your questions about claims and travel entitlements, referencing the CFTDTI and NJC websites</li>
                </ul>
                <h3 className="font-semibold mb-2">Privacy & Contact</h3>
                <p className="mb-4">
                  For privacy concerns, please use the Contact button or refer to our Privacy Policy. Your feedback is always welcome, and we look forward to improving your administrative experience.
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Disclaimer: This page is not supported by the Defence Wide Area Network (DWAN).
                </p>
              </div>
              <div className="p-6 border-t border-[var(--border)] bg-[var(--background-secondary)] rounded-b-xl">
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="w-full px-4 py-2 text-center text-[var(--text)] bg-[var(--card)] hover:bg-[var(--primary)] hover:text-white rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
