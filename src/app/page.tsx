import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ClassesOverview from "@/components/sections/ClassesOverview";
import Methodology from "@/components/sections/Methodology";
import AboutMe from "@/components/sections/AboutMe";
import Testimonials from "@/components/sections/Testimonials";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main id="content" className="min-h-screen">
      <Hero />
      <TrustBar />
      <ClassesOverview />
      <Methodology />
      <AboutMe />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
