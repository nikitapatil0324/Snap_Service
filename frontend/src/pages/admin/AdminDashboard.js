import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";
import { getUserBookings, getProviders, assignProvider, getUsers, createService, deleteService, getServices, getLocations, createLocation, deleteLocation, updateService, updateProvider, getPayments } from "../../api/api";

const AdminDashboard = () => {
  console.log("DEBUG: AdminDashboard Rendered");
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("snapserviceUser"));
  const [activeTab, setActiveTab] = useState("overview");
  const [userBookings, setUserBookings] = useState([]);
  const [providersList, setProvidersList] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  // Individual states for form fields to ensure maximum reactivity and stability
  const [srvName, setSrvName] = useState("");
  const [srvDescription, setSrvDescription] = useState("");
  const [srvAreas, setSrvAreas] = useState([]);

  const [editingService, setEditingService] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedAreaFromDropdown, setSelectedAreaFromDropdown] = useState("");
  const [customAreaInput, setCustomAreaInput] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewType, setViewType] = useState(null); // 'user', 'provider', 'booking', 'payment'

  useEffect(() => {
    async function load() {
      try {
        const bookings = await getUserBookings();
        setUserBookings(Array.isArray(bookings) ? bookings : []);
      } catch (err) {
        console.error("Failed to load user bookings", err);
      }

      try {
        const prov = await getProviders();
        setProvidersList(Array.isArray(prov) ? prov : []);
      } catch (err) {
        console.error("Failed to load providers", err);
      }

      try {
        const servicesData = await getServices();
        console.log("DEBUG: Services loaded:", servicesData);
        setServices(Array.isArray(servicesData) ? servicesData : []);
      } catch (err) {
        console.error("Failed to load services:", err);
        const localServices = JSON.parse(localStorage.getItem("snapserviceServices")) || [];
        setServices(localServices);
      }

      try {
        const locs = await getLocations();
        setLocations(Array.isArray(locs) ? locs : []);
      } catch (err) {
        console.error("Failed to load locations", err);
      }

      try {
        const usersList = await getUsers();
        setUsers(Array.isArray(usersList) ? usersList : []);
      } catch (err) {
        console.error("Failed to load users", err);
      }

      try {
        const payHistory = await getPayments();
        console.log("DEBUG: Payment History Fetched:", payHistory);
        setPaymentHistory(Array.isArray(payHistory) ? payHistory : []);
      } catch (err) {
        console.error("Failed to load payments", err);
      }

    }
    load();
  }, []);

  if (!admin || admin.role !== "ADMIN") {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("snapserviceUser");
    navigate("/login");
  };

  // Handlers for individual fields
  const handleNameChange = (e) => {
    console.log("DEBUG: srvName changed to:", e.target.value);
    setSrvName(e.target.value);
  };
  const handleDescChange = (e) => {
    console.log("DEBUG: srvDescription changed to:", e.target.value);
    setSrvDescription(e.target.value);
  };

  const addAreaToService = (areaName) => {
    if (!areaName) return;

    // Ensure areas is an array defensively
    const currentAreas = Array.isArray(srvAreas) ? srvAreas : [];

    // Avoid duplicates
    if (currentAreas.some(a => (a.area || a.city || a) === areaName)) {
      setSelectedAreaFromDropdown("");
      return;
    }

    setSrvAreas([...currentAreas, { area: areaName }]);
    setSelectedAreaFromDropdown("");
  };

  const removeAreaFromService = (index) => {
    setSrvAreas(prev => Array.isArray(prev) ? prev.filter((_, i) => i !== index) : []);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();

    if (!srvName || !srvDescription) {
      alert("Please fill in all fields (Name and Description)");
      return;
    }

    const adminId = admin?.id || admin?.admin_id || admin?.adminId || admin?.userId;
    if (!adminId || adminId === "undefined") {
      alert("Error: Admin ID not found. Please logout and login again.");
      return;
    }

    try {
      const payload = {
        serviceName: srvName,
        description: srvDescription,
        admin_id: adminId,
        areas: srvAreas
      };

      if (editingService) {
        const serviceId = editingService.serviceId || editingService.id;
        const updated = await updateService(serviceId, payload);
        alert("✨ Service updated successfully!");
        setServices(services.map(s => (s.serviceId || s.id) === serviceId ? updated : s));
        setEditingService(null);
      } else {
        const newService = await createService(payload);
        setServices(prev => [newService, ...prev]);
        alert("✨ Service created successfully!");
      }

      // Reset form
      setSrvName("");
      setSrvDescription("");
      setSrvAreas([]);
    } catch (err) {
      console.error("Service operation failed:", err);
      const msg = err?.response?.data?.message || err?.message || "Operation failed";
      alert(`Error: ${msg} (ID: ${adminId})`);
    }
  };

  const handleEditService = (service) => {
    console.log("DEBUG: Editing service:", service);
    setEditingService(service);

    let areas = service.areas || [];
    if (typeof areas === 'string') {
      areas = areas.split(',').map(a => ({ area: a.trim() }));
    } else if (Array.isArray(areas)) {
      areas = areas.map(a => typeof a === 'string' ? { area: a } : a);
    }

    setSrvName(service.serviceName || "");
    setSrvDescription(service.description || "");
    setSrvAreas(areas);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setSrvName("");
    setSrvDescription("");
    setSrvAreas([]);
  };

  const handleProviderStatusUpdate = async (provider, status) => {
    try {
      const pid = provider.providerId || provider.id;
      const updatedProvider = { ...provider, verificationStatus: status };
      await updateProvider(pid, updatedProvider);

      setProvidersList(prev => prev.map(p => (p.providerId || p.id) === pid ? { ...p, verificationStatus: status } : p));
      alert(`Provider status updated to ${status} successfully!`);
    } catch (err) {
      console.error("Failed to update provider status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const bookings = [
    { id: 1, service: "Electrical Work", user: "Rajesh Kumar", provider: "John's Electrical", amount: "₹500", date: "2025-12-20", status: "Completed" },
    { id: 2, service: "Plumbing Repair", user: "Priya Singh", provider: "Plumbing Pro", amount: "₹400", date: "2025-12-19", status: "Completed" },
    { id: 3, service: "AC Service", user: "Amit Patel", provider: "John's Electrical", amount: "₹1200", date: "2025-12-18", status: "In Progress" },
  ];

  const calculateBookingAmount = (b) => {
    if (b.providerAcceptedAmount && b.providerAcceptedAmount > 0) return "₹" + b.providerAcceptedAmount;
    if (b.amount && b.amount !== "₹---" && b.amount !== "0") return "₹" + String(b.amount).replace(/[₹,]/g, "");
    if (b.servicePrice) return "₹" + b.servicePrice;
    // Fallback deeper
    return "₹" + (b.price || "0");
  };

  // Use loaded providers from backend
  const providers = providersList.length ? providersList : [];

  // Use loaded payments from backend
  const payments = paymentHistory.length ? paymentHistory.map(p => ({
    id: p.paymentId || p.id,
    from: p.customerName || p.booking?.customerName || "Customer",
    to: p.providerName || p.booking?.providerName || "Provider",
    amount: "₹" + (p.amount || 0),
    date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : p.date || "N/A",
    method: p.paymentMethod || "Online",
    status: p.paymentStatus || "Success",
    transactionId: p.transactionId
  })) : [];

  const handleViewDetails = (item, type) => {
    setSelectedItem(item);
    setViewType(type);
  };

  const closeDetailsModal = () => {
    setSelectedItem(null);
    setViewType(null);
  };

  const renderDetailsModal = () => {
    if (!selectedItem || !viewType) return null;

    let content = null;
    let title = "";

    switch (viewType) {
      case "user":
        title = "User Details";
        content = (
          <div className="detail-grid">
            <div className="detail-row"><strong>Name:</strong> <span>{selectedItem.name}</span></div>
            <div className="detail-row"><strong>Email:</strong> <span>{selectedItem.email}</span></div>
            <div className="detail-row"><strong>Phone:</strong> <span>{selectedItem.phone}</span></div>
            <div className="detail-row"><strong>User ID:</strong> <span>{selectedItem.userId || selectedItem.id}</span></div>
            <div className="detail-row"><strong>Joined:</strong> <span>{selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : selectedItem.joinDate || 'N/A'}</span></div>
            <div className="detail-row"><strong>Role:</strong> <span>{selectedItem.role || "USER"}</span></div>
          </div>
        );
        break;
      case "provider":
        title = "Provider Details";
        content = (
          <div className="detail-grid">
            <div className="detail-row"><strong>Business Name:</strong> <span>{selectedItem.name}</span></div>
            <div className="detail-row"><strong>Email:</strong> <span>{selectedItem.email}</span></div>
            <div className="detail-row"><strong>Phone:</strong> <span>{selectedItem.phone}</span></div>
            <div className="detail-row"><strong>Service Type:</strong> <span>{selectedItem.serviceName || selectedItem.service || 'N/A'}</span></div>
            <div className="detail-row"><strong>Rating:</strong> <span>{selectedItem.rating ? selectedItem.rating.toFixed(1) + ' ⭐' : 'Not Rated'}</span></div>
            <div className="detail-row"><strong>Verification:</strong> <span className={`status-badge ${(selectedItem.verificationStatus || "").toLowerCase()}`}>{selectedItem.verificationStatus || "Pending"}</span></div>
            <div className="detail-row"><strong>City/Area:</strong> <span>{selectedItem.city || selectedItem.area || 'N/A'}</span></div>
            <div className="detail-row"><strong>Provider ID:</strong> <span>{selectedItem.providerId || selectedItem.id}</span></div>
          </div>
        );
        break;
      case "booking":
        title = "Booking Details";
        content = (
          <div className="detail-grid">
            <div className="detail-row"><strong>Service:</strong> <span>{selectedItem.serviceName || selectedItem.service}</span></div>
            <div className="detail-row"><strong>Status:</strong> <span className={`status-badge ${(selectedItem.status || "Pending").toLowerCase()}`}>{selectedItem.status}</span></div>
            <div className="detail-row"><strong>Amount:</strong> <span style={{ color: "#00897b", fontWeight: "bold" }}>{calculateBookingAmount(selectedItem)}</span></div>
            <div className="detail-row"><strong>Customer:</strong> <span>{selectedItem.customerName || selectedItem.customer}</span></div>
            <div className="detail-row"><strong>Provider:</strong> <span>{selectedItem.providerName || selectedItem.provider || "Not Assigned"}</span></div>
            <div className="detail-row"><strong>Date:</strong> <span>{selectedItem.preferredDate || selectedItem.date}</span></div>
            <div className="detail-row"><strong>Address:</strong> <span>{selectedItem.address}</span></div>
            <div className="detail-row"><strong>Description:</strong> <span>{selectedItem.description}</span></div>
            <div className="detail-row"><strong>Booking ID:</strong> <span>{selectedItem.bookingId || selectedItem.id}</span></div>
          </div>
        );
        break;
      case "payment":
        title = "Payment Details";
        content = (
          <div className="detail-grid">
            <div className="detail-row"><strong>From:</strong> <span>{selectedItem.from}</span></div>
            <div className="detail-row"><strong>To Provider:</strong> <span>{selectedItem.to}</span></div>
            <div className="detail-row"><strong>Amount:</strong> <span style={{ color: "#00897b", fontWeight: "bold" }}>{selectedItem.amount}</span></div>
            <div className="detail-row"><strong>Date:</strong> <span>{selectedItem.date}</span></div>
            <div className="detail-row"><strong>Method:</strong> <span>{selectedItem.method}</span></div>
            <div className="detail-row"><strong>Status:</strong> <span className={`status-badge ${selectedItem.status === "Success" ? "success" : "pending"}`}>{selectedItem.status}</span></div>
            <div className="detail-row"><strong>Transaction ID:</strong> <span>{selectedItem.transactionId || ("TXN-" + selectedItem.id) || "N/A"}</span></div>
          </div>
        );
        break;
      default:
        content = <p>No details available.</p>;
    }

    return (
      <div className="modal-overlay" onClick={closeDetailsModal}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: "500px" }}>
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="modal-close" onClick={closeDetailsModal}>✕</button>
          </div>
          {content}
          <div className="modal-footer" style={{ marginTop: "20px", textAlign: "right" }}>
            <button className="btn-cancel-form" onClick={closeDetailsModal}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="dashboard admin-dashboard">
      {renderDetailsModal()}
      {/* Header Section */}
      <section className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>Admin Panel - <span>{admin.name}</span></h1>
          <p className="dashboard-subtitle">Manage users, providers, bookings and payments</p>
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

      {/* Overview Stats */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">{users.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-info">
            <h3>Service Providers</h3>
            <p className="stat-value">{providers.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>Total Bookings</h3>
            <p className="stat-value">{userBookings.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-value">₹{userBookings.reduce((sum, b) => {
              const val = (b.amount || "0").toString().replace(/[₹,]/g, "");
              return sum + (parseInt(val) || 0);
            }, 0)}</p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="admin-actions">
          <button
            className={`admin-action-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Manage Users
          </button>
          <button
            className={`admin-action-btn ${activeTab === "providers" ? "active" : ""}`}
            onClick={() => setActiveTab("providers")}
          >
            🔧 Manage Providers
          </button>
          <button
            className={`admin-action-btn ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            📋 All Bookings
          </button>
          <button
            className={`admin-action-btn ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            💳 Payment History
          </button>
          <button
            className={`admin-action-btn ${activeTab === "user-bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("user-bookings")}
          >
            📝 Service Requests
          </button>
          <button
            className={`admin-action-btn ${activeTab === "service-details" ? "active" : ""}`}
            onClick={() => setActiveTab("service-details")}
          >
            🔍 Service Details
          </button>
          <button
            className={`admin-action-btn ${activeTab === "services" ? "active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            🛠 Services
          </button>
        </div>
      </section>

      {/* Tab Content */}
      {activeTab === "users" && (
        <section className="admin-section">
          <h2>All Users</h2>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.userId || user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : user.joinDate || 'N/A'}</td>
                    <td><span className="status-badge active">Active</span></td>
                    <td><button className="action-btn" onClick={() => handleViewDetails(user, 'user')}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "providers" && (
        <section className="admin-section">
          <h2>Service Providers</h2>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Email</th>
                  <th>Service Type</th>
                  <th>Rating</th>
                  <th>Verified</th>
                  <th>Join Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {providers.map(provider => (
                  <tr key={provider.providerId || provider.id}>
                    <td>{provider.name}</td>
                    <td>{provider.email}</td>
                    <td>{provider.serviceName || provider.service || 'N/A'}</td>
                    <td>{provider.rating ? provider.rating.toFixed(1) + ' ⭐' : 'New'}</td>
                    <td>
                      <span className={`status-badge ${(provider.verificationStatus || "").toLowerCase()}`}>
                        {provider.verificationStatus === 'APPROVED' ? "✓ Verified" :
                          provider.verificationStatus === 'REJECTED' ? "✗ Rejected" :
                            provider.verificationStatus || "Pending"}
                      </span>
                    </td>
                    <td>{provider.createdAt ? new Date(provider.createdAt).toLocaleDateString() : provider.joinDate || 'N/A'}</td>
                    <td>
                      {provider.verificationStatus === 'PENDING' || !provider.verificationStatus ? (
                        <div className="action-buttons-group">
                          <button
                            className="action-btn approve"
                            onClick={() => handleProviderStatusUpdate(provider, 'APPROVED')}
                            style={{ background: "#4caf50", color: "#fff", marginRight: "5px" }}
                          >
                            Approve
                          </button>
                          <button
                            className="action-btn reject"
                            onClick={() => handleProviderStatusUpdate(provider, 'REJECTED')}
                            style={{ background: "#f44336", color: "#fff" }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button className="action-btn" onClick={() => handleViewDetails(provider, 'provider')}>Details</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "bookings" && (
        <section className="admin-section">
          <h2>All Bookings</h2>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Provider</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userBookings.map(booking => (
                  <tr key={booking.bookingId || booking.id}>
                    <td>{booking.serviceName || booking.service}</td>
                    <td>{booking.customerName || booking.customer}</td>
                    <td>
                      {booking.status === "Accepted" || booking.status === "Completed" ? (
                        <span>{booking.providerName || booking.provider} (ID: {booking.bookingProviderId || booking.providerId})</span>
                      ) : booking.status === "Assigned" ? (
                        <span style={{ color: "#ffa000" }}>⏳ Awaiting {booking.providerName || booking.provider}</span>
                      ) : (
                        <span style={{ color: "#90a4ae" }}>Not Assigned</span>
                      )}
                    </td>
                    <td><span style={{ color: "#00897b", fontWeight: "600" }}>{calculateBookingAmount(booking)}</span></td>
                    <td>{booking.preferredDate}</td>
                    <td>
                      <span className={`status-badge ${(booking.status || "Pending").toLowerCase()}`}>
                        {booking.status || "Pending"}
                      </span>
                    </td>
                    <td><button className="action-btn" onClick={() => handleViewDetails(booking, 'booking')}>Details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "payments" && (
        <section className="admin-section">
          <h2>Payment History</h2>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.from}</td>
                    <td>{payment.to}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.date}</td>
                    <td>{payment.method}</td>
                    <td>
                      <span className={`status-badge ${payment.status === "Success" ? "success" : "pending"}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td><button className="action-btn" onClick={() => handleViewDetails(payment, 'payment')}>Details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "user-bookings" && (
        <section className="admin-section">
          <h2>📋 User Service Requests</h2>
          {userBookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", background: "#f9fafb", borderRadius: "12px" }}>
              <p style={{ color: "#90a4ae" }}>No service requests yet</p>
            </div>
          ) : (
            <div className="bookings-request-list">
              {userBookings.map(booking => (
                <div key={booking.bookingId || booking.id} className="booking-request-card">
                  <div className="booking-request-header">
                    <h3>{booking.serviceName || booking.service}</h3>
                    <span className={`status-badge ${(booking.status || "Pending").toLowerCase()}`}>{booking.status || "Pending"}</span>
                  </div>
                  <div className="booking-request-info">
                    <p><strong>Customer:</strong> {booking.customerName || booking.customer}</p>
                    <p><strong>Email:</strong> {booking.customerEmail}</p>
                    <p><strong>Phone:</strong> {booking.phone}</p>
                    <p><strong>Address:</strong> {booking.address}</p>
                    <p><strong>City:</strong> <span style={{ color: "#00897b", fontWeight: "600" }}>{booking.city || "Not Specified"}</span></p>
                    <p><strong>Preferred Date:</strong> {booking.preferredDate}</p>
                    <p><strong>Description:</strong> {booking.description}</p>
                  </div>
                  {(booking.status === "Pending" || !booking.status || booking.status === "Rejected") && (
                    <div className="booking-assign-section">
                      <label>Assign Provider:</label>
                      <select
                        onChange={async (e) => {
                          const pid = parseInt(e.target.value);
                          const selectedProvider = providers.find(p => (p.providerId || p.id) === pid);
                          if (selectedProvider) {
                            try {
                              await assignProvider(booking.bookingId || booking.id, pid);
                              const updatedBooking = { ...booking, provider: selectedProvider.name, providerId: pid, status: "Assigned", assignedAt: new Date().toLocaleString() };
                              const updatedBookings = userBookings.map(b => (b.bookingId || b.id) === (booking.bookingId || booking.id) ? updatedBooking : b);
                              setUserBookings(updatedBookings);
                              alert(`✓ Request sent to ${selectedProvider.name}`);
                            } catch (err) {
                              console.error(err);
                              alert("Failed to assign provider. Try again.");
                            }
                          }
                        }}
                      >
                        <option value="">Select a provider</option>
                        <optgroup label="Local Providers (Same City)">
                          {providers
                            .filter(p => p.verificationStatus === 'APPROVED' && (p.city || "").toLowerCase() === (booking.city || "").toLowerCase())
                            .map(provider => (
                              <option key={provider.providerId || provider.id} value={provider.providerId || provider.id}>
                                {provider.name} ({provider.city}) - {provider.rating ? provider.rating.toFixed(1) + ' ⭐' : 'New'}
                              </option>
                            ))
                          }
                        </optgroup>
                        <optgroup label="Other Providers">
                          {providers
                            .filter(p => p.verificationStatus === 'APPROVED' && (p.city || "").toLowerCase() !== (booking.city || "").toLowerCase())
                            .map(provider => (
                              <option key={provider.providerId || provider.id} value={provider.providerId || provider.id}>
                                {provider.name} ({provider.city || 'N/A'}) - {provider.rating ? provider.rating.toFixed(1) + ' ⭐' : 'New'}
                              </option>
                            ))
                          }
                        </optgroup>
                      </select>
                    </div>
                  )}
                  {booking.status === "Assigned" && (
                    <div style={{ padding: "1rem", background: "#fff9c4", borderRadius: "8px", marginTop: "1rem", border: "1px solid #fbc02d" }}>
                      <p style={{ margin: 0, color: "#f57f17", fontWeight: "600" }}>⏳ Awaiting Acceptance: {booking.providerName || booking.provider}</p>
                    </div>
                  )}
                  {booking.status === "Accepted" && (
                    <div style={{ padding: "1rem", background: "#c8e6c9", borderRadius: "8px", marginTop: "1rem", border: "1px solid #4caf50" }}>
                      <p style={{ margin: 0, color: "#2e7d32", fontWeight: "600" }}>✓ Accepted by: {booking.providerName || booking.provider}</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#388e3c" }}>Provider ID: {booking.bookingProviderId || booking.providerId}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "service-details" && (
        <section className="admin-section">
          <h2>🔍 Service Details & Assignments</h2>
          {userBookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", background: "#f9fafb", borderRadius: "12px" }}>
              <p style={{ color: "#90a4ae" }}>No service bookings yet</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Customer</th>
                    <th>Description</th>
                    <th>Preferred Date</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>Assigned Provider</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userBookings.map(booking => (
                    <tr key={booking.bookingId || booking.id}>
                      <td><strong>{booking.serviceName || booking.service}</strong></td>
                      <td>
                        <div>
                          <p style={{ margin: "0 0 4px 0", fontWeight: "500" }}>{booking.customerName || booking.customer}</p>
                          <p style={{ margin: "0", fontSize: "0.85rem", color: "#90a4ae" }}>{booking.phone}</p>
                        </div>
                      </td>
                      <td>
                        <span title={booking.description} style={{ maxWidth: "200px", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {booking.description}
                        </span>
                      </td>
                      <td>{booking.preferredDate}</td>
                      <td>
                        <span title={booking.address} style={{ maxWidth: "150px", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {booking.address}
                        </span>
                      </td>
                      <td><span style={{ fontWeight: "600", color: "#00897b" }}>{booking.city || "N/A"}</span></td>
                      <td>
                        {booking.status === "Accepted" || booking.status === "Completed" ? (
                          <div>
                            <p style={{ fontWeight: "600", color: "#00897b", margin: 0 }}>{booking.providerName || booking.provider}</p>
                            <p style={{ fontSize: "0.8rem", color: "#78909c", margin: 0 }}>ID: {booking.bookingProviderId || booking.providerId}</p>
                          </div>
                        ) : booking.status === "Assigned" ? (
                          <div>
                            <p style={{ fontWeight: "600", color: "#ffa000", margin: 0 }}>{booking.providerName || booking.provider}</p>
                            <p style={{ fontSize: "0.8rem", color: "#78909c", margin: 0 }}>⏳ Awaiting Acceptance</p>
                          </div>
                        ) : (
                          <select
                            onChange={async (e) => {
                              const pid = parseInt(e.target.value);
                              const selectedProvider = providers.find(p => (p.providerId || p.id) === pid);
                              if (selectedProvider) {
                                try {
                                  await assignProvider(booking.bookingId || booking.id, pid);
                                  const updatedBooking = {
                                    ...booking,
                                    provider: selectedProvider.name,
                                    providerName: selectedProvider.name,
                                    providerId: pid,
                                    bookingProviderId: pid,
                                    status: "Assigned",
                                    assignedAt: new Date().toLocaleString()
                                  };
                                  const updatedBookings = userBookings.map(b => (b.bookingId || b.id) === (booking.bookingId || booking.id) ? updatedBooking : b);
                                  setUserBookings(updatedBookings);
                                  alert(`✓ Booking assigned to ${selectedProvider.name}. Awaiting their acceptance.`);
                                } catch (err) {
                                  console.error("Assign failed:", err);
                                  alert("Failed to assign provider.");
                                }
                              }
                            }}
                            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #e0e0e0" }}
                          >
                            <option value="">Assign Provider</option>
                            <optgroup label="Recommended (Same City)">
                              {providers
                                .filter(p => p.verificationStatus === 'APPROVED' && (p.city || "").toLowerCase() === (booking.city || "").toLowerCase())
                                .map(provider => (
                                  <option key={provider.providerId || provider.id} value={provider.providerId || provider.id}>
                                    {provider.name} ({provider.city}) - {provider.rating ? provider.rating.toFixed(1) + ' ⭐' : 'New'}
                                  </option>
                                ))
                              }
                            </optgroup>
                            <optgroup label="All Others">
                              {providers
                                .filter(p => p.verificationStatus === 'APPROVED' && (p.city || "").toLowerCase() !== (booking.city || "").toLowerCase())
                                .map(provider => (
                                  <option key={provider.providerId || provider.id} value={provider.providerId || provider.id}>
                                    {provider.name} ({provider.city || 'N/A'}) - {provider.rating ? provider.rating.toFixed(1) + ' ⭐' : 'New'}
                                  </option>
                                ))
                              }
                            </optgroup>
                          </select>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${(booking.status || "Pending").toLowerCase()}`}>
                          {booking.status || "Pending"}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn" onClick={() => handleViewDetails(booking, 'booking')}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
          }
        </section>
      )}

      {activeTab === "services" && (
        <section className="admin-section">
          <h2>Create New Service</h2>
          <div className="service-form-container" style={{ position: "relative", zIndex: 10 }}>
            <form onSubmit={handleServiceSubmit} className="service-form">
              <div className="form-group" onClick={() => console.log("DEBUG: Form group clicked")}>
                <label htmlFor="serviceName">Service Name *</label>
                <input
                  type="text"
                  id="serviceName"
                  name="serviceName"
                  placeholder="Enter service name (e.g., Plumbing, Electrical, Carpentry)"
                  value={srvName}
                  onChange={handleNameChange}
                  autoComplete="off"
                  required
                  style={{ pointerEvents: "auto", cursor: "text" }}
                />
              </div>


              <div className="form-group">
                <label>Service Areas *</label>
                <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "10px" }}>
                  Select existing areas or add new ones to your coverage.
                </p>

                {/* Selected Areas Chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                  {Array.isArray(srvAreas) && srvAreas.map((a, idx) => (
                    <span key={idx} className="area-chip selected" style={{ cursor: "default" }}>
                      {a.area || a.city || a}
                      <button
                        type="button"
                        onClick={() => removeAreaFromService(idx)}
                        style={{ background: "none", border: "none", color: "white", marginLeft: "8px", cursor: "pointer", fontSize: "12px", padding: "0 2px" }}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  {(!Array.isArray(srvAreas) || srvAreas.length === 0) && (
                    <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>No areas added yet</span>
                  )}
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  {/* Dropdown of existing locations */}
                  <div style={{ flex: 1 }}>
                    <select
                      value={selectedAreaFromDropdown}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedAreaFromDropdown(val);
                        if (val) addAreaToService(val);
                      }}
                      style={{ height: "45px" }}
                    >
                      <option value="">Choose Existing Area</option>
                      {locations.map((loc, idx) => (
                        <option key={idx} value={loc.area || loc.city}>
                          {loc.area || loc.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <span style={{ color: "#94a3b8" }}>OR</span>

                  {/* Custom Input */}
                  <div style={{ flex: 1, display: "flex", gap: "5px" }}>
                    <input
                      type="text"
                      placeholder="Add New Area..."
                      value={customAreaInput || ""}
                      onChange={(e) => {
                        console.log("DEBUG: Area input change:", e.target.value);
                        setCustomAreaInput(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addAreaToService(customAreaInput);
                          setCustomAreaInput("");
                        }
                      }}
                      autoComplete="off"
                      style={{ height: "45px" }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addAreaToService(customAreaInput);
                        setCustomAreaInput("");
                      }}
                      className="action-btn"
                      style={{ height: "45px", width: "45px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      ➕
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group" onClick={() => console.log("DEBUG: Form group clicked")}>
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter service description (e.g., Professional plumbing services for residential and commercial)"
                  value={srvDescription}
                  onChange={handleDescChange}
                  rows="5"
                  autoComplete="off"
                  required
                  style={{ pointerEvents: "auto", cursor: "text" }}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" style={{ flex: 2 }}>
                  {editingService ? "💾 Update Service" : "➕ Create Service"}
                </button>
                {editingService && (
                  <button type="button" className="btn-cancel-form" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <h2 style={{ marginTop: "3rem" }}>All Services</h2>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Service ID</th>
                  <th>Service Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Areas</th>
                  <th>Created By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {services.length > 0 ? (
                  services.map(service => (
                    <tr key={service.serviceId || service.id}>
                      <td>#{service.serviceId || service.id}</td>
                      <td><strong>{service.serviceName}</strong></td>
                      <td>{service.description}</td>
                      <td><span style={{ color: "#00897b", fontWeight: "600" }}>{service.price || "₹399"}</span></td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {service.areas && service.areas.length > 0 ? (
                            service.areas.map((a, i) => (
                              <span key={i} style={{ fontSize: "0.75rem", padding: "2px 6px", background: "#f1f5f9", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                                {a.area || a.city || a}
                              </span>
                            ))
                          ) : (
                            <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>All Areas</span>
                          )}
                        </div>
                      </td>
                      <td>{service.admin_id ? `Admin #${service.admin_id}` : "System"}</td>
                      <td>
                        <button className="action-btn" style={{ marginRight: "5px" }} onClick={() => handleEditService(service)}>Edit</button>
                        <button className="action-btn" style={{ backgroundColor: "#ef5350" }} onClick={() => {
                          if (window.confirm("Delete this service?")) {
                            deleteService(service.serviceId || service.id).then(() => {
                              setServices(prev => prev.filter(s => (s.serviceId || s.id) !== (service.serviceId || service.id)));
                            });
                          }
                        }}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                      No services created yet. Create your first service above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
};

export default AdminDashboard;
