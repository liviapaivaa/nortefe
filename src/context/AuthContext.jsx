import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca todos os perfis (para a tela Admin.jsx)
  async function fetchUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
  }

  // Busca o perfil completo do usuário logado na tabela profiles
  async function loadUserProfile(authUser) {
    if (!authUser) {
      setUser(null);
      return null;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (!error && profile) {
      setUser(profile);
      return profile;
    }

    const fallbackUser = {
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.name || "",
      role: authUser.user_metadata?.role || "client",
      active: true
    };
    setUser(fallbackUser);
    return fallbackUser;
  }

  useEffect(() => {
    // Verifica sessão ativa ao abrir o site
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await loadUserProfile(session.user);
      }
      await fetchUsers();
      setLoading(false);
    });

    // Escuta mudanças de login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        await fetchUsers();
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function register({ name, email, password, role }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: role || "client"
        }
      }
    });

    if (error) {
      return {
        success: false,
        message:
          error.message === "User already registered"
            ? "Este e-mail já está cadastrado."
            : error.message
      };
    }

    // Garante que o perfil seja salvo/atualizado na tabela profiles
    if (data?.user) {
      const newProfile = {
        id: data.user.id,
        name,
        email,
        role: role || "client",
        active: true
      };

      await supabase.from("profiles").upsert(newProfile);
      setUser(newProfile);
      await fetchUsers();

      return {
        success: true,
        user: newProfile
      };
    }

    return {
      success: false,
      message: "Não foi possível concluir o cadastro."
    };
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return {
        success: false,
        message: "E-mail ou senha incorretos."
      };
    }

    const profile = await loadUserProfile(data.user);

    if (profile && profile.active === false) {
      await supabase.auth.signOut();
      setUser(null);
      return {
        success: false,
        message: "Esta conta foi desativada pelo administrador."
      };
    }

    return {
      success: true,
      user: profile
    };
  }

  async function updateUser(userId, updates) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (!error && data) {
      setUsers((currentUsers) =>
        currentUsers.map((item) => (item.id === userId ? data : item))
      );

      if (user && user.id === userId) {
        setUser(data);
      }
    }
  }

  async function toggleUserStatus(userId) {
    const targetUser = users.find((item) => item.id === userId);
    if (!targetUser) return;

    const newStatus = targetUser.active === false;
    await updateUser(userId, { active: newStatus });
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        register,
        login,
        logout,
        updateUser,
        toggleUserStatus,
        loading,
        isAuthenticated: Boolean(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}