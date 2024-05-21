import { createContext, useState } from "react";

export const GlobalFunctionContext = createContext(null);

export function GlobalFunctionContextProvider({ children }) {
    const isCreatedThisMonth = (createdAt) => {
        const createdDate = new Date(createdAt);
        const currentDate = new Date();
        return (
            createdDate.getMonth() === currentDate.getMonth() &&
            createdDate.getFullYear() === currentDate.getFullYear()
        );
    };

    function selectRandomColor() {
        // Define the array inside the function
        const texts = ["#FFEDB4", "#DFE4FF", "#FFEACC", "#FFDAE0", "#FFF3DA", "#FFEDB4"];
        // Generate a random index between 0 and 5
        const randomIndex = Math.floor(Math.random() * texts.length);
        // Return the text at the random index
        return texts[randomIndex];
    }

    // Use array destructuring to get the state variable and the function to update it
    const [product, setProduct] = useState(0);

    return (
        <GlobalFunctionContext.Provider value={{ isCreatedThisMonth, selectRandomColor, product, setProduct }}>
            {children}
        </GlobalFunctionContext.Provider>
    );
}
