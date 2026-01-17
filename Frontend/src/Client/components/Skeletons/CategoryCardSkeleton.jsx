import "../../../skeleton.css"
const CategoryCardSkeleton = () => {
  return (
    <div className="category-item">
      <div
        className="skeleton"
        style={{
          height: '120px',
          borderRadius: '12px',
          marginBottom: '0.75rem'
        }}
      />
      <div
        className="skeleton"
        style={{ height: '16px', width: '60%', margin: '0 auto' }}
      />
    </div>
  );
};

export default CategoryCardSkeleton;
