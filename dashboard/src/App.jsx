import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Eagerly loaded pages
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Lazily loaded pages for better performance
const Profile = lazy(() => import('./pages/Profile'));
const Users = lazy(() => import('./pages/Users'));
const UserForm = lazy(() => import('./pages/UserForm'));
const Posts = lazy(() => import('./pages/blog/Posts'));
const PostForm = lazy(() => import('./pages/blog/PostForm'));
const Products = lazy(() => import('./pages/products/Products'));
const ProductForm = lazy(() => import('./pages/products/ProductForm'));
const Projects = lazy(() => import('./pages/projects/Projects'));
const ProjectForm = lazy(() => import('./pages/projects/ProjectForm'));
const HeroSlides = lazy(() => import('./pages/hero/HeroSlides'));
const HeroSlideForm = lazy(() => import('./pages/hero/HeroSlideForm'));

const HappyClients = lazy(() => import('./pages/happyclients/HappyClients'));
const HappyClientForm = lazy(() => import('./pages/happyclients/HappyClientForm'));
const TeamMembers = lazy(() => import('./pages/team/TeamMembers'));
const TeamMemberForm = lazy(() => import('./pages/team/TeamMemberForm'));
const Faqs = lazy(() => import('./pages/faqs/Faqs'));
const FaqForm = lazy(() => import('./pages/faqs/FaqForm'));
const Categories = lazy(() => import('./pages/categories/Categories'));
const CategoryForm = lazy(() => import('./pages/categories/CategoryForm'));
const Tags = lazy(() => import('./pages/tags/Tags'));
const TagForm = lazy(() => import('./pages/tags/TagForm'));
const Contacts = lazy(() => import('./pages/contacts/Contacts'));
const ContactDetail = lazy(() => import('./pages/contacts/ContactDetail'));
const Media = lazy(() => import('./pages/media/Media'));
const MediaUpload = lazy(() => import('./pages/media/MediaUpload'));
const Menus = lazy(() => import('./pages/menus/Menus'));
const MenuForm = lazy(() => import('./pages/menus/MenuForm'));
const Settings = lazy(() => import('./pages/settings/Settings'));

const SolarSolutions = lazy(() => import('./pages/solar-solutions/SolarSolutions'));
const SolarSolutionForm = lazy(() => import('./pages/solar-solutions/SolarSolutionForm'));
const PanIndiaPresenceCMS = lazy(() => import('./pages/pan-india-presence/PanIndiaPresenceCMS'));
const GreenFutureList = lazy(() => import('./pages/GreenFuture/GreenFutureList'));
const GreenFutureForm = lazy(() => import('./pages/GreenFuture/GreenFutureForm'));
const NewsCardForm = lazy(() => import('./pages/GreenFuture/NewsCardForm'));
const ClientList = lazy(() => import('./pages/Clients/ClientList'));
const ClientForm = lazy(() => import('./pages/Clients/ClientForm'));
const ClientDetail = lazy(() => import('./pages/Clients/ClientDetail'));
const TimelineList = lazy(() => import('./pages/Timeline/TimelineList'));
const TimelineForm = lazy(() => import('./pages/Timeline/TimelineForm'));

// About Pages
const AboutHero = lazy(() => import('./pages/about/AboutHero'));
const AboutUs = lazy(() => import('./pages/about/AboutUs'));
const WhoWeAre = lazy(() => import('./pages/about/WhoWeAre'));
const OurExpertise = lazy(() => import('./pages/about/OurExpertise'));
const WhyChooseCosmic = lazy(() => import('./pages/about/WhyChooseCosmic'));
const VisionMissionValues = lazy(() => import('./pages/about/VisionMissionValues'));
const TestimonialsList = lazy(() => import('./pages/testimonials/TestimonialsList'));
const TestimonialForm = lazy(() => import('./pages/testimonials/TestimonialForm'));

// Director Pages
const DirectorList = lazy(() => import('./pages/directors/DirectorList'));
const DirectorForm = lazy(() => import('./pages/directors/DirectorForm'));
const DirectorHero = lazy(() => import('./pages/directors/DirectorHero'));
const DirectorCTA = lazy(() => import('./pages/directors/DirectorCTA'));

// Company Culture Pages
const CompanyCultureHero = lazy(() => import('./pages/company-culture/CompanyCultureHero'));
const BrandVision = lazy(() => import('./pages/company-culture/BrandVision'));
const CoreValues = lazy(() => import('./pages/company-culture/CoreValues'));
const WorkEnvironment = lazy(() => import('./pages/company-culture/WorkEnvironment'));
const SustainabilityCards = lazy(() => import('./pages/company-culture/SustainabilityCards'));
const SustainabilityCommitment = lazy(() => import('./pages/company-culture/SustainabilityCommitment'));
const JoinTeamCTA = lazy(() => import('./pages/company-culture/JoinTeamCTA'));

