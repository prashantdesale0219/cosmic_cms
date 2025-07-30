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
const Testimonials = lazy(() => import('./pages/testimonials/Testimonials'));
const TestimonialForm = lazy(() => import('./pages/testimonials/TestimonialForm'));
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
const EnergySolutions = lazy(() => import('./pages/energy-solutions/EnergySolutions'));
const EnergySolutionForm = lazy(() => import('./pages/energy-solutions/EnergySolutionForm'));

function RequireAuth({ children }) {
  const { token } = useContext(AuthContext);
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
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Suspense fallback={<div>Loading...</div>}><Profile /></Suspense>} />
            {/* Users Management */}
            <Route path="users" element={<Suspense fallback={<div>Loading...</div>}><Users /></Suspense>} />
            <Route path="users/new" element={<Suspense fallback={<div>Loading...</div>}><UserForm /></Suspense>} />
            <Route path="users/:id" element={<Suspense fallback={<div>Loading...</div>}><UserForm /></Suspense>} />
            {/* Blog Posts */}
            <Route path="posts" element={<Suspense fallback={<div>Loading...</div>}><Posts /></Suspense>} />
            <Route path="posts/new" element={<Suspense fallback={<div>Loading...</div>}><PostForm /></Suspense>} />
            <Route path="posts/:id" element={<Suspense fallback={<div>Loading...</div>}><PostForm /></Suspense>} />
            {/* Products */}
            <Route path="products" element={<Suspense fallback={<div>Loading...</div>}><Products /></Suspense>} />
            <Route path="products/new" element={<Suspense fallback={<div>Loading...</div>}><ProductForm /></Suspense>} />
            <Route path="products/:id" element={<Suspense fallback={<div>Loading...</div>}><ProductForm /></Suspense>} />
            {/* Projects */}
            <Route path="projects" element={<Suspense fallback={<div>Loading...</div>}><Projects /></Suspense>} />
            <Route path="projects/new" element={<Suspense fallback={<div>Loading...</div>}><ProjectForm /></Suspense>} />
            <Route path="projects/:id" element={<Suspense fallback={<div>Loading...</div>}><ProjectForm /></Suspense>} />
            {/* Hero Slides */}
            <Route path="hero-slides" element={<Suspense fallback={<div>Loading...</div>}><HeroSlides /></Suspense>} />
            <Route path="hero-slides/new" element={<Suspense fallback={<div>Loading...</div>}><HeroSlideForm /></Suspense>} />
            <Route path="hero-slides/:id" element={<Suspense fallback={<div>Loading...</div>}><HeroSlideForm /></Suspense>} />
            {/* Testimonials */}
            <Route path="testimonials" element={<Suspense fallback={<div>Loading...</div>}><Testimonials /></Suspense>} />
            <Route path="testimonials/new" element={<Suspense fallback={<div>Loading...</div>}><TestimonialForm /></Suspense>} />
            <Route path="testimonials/:id" element={<Suspense fallback={<div>Loading...</div>}><TestimonialForm /></Suspense>} />
            {/* Team Members */}
            <Route path="team" element={<Suspense fallback={<div>Loading...</div>}><TeamMembers /></Suspense>} />
            <Route path="team/new" element={<Suspense fallback={<div>Loading...</div>}><TeamMemberForm /></Suspense>} />
            <Route path="team/:id" element={<Suspense fallback={<div>Loading...</div>}><TeamMemberForm /></Suspense>} />
            {/* FAQs */}
            <Route path="faqs" element={<Suspense fallback={<div>Loading...</div>}><Faqs /></Suspense>} />
            <Route path="faqs/new" element={<Suspense fallback={<div>Loading...</div>}><FaqForm /></Suspense>} />
            <Route path="faqs/:id" element={<Suspense fallback={<div>Loading...</div>}><FaqForm /></Suspense>} />
            {/* Categories */}
            <Route path="categories" element={<Suspense fallback={<div>Loading...</div>}><Categories /></Suspense>} />
            <Route path="categories/new" element={<Suspense fallback={<div>Loading...</div>}><CategoryForm /></Suspense>} />
            <Route path="categories/:id" element={<Suspense fallback={<div>Loading...</div>}><CategoryForm /></Suspense>} />
            {/* Tags */}
            <Route path="tags" element={<Suspense fallback={<div>Loading...</div>}><Tags /></Suspense>} />
            <Route path="tags/new" element={<Suspense fallback={<div>Loading...</div>}><TagForm /></Suspense>} />
            <Route path="tags/:id" element={<Suspense fallback={<div>Loading...</div>}><TagForm /></Suspense>} />
            {/* Contacts */}
            <Route path="contacts" element={<Suspense fallback={<div>Loading...</div>}><Contacts /></Suspense>} />
            <Route path="contacts/:id" element={<Suspense fallback={<div>Loading...</div>}><ContactDetail /></Suspense>} />
            {/* Media */}
            <Route path="media" element={<Suspense fallback={<div>Loading...</div>}><Media /></Suspense>} />
            <Route path="media/upload" element={<Suspense fallback={<div>Loading...</div>}><MediaUpload /></Suspense>} />
            {/* Menus */}
            <Route path="menus" element={<Suspense fallback={<div>Loading...</div>}><Menus /></Suspense>} />
            <Route path="menus/new" element={<Suspense fallback={<div>Loading...</div>}><MenuForm /></Suspense>} />
            <Route path="menus/:id" element={<Suspense fallback={<div>Loading...</div>}><MenuForm /></Suspense>} />
            {/* Settings */}
            <Route path="settings" element={<Suspense fallback={<div>Loading...</div>}><Settings /></Suspense>} />
            {/* Energy Solutions */}
            <Route path="energy-solutions" element={<Suspense fallback={<div>Loading...</div>}><EnergySolutions /></Suspense>} />
            <Route path="energy-solutions/new" element={<Suspense fallback={<div>Loading...</div>}><EnergySolutionForm /></Suspense>} />
            <Route path="energy-solutions/:id" element={<Suspense fallback={<div>Loading...</div>}><EnergySolutionForm /></Suspense>} />
          </Route>
        </Route>
        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;