import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ADICIONAR PRODUTO
  function addToCart(product) {
    if (
      cart.length > 0 &&
      cart[0].storeId &&
      product.storeId &&
      cart[0].storeId !== product.storeId
    ) {
      alert(
        "Você só pode comprar de um estabelecimento por pedido. Finalize ou esvazie o carrinho atual para comprar em outra loja.",
      );

      return;
    }

    setCart((currentCart) => {
      const productExists = currentCart.find((item) => item.id === product.id);

      if (productExists) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  // DIMINUIR QUANTIDADE
  function decreaseQuantity(productId) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  // REMOVER PRODUTO
  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    );
  }

  // LIMPAR CARRINHO
  function clearCart() {
    setCart([]);
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
