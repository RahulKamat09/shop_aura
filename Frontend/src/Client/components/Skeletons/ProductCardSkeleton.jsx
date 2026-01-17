import "../../../skeleton.css"
const ProductCardSkeleton = () => {
    return (
        <div className="product-card">
            {/* Image */}
            <div
                className="skeleton"
                style={{ height: '220px', borderRadius: '12px' }}
            />

            {/* Info */}
            <div className="product-info">
                <div className="skeleton" style={{ height: '14px', width: '60%' }} />
                <div className="skeleton" style={{ height: '18px', marginTop: '0.5rem' }} />
                <div className="skeleton" style={{ height: '16px', width: '40%', marginTop: '0.75rem' }} />
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
