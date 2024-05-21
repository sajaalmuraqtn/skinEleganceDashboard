import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext(null);

export function CartContextProvider({ children }) {
  let [count, setCount] = useState(0);
  const [cart, setCart] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [statusError, setStatusError] = useState('');

  const getCart = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(`/cart`, { headers: { authorization:`Saja__${token}`} });
      const responseData = response.data;

      if (responseData.cart.products.length>0) {
        setCart(responseData.cart);
        console.log(cart);
        setIsEmpty(false);
      } else {
        setIsEmpty(true);
      }
      
    } catch (error) {
      setStatusError(error.response?.data.message || "An error occurred while fetching cart list.");
      setIsEmpty(true);
      setCart(null);
      console.log(statusError);
    }
  };

  return <CartContext.Provider value={{ getCart, count, setCount, cart, isEmpty }}>
    {children}
  </CartContext.Provider>
}