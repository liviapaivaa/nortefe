import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { supabase } from "../supabaseClient";

const EstablishmentContext = createContext();

function mapFromDb(row) {
  if (!row) return null;
  return {
    ...row,
    ownerId: row.owner_id,
    categoryId: row.category_id,
    contact: row.contact || row.phone || "",
    openingHours: row.opening_hours || "",
    serviceRegion: row.service_region || "",
    image: row.image_url || "",
    imageUrl: row.image_url || "",
    bannerUrl: row.banner_url || "",
    deliveryFee: row.delivery_fee ?? 0,
    deliveryTime: row.delivery_time || "",
    isOpen: row.is_open ?? true,
    active: row.active ?? false,
    createdAt: row.created_at
  };
}

export function EstablishmentProvider({ children }) {
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchEstablishments() {
    const { data, error } = await supabase
      .from("establishments")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEstablishments(data.map(mapFromDb));
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEstablishments();
  }, []);

  async function createEstablishment(data) {
    const payload = {
      owner_id: data.ownerId || data.owner_id || null,
      category_id: data.categoryId || data.category_id || null,
      name: data.name,
      category: data.category || "",
      description: data.description || "",
      contact: data.contact || data.phone || "",
      phone: data.contact || data.phone || "",
      address: data.address || "",
      opening_hours: data.openingHours || "",
      service_region: data.serviceRegion || "",
      image_url: data.image || data.imageUrl || data.image_url || "",
      banner_url: data.bannerUrl || data.banner_url || "",
      delivery_fee: data.deliveryFee ?? data.delivery_fee ?? 0,
      delivery_time: data.deliveryTime || data.delivery_time || "",
      is_open: data.isOpen ?? true,
      active: false
    };

    const { data: inserted, error } = await supabase
      .from("establishments")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar estabelecimento:", error);
      return null;
    }

    const mapped = mapFromDb(inserted);
    setEstablishments((current) => [mapped, ...current]);
    return mapped;
  }

  async function updateEstablishment(id, updates) {
    const payload = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.contact !== undefined) {
      payload.contact = updates.contact;
      payload.phone = updates.contact;
    }
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.address !== undefined) payload.address = updates.address;
    if (updates.openingHours !== undefined) payload.opening_hours = updates.openingHours;
    if (updates.serviceRegion !== undefined) payload.service_region = updates.serviceRegion;
    if (updates.active !== undefined) payload.active = updates.active;
    if (updates.isOpen !== undefined) payload.is_open = updates.isOpen;
    if (updates.is_open !== undefined) payload.is_open = updates.is_open;
    if (updates.deliveryFee !== undefined) payload.delivery_fee = updates.deliveryFee;
    if (updates.deliveryTime !== undefined) payload.delivery_time = updates.deliveryTime;
    if (updates.image !== undefined) payload.image_url = updates.image;
    if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;

    const { data: updated, error } = await supabase
      .from("establishments")
      .update(payload)
      .eq("id", String(id))
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar estabelecimento:", error);
      return;
    }

    const mapped = mapFromDb(updated);
    setEstablishments((current) =>
      current.map((est) => (String(est.id) === String(id) ? mapped : est))
    );
  }

  function getEstablishmentByOwner(ownerId) {
    return establishments.find(
      (establishment) => String(establishment.ownerId) === String(ownerId)
    );
  }

  function getEstablishmentById(id) {
    return establishments.find(
      (establishment) => String(establishment.id) === String(id)
    );
  }

  return (
    <EstablishmentContext.Provider
      value={{
        establishments,
        loading,
        fetchEstablishments,
        createEstablishment,
        updateEstablishment,
        getEstablishmentByOwner,
        getEstablishmentById
      }}
    >
      {children}
    </EstablishmentContext.Provider>
  );
}

export function useEstablishments() {
  return useContext(EstablishmentContext);
}