import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { getApuUrl } from "../../utils/config";

interface Cart {
  id: string;
  name: string;
  items: Product[];
  counters: {
    upper: number;
    lower: number;
    other: number;
  };
  message: string | null;
  messageId: string | null;
}

interface CartOptionsThunkAdd extends CartOptionsAdd {
  token: string;
}

interface CartOptionsAdd {
  product: Product;
  limits: {
    prendas_superiores: number;
    prendas_inferiores: number;
    prendas_otros: number;
  };
  talla?: string;
}

interface CartOptionsRemove {
  productId: number;
  talla?: string;
}

interface CartOptionsThunkRemove extends CartOptionsRemove {
  token: string;
}

interface cartState {
  cart: Cart;
}

const initialState: cartState = {
  cart: {
    id: uuidv4(),
    name: "Carrito",
    items: [],
    counters: {
      upper: 0,
      lower: 0,
      other: 0,
    },
    message: null,
    messageId: null,
  },
};

const handleCartAdd = async (
  product: Product,
  talla: string,
  token: string
) => {
  const url = getApuUrl("/agregarPrenda");

  const raw = JSON.stringify({
    id_prenda: product.id,
    talla,
    cantidad: 1,
  });

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: raw,
  };

  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json();

    if (result.code !== 200) {
      return { code: result.code, token: result.token };
    } else {
      return { code: 200, data: result.data.id_prenda_carrito, token: result.token };
    }
  } catch (error) {
    console.error("Error:", error);
    return { code: 404, token };
  }
};

const handleCartRemove = async (
  product: number,
  id_prenda_carrito: string,
  token: string
) => {
  const url = getApuUrl("/quitarPrenda");

  const raw = JSON.stringify({
    id_prenda: product,
    id_prenda_carrito,
  });

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: raw,
  };

  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json();

    if (result.code !== 200) {
      return { code: result.code, token: result.token };
    } else {
      return { code: 200, data: result.data, token: result.token };
    }
  } catch (error) {
    console.error("Error:", error);
    return { code: 404, token };
  }
};

export const addClothingItemThunk = createAsyncThunk(
  "cart/addClothingItem",
  async (cartOptions: CartOptionsThunkAdd, { rejectWithValue, getState }) => {
    const { product, limits, talla, token } = cartOptions;
    const { prendas_superiores, prendas_inferiores, prendas_otros } = limits;

    const state: any = getState() as { cart: cartState };
    const currentCart = state.carts.cart;

    //Poner si solo necesito tener 1 referencia
    // const existingProduct = currentCart.items.find(
    //   (item: any) => item.referencia === product.referencia
    // );

    if (!talla) {
      return rejectWithValue("Debe seleccionar una talla");
    }

    //Poner solo si necesito que solo se pueda elegir 1 referencia
    // if (existingProduct) {
    //   const response = await handleCart(product, talla, token);
    //   if (response.code === 200) {
    //     return { type: "update", product: existingProduct, talla };
    //   } else {
    //     return rejectWithValue("Hubo un error al actualizar la prenda");
    //   }
    // }

    if (
      (product.segmento_Prenda === "SUPERIOR" &&
        currentCart.counters.upper >= prendas_superiores) ||
      (product.segmento_Prenda === "INFERIOR" &&
        currentCart.counters.lower >= prendas_inferiores) ||
      (product.segmento_Prenda === "CHAQUETA" &&
        currentCart.counters.other >= prendas_otros) ||
      (product.segmento_Prenda === "VESTIDO" &&
        (currentCart.counters.upper + 1 >= prendas_superiores ||
          currentCart.counters.lower + 1 >= prendas_inferiores)) ||
      (product.segmento_Prenda === "TRAJE" &&
        (currentCart.counters.upper + 1 >= prendas_superiores ||
          currentCart.counters.lower + 1 >= prendas_inferiores))
    ) {
      return rejectWithValue("No se puede agregar más prendas de este tipo");
    }

    const response = await handleCartAdd(product, talla, token);
    if (response.code === 200) {
      return { type: "add", product, talla, data: response.data };
    } else {
      return rejectWithValue("Hubo un error al agregar la prenda");
    }
  }
);

