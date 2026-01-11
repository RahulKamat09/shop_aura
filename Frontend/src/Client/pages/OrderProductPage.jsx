import api from "../../api/api";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { Package, Calendar, CreditCard, MapPin } from "lucide-react";
import "../../orderproduct.css";

const OrderProductPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${orderId}`);

                if (!data || !data.id) {
                    toast.error("Order not found");
                    return;
                }

                setOrder(data);
            } catch (error) {
                console.error("Failed to fetch order", error);
                toast.error("Failed to load order details");
            }
        };

        fetchOrder();
    }, [orderId]);


    if (!order) {
        return <p style={{ padding: "2rem" }}>Loading order details...</p>;
    }

    const {
        date,
        payment,
        shippingAddress,
        items,
        total,
        status
    } = order;

    return (
        <Layout>
            <div className="order-container">
                {/* Header */}
                <div className="order-header">
                    <div>
                        <h1>Order #{order.id}</h1>
                        <p>
                            Status:
                            <span className={`status ${status.toLowerCase()}`}>
                                {status}
                            </span>
                        </p>
                    </div>
                    <Link to="/profile" className="btn-outline">Back to Orders</Link>
                </div>

                {/* Order Info */}
                <div className="order-info-grid">
                    <div className="order-info-card">
                        <Calendar size={18} />
                        <div>
                            <h4>Order Date</h4>
                            <p>{date}</p>
                        </div>
                    </div>

                    <div className="order-info-card">
                        <CreditCard size={18} />
                        <div>
                            <h4>Payment Method</h4>
                            <p>{payment?.method?.toUpperCase()}</p>
                            <small>Status: {payment?.status}</small>
                        </div>
                    </div>

                    <div className="order-info-card">
                        <MapPin size={18} />
                        <div>
                            <h4>Shipping Address</h4>
                            <p>
                                {shippingAddress.address}, {shippingAddress.city},<br />
                                {shippingAddress.state} {shippingAddress.zip}, {shippingAddress.country}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="order-products">
                    <h2><Package size={20} /> Ordered Products</h2>

                    {items.map(item => (
                        <div key={item.productId} className="order-product-card">
                            <img src={item.image} alt={item.name} />
                            <div className="product-info">
                                <h4>{item.name}</h4>
                                <p>Quantity: {item.qty}</p>
                            </div>
                            <div className="product-price">
                                ${(item.price * item.qty).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="order-summary">
                    <div>
                        <span>Subtotal</span>
                        <span>${(total * 0.9).toFixed(2)}</span>
                    </div>
                    <div>
                        <span>Shipping</span>
                        <span>$10.00</span>
                    </div>
                    <div>
                        <span>Tax</span>
                        <span>${(total * 0.1 - 10).toFixed(2)}</span>
                    </div>
                    <div className="total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OrderProductPage;
