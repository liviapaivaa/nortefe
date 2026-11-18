import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AddressContext = createContext();

export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState(() => {
    const savedAddresses =
      localStorage.getItem("nortefe-addresses");

    if (savedAddresses) {
      return JSON.parse(savedAddresses);
    }

    return [
      {
        id: 1,
        name: "Casa",
        street: "Rua Principal",
        number: "120",
        neighborhood: "Centro",
        complement: "",
        reference: "Próximo à Praça Remanso",
        city: "Tefé - AM"
      }
    ];
  });

  const [selectedAddress, setSelectedAddress] =
    useState(() => {
      const savedSelectedAddress =
        localStorage.getItem(
          "nortefe-selected-address"
        );

      return savedSelectedAddress
        ? Number(savedSelectedAddress)
        : 1;
    });

  useEffect(() => {
    localStorage.setItem(
      "nortefe-addresses",
      JSON.stringify(addresses)
    );
  }, [addresses]);

  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem(
        "nortefe-selected-address",
        String(selectedAddress)
      );
    }
  }, [selectedAddress]);

  function addAddress(address) {
    const newAddress = {
      ...address,
      id: Date.now()
    };

    setAddresses((currentAddresses) => [
      ...currentAddresses,
      newAddress
    ]);

    setSelectedAddress(newAddress.id);
  }

  function updateAddress(addressId, updates) {
    setAddresses((currentAddresses) =>
      currentAddresses.map((address) =>
        address.id === addressId
          ? {
              ...address,
              ...updates
            }
          : address
      )
    );
  }

  function getAddressById(addressId) {
    return addresses.find(
      (address) =>
        address.id === addressId
    );
  }

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        updateAddress,
        getAddressById
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  return useContext(AddressContext);
}