// Team Celebration Pages
const TeamCelebrationHero = lazy(() => import('./pages/team-celebration/TeamCelebrationHero'));
const TeamCulture = lazy(() => import('./pages/team-celebration/TeamCulture'));
const CelebrationEvents = lazy(() => import('./pages/team-celebration/CelebrationEvents'));
const CelebrationEventForm = lazy(() => import('./pages/team-celebration/CelebrationEventForm'));
const TeamAchievements = lazy(() => import('./pages/team-celebration/TeamAchievements'));
const TeamAchievementForm = lazy(() => import('./pages/team-celebration/TeamAchievementForm'));
const TeamCelebrationCTA = lazy(() => import('./pages/team-celebration/TeamCelebrationCTA'));

// Services Pages
const ServiceHero = lazy(() => import('./pages/services/ServiceHero'));
const MainServices = lazy(() => import('./pages/services/MainServices'));
const AdditionalServices = lazy(() => import('./pages/services/AdditionalServices'));
const ProcessSteps = lazy(() => import('./pages/services/ProcessSteps'));
const ServiceCta = lazy(() => import('./pages/services/ServiceCta'));
const SavingsCalculator = lazy(() => import('./pages/services/SavingsCalculator'));

// Header and Footer Pages
const HeaderList = lazy(() => import('./pages/header/HeaderList'));
const HeaderForm = lazy(() => import('./pages/header/HeaderForm'));
const FooterList = lazy(() => import('./pages/footer/FooterList'));
const FooterForm = lazy(() => import('./pages/footer/FooterForm'));



