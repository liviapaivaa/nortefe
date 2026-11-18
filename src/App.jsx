import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import Store from "./pages/store";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Address from "./pages/Address";
import Payment from "./pages/Payment";
import OrderTracking from "./pages/OrderTracking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Merchant from "./pages/Merchant";
import Delivery from "./pages/Delivery";
import Admin from "./pages/Admin";
import Favorites from "./pages/Favorites";

import { ProductProvider } from "./context/ProductContext";
import { EstablishmentProvider } from "./context/EstablishmentContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import { AddressProvider } from "./context/AddressContext";
import { OrderProvider } from "./context/OrderContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <CartProvider>

          <AddressProvider>

            <OrderProvider>

              <EstablishmentProvider>

                <ProductProvider>

                  <Routes>

                    <Route
                      path="/"
                      element={<Home />}
                    />

                    <Route
                      path="/restaurantes"
                      element={<Restaurants />}
                    />

                    <Route
                      path="/loja/:id"
                      element={<Store />}
                    />

                    <Route
                      path="/carrinho"
                      element={<Cart />}
                    />

                    <Route
                      path="/pedidos"
                      element={<Orders />}
                    />

                    <Route
                      path="/pedido/:id"
                      element={<OrderTracking />}
                    />

                    <Route
                      path="/favoritos"
                      element={<Favorites />}
                    />

                    <Route
                      path="/perfil"
                      element={<Profile />}
                    />

                    <Route
                      path="/endereco"
                      element={<Address />}
                    />

                    <Route
                      path="/pagamento"
                      element={<Payment />}
                    />

                    <Route
                      path="/login"
                      element={<Login />}
                    />

                    <Route
                      path="/cadastro"
                      element={<Register />}
                    />

                    <Route
                      path="/parceiro"
                      element={
                        <ProtectedRoute
                          allowedRoles={["merchant"]}
                        >
                          <Merchant />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/entregador"
                      element={
                        <ProtectedRoute
                          allowedRoles={["delivery"]}
                        >
                          <Delivery />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute
                          allowedRoles={["admin"]}
                        >
                          <Admin />
                        </ProtectedRoute>
                      }
                    />

                  </Routes>

                </ProductProvider>

              </EstablishmentProvider>

            </OrderProvider>

          </AddressProvider>

        </CartProvider>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;