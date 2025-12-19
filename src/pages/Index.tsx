import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import MissionSection from "@/components/home/MissionSection";
import LatestEventsSection from "@/components/home/LatestEventsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <MissionSection />
      <LatestEventsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
