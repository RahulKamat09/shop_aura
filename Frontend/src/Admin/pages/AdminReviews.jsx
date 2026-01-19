import { useEffect, useState } from "react";
import api from "../../api/api";
import toast from "react-hot-toast";
import { Trash2, Send, Star, Edit2 } from "lucide-react";
import Pagination from "../components/Pagination";

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState({});
    const [editingReplyId, setEditingReplyId] = useState(null);


    const [currentPage, setCurrentPage] = useState(1);
    const REVIEWS_PER_PAGE = 3;

    const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

    const paginatedReviews = reviews.slice(
        (currentPage - 1) * REVIEWS_PER_PAGE,
        currentPage * REVIEWS_PER_PAGE
    );



    // Fetch reviews + products
    const fetchData = async () => {
        try {
            setLoading(true);

            const [reviewsRes, productsRes] = await Promise.all([
                api.get("/reviews"),
                api.get("/products"),
            ]);

            setReviews(reviewsRes.data);
            setProducts(productsRes.data);
        } catch {
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Helpers
    const getProduct = (productId) =>
        products.find((p) => String(p.id) === String(productId));


    // Delete review
    const deleteReview = async (id) => {
        if (!window.confirm("Delete this review?")) return;

        try {
            await api.delete(`/reviews/${id}`);
            toast.success("Review deleted");
            fetchData();
        } catch {
            toast.error("Failed to delete review");
        }
    };

    // Reply to review
    const handleReply = async (id) => {
        if (!replyText[id]) return;

        try {
            await api.patch(`/reviews/${id}`, {
                adminReply: replyText[id],
            });

            toast.success("Reply updated");
            setEditingReplyId(null);
            fetchData();
        } catch {
            toast.error("Failed to reply");
        }
    };


    if (loading) return <p>Loading reviews...</p>;

    return (
        <div className="admin-page">
            <h2>Customer Reviews</h2>

            {reviews.length === 0 && <p>No reviews found.</p>}

            {paginatedReviews.map((review) => {
                const product = getProduct(review.productId);

                return (
                    <div key={review.id} className="admin-review-card">
                        <div className="admin-review-top">
                            {product && (
                                <div className="admin-review-product">
                                    <img
                                        src={product?.image || "/placeholder.png"}
                                        alt={product?.name}
                                        className="admin-review-product-img"
                                    />
                                    <div>
                                        <h4 className="admin-review-product-name">
                                            {product?.name}
                                        </h4>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Customer Info */}
                        <div className="admin-review-header">
                            <strong>{review.name}</strong>

                            <div className="admin-review-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        fill={i < review.rating ? "currentColor" : "none"}
                                        className={i < review.rating ? "star" : "star-empty"}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Review Text */}
                        <p className="admin-review-text">{review.comment}</p>

                        {/* Admin Reply Display */}
                        {review.adminReply && editingReplyId !== review.id && (
                            <div className="admin-reply-box">
                                <span className="admin-reply-label">Admin Reply</span>
                                <p className="admin-reply-text">{review.adminReply}</p>
                            </div>
                        )}


                        {/* Reply Box */}
                        {editingReplyId === review.id && (
                            <textarea
                                placeholder="Write admin reply..."
                                value={replyText[review.id] ?? review.adminReply ?? ""}
                                onChange={(e) =>
                                    setReplyText({
                                        ...replyText,
                                        [review.id]: e.target.value,
                                    })
                                }
                            />
                        )}


                        {/* Actions */}
                        <div className="admin-review-actions">
                            {/* SAVE BUTTON */}
                            {editingReplyId === review.id && (
                                <button
                                    className="reply-btn"
                                    onClick={() => handleReply(review.id)}
                                >
                                    <Send size={16} /> Save
                                </button>
                            )}

                            {/* REPLY BUTTON (only if no reply exists) */}
                            {!review.adminReply && editingReplyId !== review.id && (
                                <button
                                    className="reply-btn"
                                    onClick={() => {
                                        setEditingReplyId(review.id);
                                        setReplyText((prev) => ({
                                            ...prev,
                                            [review.id]: "",
                                        }));
                                    }}
                                >
                                    <Send size={16} /> Reply
                                </button>
                            )}

                            {/* EDIT BUTTON (only if reply exists) */}
                            {review.adminReply && editingReplyId !== review.id && (
                                <button
                                    className="edit-btn"
                                    onClick={() => {
                                        setEditingReplyId(review.id);
                                        setReplyText((prev) => ({
                                            ...prev,
                                            [review.id]: review.adminReply,
                                        }));
                                    }}
                                >
                                    <Edit2 size={16}/> Edit Reply
                                </button>
                            )}

                            {/* DELETE */}
                            <button
                                className="delete-btn"
                                onClick={() => deleteReview(review.id)}
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>

                    </div>
                );
            })}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default AdminReviews;
