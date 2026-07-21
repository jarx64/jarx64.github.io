import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import GitFlowSection from "@/components/GitFlowSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <GitFlowSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
