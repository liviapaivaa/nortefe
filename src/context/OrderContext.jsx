import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { supabase } from "../supabaseClient";

const OrderContext = createContext();

function mapOrderFromDb(row) {
  if (!row) return null;
  return {
    ...row,
    number: row.order_number || 1001,
    userId: row.user_id,
    consumerId: row.user_id,
    storeId: row.establishment_id,
    establishmentId: row.establishment_id,
    addressId: row.address_id,
    deliveryFee: row.delivery_fee ?? 0,
    paymentMethod: row.payment_method || "",
    customerName: row.customer_name || "",
    consumerName: row.customer_name || "",
    storeName: row.store_name || "",
    address: row.delivery_address || null,
    deliveryAddress: row.delivery_address || null,
    observation: row.notes || "",
    estimatedPrepTime: row.estimated_prep_time || null,
    deliveryPersonId: row.delivery_person_id || null,
    items: Array.isArray(row.items) ? row.items : [],
    createdAt: row.created_at
  };
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data.map(mapOrderFromDb));
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function createOrder(orderData) {
    const nextNumber = orders.length + 1001;

    const payload = {
      order_number: nextNumber,
      user_id: orderData.userId || orderData.consumerId || orderData.user_id || null,
      establishment_id: orderData.storeId || orderData.establishmentId || orderData.establishment_id || null,
      address_id:
        orderData.addressId && orderData.addressId !== "default-1"
          ? orderData.addressId
          : null,
      subtotal: Number(orderData.subtotal) || Number(orderData.total) || 0,
      delivery_fee: Number(orderData.deliveryFee ?? orderData.delivery_fee) || 0,
      total: Number(orderData.total) || 0,
      status: orderData.status || "confirmed",
      payment_method: orderData.paymentMethod || orderData.payment_method || "",
      customer_name: orderData.customerName || orderData.consumerName || "",
      store_name: orderData.storeName || "",
      delivery_address: orderData.deliveryAddress || orderData.address || null,
      items: orderData.items || [],
      notes: orderData.notes || orderData.observation || ""
    };

    const { data: inserted, error } = await supabase
      .from("orders")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar pedido:", error);
      return null;
    }

    if (Array.isArray(orderData.items) && orderData.items.length > 0) {
      const itemsRows = orderData.items.map((item) => ({
        order_id: inserted.id,
        product_id: typeof item.id === "string" && item.id.includes("-") ? item.id : null,
        product_name: item.name,
        quantity: Number(item.quantity) || 1,
        unit_price: Number(item.price) || 0
      }));

      await supabase.from("order_items").insert(itemsRows);
    }

    const mapped = mapOrderFromDb(inserted);
    setOrders((currentOrders) => [mapped, ...currentOrders]);
    return mapped;
  }

  function getOrderById(id) {
    return orders.find((order) => String(order.id) === String(id));
  }

  async function updateOrderStatus(orderId, newStatus) {
    await updateOrder(orderId, { status: newStatus });
  }

  async function updateOrder(orderId, updates) {
    const payload = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.paymentMethod !== undefined) payload.payment_method = updates.paymentMethod;
    if (updates.deliveryPersonId !== undefined) payload.delivery_person_id = updates.deliveryPersonId;
    if (updates.notes !== undefined) payload.notes = updates.notes;
    if (updates.observation !== undefined) payload.notes = updates.observation;
    if (updates.estimatedPrepTime !== undefined) payload.estimated_prep_time = updates.estimatedPrepTime;

    const { data: updated, error } = await supabase
      .from("orders")
      .update(payload)
      .eq("id", String(orderId))
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar pedido:", error);
      return;
    }

    const mapped = mapOrderFromDb(updated);
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        String(order.id) === String(orderId) ? mapped : order
      )
    );
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        fetchOrders,
        createOrder,
        getOrderById,
        updateOrderStatus,
        updateOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}