export const removeClothingItemThunk = createAsyncThunk(
  "cart/removeClothingItem",
  async (
    cartOptions: CartOptionsThunkRemove,
    { rejectWithValue, getState }
  ) => {
    const { productId, talla, token } = cartOptions;

    const state: any = getState() as { cart: cartState };
    const currentCart = state.carts.cart;

    const productIndex = currentCart.items.findIndex(
      (item: Product) => item.id === productId && item.talla === talla
    );

    if (productIndex < 0) {
      return rejectWithValue("La prenda no se encuentra en el carrito");
    }

    const response = await handleCartRemove(productId, currentCart.id, token);
    if (response.code === 200) {
      return { type: "remove", data: { productIndex } };
    } else {
      return rejectWithValue("Hubo un error al agregar la prenda");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addClothingItem: (state, action: PayloadAction<CartOptionsAdd>) => {
      const { product, limits, talla } = action.payload;

      const { prendas_superiores, prendas_inferiores, prendas_otros } = limits;

      const currentCart = state.cart;

      const addCount = () => {
        if (product.segmento_Prenda === "SUPERIOR") {
          currentCart.counters.upper++;
        } else if (product.segmento_Prenda === "INFERIOR") {
          currentCart.counters.lower++;
        } else {
          currentCart.counters.other++;
        }
      };

      state.cart.messageId = uuidv4();

      //Poner si solo necesito tener 1 referencia
      // const existingProduct = currentCart.items.find(
      //   (item: any) => item.referencia === product.referencia
      // );

      if (!talla) {
        state.cart.message = "Debe seleccionar una talla";
        return;
      }

      //Poner solo si necesito que solo se pueda elegir 1 referencia
      // if (existingProduct) {
      //   const response = await handleCart(product, talla, token);
      //   if (response.code === 200) {
      //     return { type: "update", product: existingProduct, talla };
      //   } else {
      //     return rejectWithValue("Hubo un error al actualizar la prenda");
      //   }
      // }

      // Verificar los límites antes de agregar la prenda
      if (
        product.segmento_Prenda === "SUPERIOR" &&
        currentCart.counters.upper >= prendas_superiores
      ) {
        state.cart.message = "No se puede agregar más prendas superiores";
        return;
      } else if (
        product.segmento_Prenda === "INFERIOR" &&
        currentCart.counters.lower >= prendas_inferiores
      ) {
        state.cart.message = "No se puede agregar más prendas inferiores";
        return;
      } else if (
        product.segmento_Prenda === "CHAQUETA" &&
        currentCart.counters.other >= prendas_otros
      ) {
        state.cart.message = "No se puede agregar más prendas de otros tipos";
        return;
      } else if (
        product.segmento_Prenda === "VESTIDO" &&
        currentCart.counters.upper + 1 >= prendas_superiores
      ) {
        state.cart.message =
          "No se puede elegir la prenda porque supera los limites superiores de prendas";
        return;
      } else if (
        product.segmento_Prenda === "VESTIDO" &&
        currentCart.counters.lower + 1 >= prendas_inferiores
      ) {
        state.cart.message =
          "No se puede elegir la prenda porque supera los limites inferiores de prendas";
        return;
      } else if (
        product.segmento_Prenda === "TRAJE" &&
        currentCart.counters.upper + 1 >= prendas_superiores
      ) {
        state.cart.message =
          "No se puede elegir la prenda porque supera los limites superiores de prendas";
        return;
      } else if (
        product.segmento_Prenda === "TRAJE" &&
        currentCart.counters.lower + 1 >= prendas_inferiores
      ) {
        state.cart.message =
          "No se puede elegir la prenda porque supera los limites inferiores de prendas";
        return;
      }

      // if (
      //   currentCart.items.some((item) => item.referencia === product.referencia)
      // ) {
      //   state.cart.message = "La prenda ya está en el carrito";
      //   return;
      // }

      if (
        product.segmento_Prenda === "VESTIDO" ||
        product.segmento_Prenda === "TRAJE"
      ) {
        currentCart.counters.upper++;
        currentCart.counters.lower++;
      } else {
        addCount();
      }

      currentCart.items.push({ ...product, talla });
      state.cart.message = "Prenda agregada exitosamente";
      return;
    },
    removeClothingItem: (
      state,
      action: PayloadAction<{ productId: number; talla: string; token: string }>
    ) => {
      const { productId, talla } = action.payload;
      const productIndex = state.cart.items.findIndex(
        (item) => item.id === productId && item.talla === talla
      );

      state.cart.messageId = uuidv4();

      if (productIndex >= 0) {
        const product = state.cart.items[productIndex];
        if (product.segmento_Prenda === "SUPERIOR") {
          state.cart.counters.upper--;
        } else if (product.segmento_Prenda === "INFERIOR") {
          state.cart.counters.lower--;
        } else {
          state.cart.counters.other--;
        }
        state.cart.items.splice(productIndex, 1);
        state.cart.message = "Prenda eliminada exitosamente";
      } else {
        state.cart.message = "La prenda no se encuentra en el carrito";
      }
    },
    resetcart: (state) => {
      state.cart = {
        id: uuidv4(),
        name: "Carrito",
        items: [],
        counters: {
          upper: 0,
          lower: 0,
          other: 0,
        },
        message: null,
        messageId: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addClothingItemThunk.pending, (state) => {
        state.cart.message = "Agregando prenda...";
      })
      .addCase(addClothingItemThunk.fulfilled, (state, action) => {
        const { product, talla, data } = action.payload;

        const currentCart = state.cart;

        currentCart.id = data;

        currentCart.messageId = uuidv4();

        const addCount = () => {
          if (product.segmento_Prenda === "SUPERIOR") {
            currentCart.counters.upper++;
          } else if (product.segmento_Prenda === "INFERIOR") {
            currentCart.counters.lower++;
          } else {
            currentCart.counters.other++;
          }
        };

        if (
          product.segmento_Prenda === "VESTIDO" ||
          product.segmento_Prenda === "TRAJE"
        ) {
          currentCart.counters.upper++;
          currentCart.counters.lower++;
        } else {
          addCount();
        }

        state.cart.items.push({ ...product, talla });
        state.cart.message = "Prenda agregado exitosamente";
      })
      .addCase(addClothingItemThunk.rejected, (state, action) => {
        state.cart.message = action.payload as string;
      })
      .addCase(removeClothingItemThunk.pending, (state) => {
        state.cart.message = "Removiendo prenda...";
      })
      .addCase(removeClothingItemThunk.fulfilled, (state, action) => {
        const { productIndex } = action.payload.data;

        const currentCart = state.cart;

        const product = currentCart.items[productIndex];
        if (product.segmento_Prenda === "SUPERIOR") {
          currentCart.counters.upper--;
        } else if (product.segmento_Prenda === "INFERIOR") {
          currentCart.counters.lower--;
        } else {
          currentCart.counters.other--;
        }
        currentCart.items.splice(productIndex, 1);
        currentCart.message = "Prenda eliminada exitosamente";
      })
      .addCase(removeClothingItemThunk.rejected, (state, action) => {
        state.cart.message = action.payload as string;
      });
  },
});

export const { removeClothingItem, resetcart } = cartSlice.actions;
export default cartSlice.reducer;