function RequireAuth({ children }) {
  const { token, isLoading } = useContext(AuthContext);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return children ? children : <Outlet />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth Pages */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        {/* Protected Dashboard Layout and Pages */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Suspense fallback={<div>Loading...</div>}><Profile /></Suspense>} />
            {/* Users Management */}
            <Route path="users" element={<Suspense fallback={<div>Loading...</div>}><Users /></Suspense>} />
            <Route path="users/new" element={<Suspense fallback={<div>Loading...</div>}><UserForm /></Suspense>} />
            <Route path="users/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><UserForm /></Suspense>} />
            {/* Blog Posts */}
            <Route path="posts" element={<Suspense fallback={<div>Loading...</div>}><Posts /></Suspense>} />
            <Route path="posts/new" element={<Suspense fallback={<div>Loading...</div>}><PostForm /></Suspense>} />
            <Route path="posts/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><PostForm /></Suspense>} />
            {/* Products */}
            <Route path="products" element={<Suspense fallback={<div>Loading...</div>}><Products /></Suspense>} />
            <Route path="products/new" element={<Suspense fallback={<div>Loading...</div>}><ProductForm /></Suspense>} />
            <Route path="products/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><ProductForm /></Suspense>} />
            {/* Projects */}
            <Route path="projects" element={<Suspense fallback={<div>Loading...</div>}><Projects /></Suspense>} />
            <Route path="projects/new" element={<Suspense fallback={<div>Loading...</div>}><ProjectForm /></Suspense>} />
            <Route path="projects/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><ProjectForm /></Suspense>} />
            {/* Hero Slides */}
            <Route path="hero-slides" element={<Suspense fallback={<div>Loading...</div>}><HeroSlides /></Suspense>} />
            <Route path="hero-slides/new" element={<Suspense fallback={<div>Loading...</div>}><HeroSlideForm /></Suspense>} />
            <Route path="hero-slides/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><HeroSlideForm /></Suspense>} />

            {/* Team Members */}
            <Route path="team" element={<Suspense fallback={<div>Loading...</div>}><TeamMembers /></Suspense>} />
                <Route path="team/new" element={<Suspense fallback={<div>Loading...</div>}><TeamMemberForm /></Suspense>} />
                <Route path="team/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><TeamMemberForm /></Suspense>} />
            {/* Happy Clients */}
            <Route path="happy-clients" element={<Suspense fallback={<div>Loading...</div>}><HappyClients /></Suspense>} />
            <Route path="happy-clients/new" element={<Suspense fallback={<div>Loading...</div>}><HappyClientForm /></Suspense>} />
            <Route path="happy-clients/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><HappyClientForm /></Suspense>} />
            {/* FAQs */}
            <Route path="faqs" element={<Suspense fallback={<div>Loading...</div>}><Faqs /></Suspense>} />
            <Route path="faqs/new" element={<Suspense fallback={<div>Loading...</div>}><FaqForm /></Suspense>} />
            <Route path="faqs/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><FaqForm /></Suspense>} />
            {/* Categories */}
            <Route path="categories" element={<Suspense fallback={<div>Loading...</div>}><Categories /></Suspense>} />
            <Route path="categories/new" element={<Suspense fallback={<div>Loading...</div>}><CategoryForm /></Suspense>} />
            <Route path="categories/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><CategoryForm /></Suspense>} />
            {/* Tags */}
            <Route path="tags" element={<Suspense fallback={<div>Loading...</div>}><Tags /></Suspense>} />
            <Route path="tags/new" element={<Suspense fallback={<div>Loading...</div>}><TagForm /></Suspense>} />
            <Route path="tags/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><TagForm /></Suspense>} />
            {/* Contacts */}
            <Route path="contacts" element={<Suspense fallback={<div>Loading...</div>}><Contacts /></Suspense>} />
            <Route path="contacts/:id" element={<Suspense fallback={<div>Loading...</div>}><ContactDetail /></Suspense>} />
            {/* Media */}
            <Route path="media" element={<Suspense fallback={<div>Loading...</div>}><Media /></Suspense>} />
            <Route path="media/upload" element={<Suspense fallback={<div>Loading...</div>}><MediaUpload /></Suspense>} />
            {/* Menus */}
            <Route path="menus" element={<Suspense fallback={<div>Loading...</div>}><Menus /></Suspense>} />
            <Route path="menus/new" element={<Suspense fallback={<div>Loading...</div>}><MenuForm /></Suspense>} />
            <Route path="menus/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><MenuForm /></Suspense>} />
            {/* Settings */}
            <Route path="settings" element={<Suspense fallback={<div>Loading...</div>}><Settings /></Suspense>} />

            {/* Solar Solutions */}
            <Route path="solar-solutions" element={<Suspense fallback={<div>Loading...</div>}><SolarSolutions /></Suspense>} />
            <Route path="solar-solutions/new" element={<Suspense fallback={<div>Loading...</div>}><SolarSolutionForm /></Suspense>} />
            <Route path="solar-solutions/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><SolarSolutionForm /></Suspense>} />
            {/* Pan India Presence */}
            <Route path="pan-india-presence" element={<Suspense fallback={<div>Loading...</div>}><PanIndiaPresenceCMS /></Suspense>} />
            {/* Green Future */}
            <Route path="green-future" element={<Suspense fallback={<div>Loading...</div>}><GreenFutureList /></Suspense>} />
            <Route path="green-future/edit" element={<Suspense fallback={<div>Loading...</div>}><GreenFutureForm /></Suspense>} />
            <Route path="green-future/news/new" element={<Suspense fallback={<div>Loading...</div>}><NewsCardForm /></Suspense>} />
            <Route path="green-future/news/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><NewsCardForm /></Suspense>} />
            {/* Timeline */}
            <Route path="timeline" element={<Suspense fallback={<div>Loading...</div>}><TimelineList /></Suspense>} />
            <Route path="timeline/new" element={<Suspense fallback={<div>Loading...</div>}><TimelineForm /></Suspense>} />
            <Route path="timeline/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><TimelineForm /></Suspense>} />
            {/* Clients */}
            <Route path="clients" element={<Suspense fallback={<div>Loading...</div>}><ClientList /></Suspense>} />
            <Route path="clients/new" element={<Suspense fallback={<div>Loading...</div>}><ClientForm /></Suspense>} />
            <Route path="clients/:id" element={<Suspense fallback={<div>Loading...</div>}><ClientDetail /></Suspense>} />
            <Route path="clients/:id/edit" element={<Suspense fallback={<div>Loading...</div>}><ClientForm /></Suspense>} />
            {/* About Pages */}
            <Route path="about/hero" element={<Suspense fallback={<div>Loading...</div>}><AboutHero /></Suspense>} />
            <Route path="about/about-us" element={<Suspense fallback={<div>Loading...</div>}><AboutUs /></Suspense>} />
            <Route path="about/who-we-are" element={<Suspense fallback={<div>Loading...</div>}><WhoWeAre /></Suspense>} />
            <Route path="about/our-expertise" element={<Suspense fallback={<div>Loading...</div>}><OurExpertise /></Suspense>} />
            <Route path="about/why-choose-cosmic" element={<Suspense fallback={<div>Loading...</div>}><WhyChooseCosmic /></Suspense>} />
            <Route path="about/vision-mission-values" element={<Suspense fallback={<div>Loading...</div>}><VisionMissionValues /></Suspense>} />
            <Route path="about/testimonials" element={<Suspense fallback={<div>Loading...</div>}><TestimonialsList /></Suspense>} />
            <Route path="about/testimonials/new" element={<Suspense fallback={<div>Loading...</div>}><TestimonialForm /></Suspense>} />
            <Route path="about/testimonials/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><TestimonialForm /></Suspense>} />
            {/* Services Pages */}
            <Route path="services/hero" element={<Suspense fallback={<div>Loading...</div>}><ServiceHero /></Suspense>} />
            <Route path="services/main-services" element={<Suspense fallback={<div>Loading...</div>}><MainServices /></Suspense>} />
            <Route path="services/additional-services" element={<Suspense fallback={<div>Loading...</div>}><AdditionalServices /></Suspense>} />
            <Route path="services/process-steps" element={<Suspense fallback={<div>Loading...</div>}><ProcessSteps /></Suspense>} />
            <Route path="services/cta" element={<Suspense fallback={<div>Loading...</div>}><ServiceCta /></Suspense>} />
            <Route path="services/savings-calculator" element={<Suspense fallback={<div>Loading...</div>}><SavingsCalculator /></Suspense>} />
            {/* Director Pages */}
            <Route path="directors" element={<Suspense fallback={<div>Loading...</div>}><DirectorList /></Suspense>} />
            <Route path="directors/new" element={<Suspense fallback={<div>Loading...</div>}><DirectorForm /></Suspense>} />
            <Route path="directors/:id/edit" element={<Suspense fallback={<div>Loading...</div>}><DirectorForm /></Suspense>} />
            <Route path="directors/hero" element={<Suspense fallback={<div>Loading...</div>}><DirectorHero /></Suspense>} />
            <Route path="directors/cta" element={<Suspense fallback={<div>Loading...</div>}><DirectorCTA /></Suspense>} />
            {/* Company Culture Pages */}
            <Route path="company-culture/hero" element={<Suspense fallback={<div>Loading...</div>}><CompanyCultureHero /></Suspense>} />
            <Route path="company-culture/brand-vision" element={<Suspense fallback={<div>Loading...</div>}><BrandVision /></Suspense>} />
            <Route path="company-culture/core-values" element={<Suspense fallback={<div>Loading...</div>}><CoreValues /></Suspense>} />
            <Route path="company-culture/work-environment" element={<Suspense fallback={<div>Loading...</div>}><WorkEnvironment /></Suspense>} />
            <Route path="company-culture/sustainability-cards" element={<Suspense fallback={<div>Loading...</div>}><SustainabilityCards /></Suspense>} />
            <Route path="company-culture/sustainability-commitment" element={<Suspense fallback={<div>Loading...</div>}><SustainabilityCommitment /></Suspense>} />
            <Route path="company-culture/join-team-cta" element={<Suspense fallback={<div>Loading...</div>}><JoinTeamCTA /></Suspense>} />
            {/* Team Celebration Pages */}
            <Route path="team-celebration/hero" element={<Suspense fallback={<div>Loading...</div>}><TeamCelebrationHero /></Suspense>} />
            <Route path="team-celebration/culture" element={<Suspense fallback={<div>Loading...</div>}><TeamCulture /></Suspense>} />
            <Route path="team-celebration/events" element={<Suspense fallback={<div>Loading...</div>}><CelebrationEvents /></Suspense>} />
            <Route path="team-celebration/events/new" element={<Suspense fallback={<div>Loading...</div>}><CelebrationEventForm /></Suspense>} />
            <Route path="team-celebration/events/:id/edit" element={<Suspense fallback={<div>Loading...</div>}><CelebrationEventForm /></Suspense>} />
            <Route path="team-celebration/achievements" element={<Suspense fallback={<div>Loading...</div>}><TeamAchievements /></Suspense>} />
            <Route path="team-celebration/achievements/new" element={<Suspense fallback={<div>Loading...</div>}><TeamAchievementForm /></Suspense>} />
            <Route path="team-celebration/achievements/:id/edit" element={<Suspense fallback={<div>Loading...</div>}><TeamAchievementForm /></Suspense>} />
            <Route path="team-celebration/cta" element={<Suspense fallback={<div>Loading...</div>}><TeamCelebrationCTA /></Suspense>} />
            {/* Header Management */}
            <Route path="header" element={<Suspense fallback={<div>Loading...</div>}><HeaderList /></Suspense>} />
            <Route path="header/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><HeaderForm /></Suspense>} />
            {/* Footer Management */}
            <Route path="footer" element={<Suspense fallback={<div>Loading...</div>}><FooterList /></Suspense>} />
            <Route path="footer/edit/:id" element={<Suspense fallback={<div>Loading...</div>}><FooterForm /></Suspense>} />
          </Route>
        </Route>
        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;