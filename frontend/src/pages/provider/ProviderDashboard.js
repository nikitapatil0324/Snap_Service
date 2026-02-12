import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";
import { getProviderAssignments, updateBookingStatus, acceptBooking } from "../../api/api";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const provider = JSON.parse(localStorage.getItem("snapserviceUser"));
  const [orders, setOrders] = useState([]);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, reviewCount: 0 });
  const [acceptAmounts, setAcceptAmounts] = useState({}); // { bookingId: amount }

  useEffect(() => {
    const providerId = provider?.providerId || provider?.id;
    if (!providerId) return;

    async function loadData() {
      try {
        const assignments = await getProviderAssignments(providerId);
        const mapped = (assignments || []).map(booking => ({
          id: booking.bookingId,
          customer: booking.customerName || booking.customer,
          service: booking.serviceName || booking.service,
          amount: booking.amount || "₹---",
          date: booking.preferredDate || booking.date,
          status: booking.status || "Pending",
          phone: booking.phone,
          address: booking.address,
          description: booking.description,
          assignedAt: booking.assignedAt,
          isFromAdmin: true,
          originalBooking: booking,
          acceptedAmount: booking.providerAcceptedAmount
        }));
        setOrders(mapped);
      } catch (err) {
        console.error("Failed to load provider assignments", err);
      }

      try {
        const { getProviderRating } = await import("../../api/api");
        const stats = await getProviderRating(providerId);
        setRatingStats(stats);
      } catch (err) {
        console.error("Failed to load provider rating", err);
      }
    }
    loadData();
  }, [provider?.providerId, provider?.id]);

  if (!provider || provider.role !== "PROVIDER") {
    navigate("/login");
    return null;
  }

  const handleAcceptOrder = async (bookingId) => {
    const amount = acceptAmounts[bookingId];
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount before accepting.");
      return;
    }

    try {
      await acceptBooking(bookingId, parseFloat(amount));
      setOrders(orders.map(order =>
        order.id === bookingId
          ? { ...order, status: "Accepted", acceptedAmount: amount }
          : order
      ));
      alert("✓ Order accepted with amount: ₹" + amount);
    } catch (err) {
      console.error("Error accepting order:", err);
      alert("Failed to accept order. Try again.");
    }
  };

  const handleCancelOrder = (orderId) => {
    (async () => {
      try {
        await updateBookingStatus(orderId, "Rejected");
        setOrders(orders.map(order => order.id === orderId ? { ...order, status: "Rejected" } : order));
      } catch (err) {
        console.error(err);
        alert("Failed to reject order. Try again.");
      }
    })();
  };

  const handleLogout = () => {
    localStorage.removeItem("snapserviceUser");
    navigate("/login");
  };

  // Reusable helper for robust amount calculation
  const calculateTotalAmount = (filteredOrders) => {
    return filteredOrders.reduce((sum, o) => {
      let rawAmount = o.acceptedAmount;
      if (!rawAmount) {
        if (o.amount !== "₹---") {
          rawAmount = o.amount;
        } else if (o.originalBooking && o.originalBooking.service) {
          rawAmount = o.originalBooking.service.price || o.originalBooking.service.amount;
        }
      }
      const val = parseInt(String(rawAmount || "0").replace(/[₹,]/g, "")) || 0;
      return sum + val;
    }, 0);
  };

  const totalOrders = orders.length;
  const acceptedOrdersList = orders.filter(o => o.status === "Accepted");
  const acceptedOrders = acceptedOrdersList.length;
  const acceptedValue = calculateTotalAmount(acceptedOrdersList);

  const completedOrders = orders.filter(o => o.status === "Completed").length;

  const pendingOrdersList = orders.filter(o => o.status === "Pending" || o.status === "Assigned");
  const pendingOrders = pendingOrdersList.length;
  const pendingValue = calculateTotalAmount(pendingOrdersList);

  const totalEarnings = calculateTotalAmount(
    orders.filter(o => o.status === "Completed" || o.status === "Paid" || (o.originalBooking && o.originalBooking.paymentStatus === "DONE"))
  );

  return (
    <main className="dashboard provider-dashboard">
      {/* Header Section */}
      <section className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>Welcome back, <span>{provider.name}</span>!</h1>
          <p className="dashboard-subtitle">Manage your service orders and bookings • Provider ID: {provider.providerId || provider.id}</p>
        </div>
        <div className="header-buttons">
          <button onClick={() => navigate("/")} className="header-home-btn">
            🏠 Home
          </button>
          <button onClick={handleLogout} className="header-logout-btn">
            🚪 Logout
          </button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-value">{totalOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p className="stat-value">
              {pendingOrders} <span style={{ fontSize: "0.9rem", color: "#666", fontWeight: "normal" }}>(₹{pendingValue})</span>
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Accepted</h3>
            <p className="stat-value">
              {acceptedOrders} <span style={{ fontSize: "0.9rem", color: "#666", fontWeight: "normal" }}>(₹{acceptedValue})</span>
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Earnings</h3>
            <p className="stat-value">₹{totalEarnings}</p>
          </div>
        </div>
        <div className="stat-card" style={{ background: "linear-gradient(135deg, #fff9c4 0%, #fffde7 100%)", border: "1px solid #fbc02d" }}>
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>Avg Rating</h3>
            <p className="stat-value" style={{ color: "#f57f17" }}>
              {ratingStats.averageRating ? ratingStats.averageRating.toFixed(1) : "N/A"}
              <span style={{ fontSize: "0.9rem", color: "#7f8c8d", marginLeft: "5px" }}>({ratingStats.reviewCount} reviews)</span>
            </p>
          </div>
        </div>
      </section>

      {/* Orders Section */}
      <section className="provider-orders">
        <h2>📋 Service Orders</h2>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders yet. Check back soon!</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className={`order-card order-${order.status.toLowerCase()}`}>
                <div className="order-header">
                  <div className="order-title">
                    <h3>{order.service}</h3>
                    <p className="customer-name">👤 {order.customer}</p>
                    {order.isFromAdmin && (
                      <p style={{ fontSize: "0.8rem", color: "#00897b", fontWeight: "600", margin: "0.3rem 0 0 0" }}>
                        📩 Admin Assigned • {order.assignedAt}
                      </p>
                    )}
                  </div>
                  <span className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-details">
                  <div className="detail-item">
                    <span className="label">📅 Date:</span>
                    <span className="value">{order.date}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">💰 Amount:</span>
                    <span className="value" style={{ fontWeight: "700", color: "#00897b" }}>
                      {order.acceptedAmount ? `₹${order.acceptedAmount}` : order.amount}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">📞 Contact:</span>
                    <span className="value">{order.phone}</span>
                  </div>
                </div>

                {order.isFromAdmin && order.description && (
                  <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: "8px", marginBottom: "1rem" }}>
                    <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600", fontSize: "0.9rem", color: "#263238" }}>📝 Service Details:</p>
                    <p style={{ margin: "0", fontSize: "0.9rem", color: "#546e7a", lineHeight: "1.5" }}>{order.description}</p>
                  </div>
                )}

                {order.isFromAdmin && order.address && (
                  <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: "8px", marginBottom: "1rem" }}>
                    <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600", fontSize: "0.9rem", color: "#263238" }}>📍 Service Address:</p>
                    <p style={{ margin: "0", fontSize: "0.9rem", color: "#546e7a", lineHeight: "1.5" }}>{order.address}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {(order.status === "Pending" || order.status === "Assigned") && (
                  <div className="order-actions">
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "600" }}>Final Amount (₹) *</label>
                      <input
                        type="number"
                        placeholder="Enter final amount"
                        value={acceptAmounts[order.id] || ""}
                        onChange={(e) => setAcceptAmounts({ ...acceptAmounts, [order.id]: e.target.value })}
                        style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #e0e0e0", fontSize: "1rem" }}
                      />
                    </div>
                    <button
                      className="btn-accept"
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      ✓ Accept Order
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}

                {order.status === "Accepted" && (
                  <div className="order-actions">
                    <button
                      className="btn-complete"
                      disabled
                    >
                      ✓ Order Accepted
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      ✕ Cancel
                    </button>
                  </div>
                )}

                {order.status === "Completed" && (
                  <div className="order-actions">
                    <button className="btn-completed" disabled>
                      ✓ Completed
                    </button>
                  </div>
                )}

                {order.status === "Cancelled" && (
                  <div className="order-actions">
                    <button className="btn-cancelled" disabled>
                      ✕ Cancelled
                    </button>
                  </div>
                )}

                {order.status === "Rejected" && (
                  <div className="order-actions">
                    <button className="btn-cancelled" style={{ background: "#e53935" }} disabled>
                      ✕ Rejected
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ProviderDashboard;
