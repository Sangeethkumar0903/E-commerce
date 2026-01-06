import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("orders/my-orders/")
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (itemId) => {
    if (!window.confirm("Cancel this item?")) return;
    try {
      await api.post(`orders/cancel/${itemId}/`);
      const res = await api.get("orders/my-orders/");
      setOrders(res.data);
    } catch {
      alert("Failed to cancel item");
    }
  };

  if (loading) {
    return <div style={styles.center}>Loading...</div>;
  }

  if (orders.length === 0) {
    return (
      <div style={styles.center}>
        <h2>No orders yet</h2>
        <a href="/" style={styles.link}>Start Shopping</a>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>My Orders ({orders.length})</h1>
      
      <div style={styles.orders}>
        {orders.map(order => (
          <div key={order.id} style={styles.order}>
            <div style={styles.orderHeader}>
              <h3>Order #{order.id}</h3>
              <p style={styles.date}>
                {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p style={styles.total}>Total: ₹{order.total_amount}</p>
            </div>

            <div style={styles.items}>
              {order.items.map(item => (
                <div key={item.id} style={styles.item}>
                  <div>
                    <h4>{item.product_title}</h4>
                    <p>₹{item.price} × {item.quantity}</p>
                    <p>Status: {item.status}</p>
                  </div>
                  {item.status === "PLACED" && (
                    <button 
                      onClick={() => handleCancel(item.id)}
                      style={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "800px", margin: "auto" },
  center: { textAlign: "center", padding: "50px" },
  link: { color: "blue", textDecoration: "none" },
  orders: { marginTop: "20px" },
  order: { 
    border: "1px solid #ddd", 
    padding: "15px", 
    marginBottom: "20px",
    borderRadius: "5px"
  },
  orderHeader: { 
    display: "flex", 
    justifyContent: "space-between",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "10px"
  },
  date: { color: "#666" },
  total: { fontWeight: "bold" },
  items: { marginTop: "10px" },
  item: { 
    display: "flex", 
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #f5f5f5"
  },
  cancelBtn: { 
    background: "#ff4444", 
    color: "white", 
    border: "none", 
    padding: "5px 15px",
    cursor: "pointer"
  }
};