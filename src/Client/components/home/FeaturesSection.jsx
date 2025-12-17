import { Truck, RefreshCw, Tag, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Nulla sit morbi vestibulum eros duis amet, consectetur vitae lacus. Ut quis tempor felis sed nunc viverra."
  },
  {
    icon: RefreshCw,
    title: "Money Back Guarantee",
    description: "Nullam gravida felis ac nunc tincidunt, sed malesuada justo pulvinar. Vestibulum nec diam vitae eros."
  },
  {
    icon: Tag,
    title: "Discount Offers",
    description: "Nulla ipsum nisi vel adipiscing amet, dignissim consectetur ornare. Vestibulum quis posuere elit auctor."
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Ipsum dolor amet sit consectetur adipiscing, nullam vitae euismod tempor nunc felis vestibulum ornare."
  }
];

const FeaturesSection = () => {
  return (
    <section style={{ padding: '4rem 0', backgroundColor: 'var(--background)' }}>
      <div className="container-custom">
        <div className="grid-3">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card animate-slide-up" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon">
                <feature.icon size={56} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
