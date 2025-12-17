import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import CategoriesSection from '../components/home/CategoriesSection';
import BestSellersSection from '../components/home/BestSellersSection';
import ProductsSection from '../components/home/ProductsSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <BestSellersSection />
      <ProductsSection />
    </Layout>
  );
};

export default Index;
