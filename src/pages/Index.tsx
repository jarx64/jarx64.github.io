import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import InteractiveGridBackground from "@/components/InteractiveGridBackground";
import GitFlowSection from "@/components/GitFlowSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <InteractiveGridBackground className="fixed inset-0" />
      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          <GitFlowSection />
          <ContactSection />
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default Index;
