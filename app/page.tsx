import Hero from "@/components/home/Hero";
import WhyUs from "@/components/home/WhyUs";
import FeaturedFleet from "@/components/home/FeaturedFleet";
import Stats from "@/components/home/Stats";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CtaBanner from "@/components/home/CtaBanner";
import { featuredCars } from "@/data/cars";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyUs />
      <FeaturedFleet cars={featuredCars} />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
