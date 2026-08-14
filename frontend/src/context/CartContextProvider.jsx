import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function UseCartState() {
  return useContext(CartContext);
}

export function CartContextProvider({ children }) {
  const [isCartShow, setIsCartShow] = useState(false);

  const cartShowHandler = (value = false) => {
    setIsCartShow(value);
  };

  const contextObj = {
    cartShowHandler,
    isCartShow,
  };

  return (
    <CartContext.Provider value={contextObj}>{children}</CartContext.Provider>
  );
}
