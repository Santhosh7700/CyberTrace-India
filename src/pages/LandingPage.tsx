import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import HowItWorksSection from '../components/HowItWorksSection';
import ReportCategoriesSection from '../components/ReportCategoriesSection';
import SafetyGuidelinesSection from '../components/SafetyGuidelinesSection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <HowItWorksSection />
        <ReportCategoriesSection />
        <SafetyGuidelinesSection />
      </main>
      <Footer />
    </div>
  );
}
