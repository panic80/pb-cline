import React, { useEffect, useState } from 'react';
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

export default function LandingPage() {
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

  return (
    <>
      <div className="relative">
        <div className="transition-all duration-300">
          <div className="bg-[var(--background)] text-[var(--text)] pt-12 min-h-screen overflow-y-auto">
            {/* Hero Section */}
            <main className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
              <div className="w-full max-w-4xl mx-auto text-center">
                <div className="mb-10 flex justify-center">
                  <BuildingLibraryIcon className="w-24 h-24 text-[var(--primary)]" aria-hidden="true" />
                </div>
                <h1 className="text-4xl md:text-6xl font-light mb-4 animate-fade-in" role="heading" aria-level="1">
                  Welcome to 32 CBG G8 Homepage
                  <span className="block text-xl md:text-2xl mt-4 text-[var(--text-secondary)]">Non-DWAN</span>
                </h1>
                <p className="text-xl text-center max-w-2xl mx-auto mt-6 mb-8 text-[var(--text)] opacity-80">
                  Your comprehensive guide to policy information, submit claims and contact.
                </p>
              </div>
            </main>

            {/* Features Section */}
            <section className="pt-2 pb-16 md:pt-4 md:pb-24 px-4 sm:px-6 lg:px-8 bg-[var(--background-secondary)]" aria-label="Features">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <Link
                  to="/chat"
                  className="p-4 rounded-lg bg-[var(--card)] transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                  aria-label="Access Policy Chat Beta"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3">
                      <QuestionMarkCircleIcon className="w-12 h-12 text-[var(--primary)]" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-medium mb-3 text-[var(--text)]">
                      Policy Chatbot
                    </h3>
                    <p className="text-[var(--text)] opacity-80">
                      Get immediate responses to your policy-related questions. (Beta, currently in development)
                    </p>
                  </div>
                </Link>
                <a
                  href="https://apps.powerapps.com/play/e/default-325b4494-1587-40d5-bb31-8b660b7f1038/a/75e3789b-9c1d-4feb-9515-20665ab7d6e8?tenantId=325b4494-1587-40d5-bb31-8b660b7f1038&amp;hint=c63b9850-8dc3-44f2-a186-f215cf7de716&amp;sourcetime=1738854913080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg bg-[var(--card)] transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                  aria-label="Access SCIP Platform"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3">
                      <DocumentTextIcon className="w-12 h-12 text-[var(--primary)]" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-medium mb-3 text-[var(--text)]">
                      Streamlined Claims Interface Platform (SCIP)
                    </h3>
                    <p className="text-[var(--text)] opacity-80">
                      A Power App enabling digital submission of claims.
                    </p>
                  </div>
                </a>
                <div
                  onClick={() => setShowModal(true)}
                  className="p-4 rounded-lg bg-[var(--card)] transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                  aria-label="Open Other Tools"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3">
                      <WindowIcon className="w-12 h-12 text-[var(--primary)]" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-medium mb-3 text-[var(--text)]">
                      Other Tools
                    </h3>
                    <p className="text-[var(--text)] opacity-80">
                      Kiosk Manager, SOP, etc
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]" role="contentinfo">
              <div className="max-w-5xl mx-auto">
                <nav className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8" aria-label="Footer Navigation">
                  <Link
                    to="/about"
                    className="inline-flex items-center space-x-2 text-[var(--text)] opacity-70 hover:opacity-100 hover:text-[var(--primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded px-2 py-1"
                  >
                    <InformationCircleIcon className="w-5 h-5" aria-hidden="true" />
                    <span>About</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center space-x-2 text-[var(--text)] opacity-70 hover:opacity-100 hover:text-[var(--primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded px-2 py-1"
                  >
                    <EnvelopeIcon className="w-5 h-5" aria-hidden="true" />
                    <span>Contact</span>
                  </Link>
                  <Link
                    to="/privacy"
                    className="inline-flex items-center space-x-2 text-[var(--text)] opacity-70 hover:opacity-100 hover:text-[var(--primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded px-2 py-1"
                  >
                    <ShieldCheckIcon className="w-5 h-5" aria-hidden="true" />
                    <span>Privacy</span>
                  </Link>
                </nav>
                <p className="text-center text-sm text-[var(--text)] opacity-50">
                  © {new Date().getFullYear()} Policy Assistant
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
      {showModal && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
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
                  <li className="py-3">
                    <a 
                      href="/sop" 
                      className="flex items-center p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-all duration-200 group"
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
                    </a>
                  </li>
                  <li className="py-3 last:pb-0">
                    <a 
                      href="/resources" 
                      className="flex items-center p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-all duration-200 group"
                    >
                      <div className="p-2 rounded-lg bg-[var(--background-secondary)] group-hover:bg-[var(--primary)] transition-colors">
                        <BuildingLibraryIcon className="w-6 h-6 text-[var(--primary)] group-hover:text-white" />
                      </div>
                      <div className="ml-4">
                        <span className="block font-medium group-hover:text-[var(--primary)] transition-colors">Additional Resources</span>
                        <span className="text-sm text-[var(--text-secondary)]">Other helpful tools and documents</span>
                      </div>
                      <svg className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
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
    </>
  );
}
