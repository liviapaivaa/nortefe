import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { supabase } from "../supabaseClient";

const ProductContext = createContext();

function mapProductFromDb(row) {
  if (!row) return null;
  return {
    ...row,
    storeId: row.establishment_id,
    establishmentId: row.establishment_id,
    image: row.image_url || "",
    imageUrl: row.image_url || "",
    promotion: row.promotion || "",
    available: row.available ?? true,
    createdAt: row.created_at
  };
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data.map(mapProductFromDb));
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function addProduct(product) {
    const payload = {
      establishment_id: product.storeId || product.establishmentId || product.establishment_id || null,
      name: product.name,
      description: product.description || "",
      category: product.category || "",
      price: Number(product.price) || 0,
      promotion: product.promotion || "",
      image_url: product.image || product.imageUrl || product.image_url || "",
      available: product.available ?? true
    };

    const { data: inserted, error } = await supabase
      .from("products")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Erro ao adicionar produto:", error);
      return null;
    }

    const mapped = mapProductFromDb(inserted);
    setProducts((currentProducts) => [mapped, ...currentProducts]);
    return mapped;
  }

  async function updateProduct(productId, updates) {
    const payload = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.price !== undefined) payload.price = Number(updates.price);
    if (updates.promotion !== undefined) payload.promotion = updates.promotion;
    if (updates.available !== undefined) payload.available = updates.available;
    if (updates.image !== undefined) payload.image_url = updates.image;
    if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;

    const { data: updated, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", String(productId))
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar produto:", error);
      return;
    }

    const mapped = mapProductFromDb(updated);
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        String(product.id) === String(productId) ? mapped : product
      )
    );
  }

  async function removeProduct(productId) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", String(productId));

    if (error) {
      console.error("Erro ao remover produto:", error);
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => String(product.id) !== String(productId)
      )
    );
  }

  async function toggleAvailability(productId) {
    const target = products.find((p) => String(p.id) === String(productId));
    if (!target) return;
    await updateProduct(productId, { available: !target.available });
  }

  function getProductsByStore(storeId) {
    return products.filter(
      (product) => String(product.storeId) === String(storeId)
    );
  }

  function getProductById(productId) {
    return products.find(
      (product) => String(product.id) === String(productId)
    );
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        addProduct,
        updateProduct,
        removeProduct,
        toggleAvailability,
        getProductsByStore,
        getProductById
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}