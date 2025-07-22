import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { motion } from "framer-motion";
import './App.css'


// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'
import CustomerSupportChat from './components/CustomerSupportChat'
import OfferPopup from './components/OfferPopup'
import ScrollToTop from './components/ScrollToTop'

// Pages
import Home from './pages/home'
import About from './pages/about'
import Services from './pages/services'
import Projects from './pages/projects'
import Calculator from './pages/calculator'
import AdvancedCalculator from './pages/advanced-calculator'
import Contact from './pages/contact'
import Blog from './pages/blog'
import BlogDetail from './pages/blogDetail'
import Careers from './pages/careers'
import SolarPanels from './pages/products/solar-panels'
import InvertersBatteries from './pages/products/inverters-batteries'
import Accessories from './pages/products/accessories'
import Products from './pages/products/Products';
import ProductDetail from './pages/products/product-detail';
import ProjectDetail from './pages/project-detail';
import PressRelease from './pages/pr'
import TeamCelebration from './pages/team-celebration'
import DirectorDesk from './pages/director-desk'
import CompanyCulture from './pages/company-culture'
import AchievementsAwards from './pages/achievements-awards'


// AppContent component to handle transitions
function AppContent() {
  const location = useLocation();
  
  // Scroll to top when location changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <div className="min-h-screen bg-white w-full flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow">
        <TransitionGroup component={null}>
          <CSSTransition 
            key={location.key} 
            timeout={400} 
            classNames="page"
            unmountOnExit
          >
            <div className="page-container">
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/solar-panels" element={<SolarPanels />} />
                <Route path="/products/inverters-batteries" element={<InvertersBatteries />} />
                <Route path="/products/accessories" element={<Accessories />} />
                <Route path="/products/product-detail/:id" element={<ProductDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/advanced-calculator" element={<AdvancedCalculator />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/pr" element={<PressRelease />} />
                <Route path="/achievements-awards" element={<AchievementsAwards />} />
                <Route path="/team-celebration" element={<TeamCelebration />} />
                <Route path="/director-desk" element={<DirectorDesk />} />
                <Route path="/company-culture" element={<CompanyCulture />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </main>

      <Footer />
      <CookieConsent />
      <OfferPopup />
      <ScrollToTop />
      <CustomerSupportChat />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
