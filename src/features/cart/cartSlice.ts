import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { getApuUrl } from "../../utils/config";

interface Cart {
  id: string;
  name: string;
  items: Product[];
  counters: {
    back: {
      upper: number;
      lower: number;
      otherClothe: number;
      other: number;
    };
    front: {
      upper: number;
      lower: number;
      other: number;
    };
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
  dia?: string;
  id?: string;
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
      back: {
        upper: 0,
        lower: 0,
        otherClothe: 0,
        other: 0,
      },
      front: {
        upper: 0,
        lower: 0,
        other: 0,
      },
    },
    message: null,
    messageId: null,
  },
};

const handleCartAdd = async (
  product: Product,
  talla: string,
  token: string,
  dia?: string
) => {
  const url = getApuUrl("/agregarPrenda");

  const raw = JSON.stringify({
    id_prenda: product.id,
    talla,
    ...(dia && { dia }),
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
      return {
        code: 200,
        data: {
          id_prenda: result.data[0].id_prenda,
          id_carrito: result.data[0].id_carrito,
        },
        token: result.token,
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return { code: 404, token };
  }
};

const handleCartRemove = async (id_prenda: string, token: string) => {
  const url = getApuUrl("/quitarPrenda");

  const raw = JSON.stringify({
    id_prenda,
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
    const { product, limits, talla, token, dia } = cartOptions;
    const { prendas_superiores, prendas_inferiores, prendas_otros } = limits;

    const state: any = getState() as { cart: cartState };
    const currentCart = state.carts.cart;

    if (!talla) {
      return rejectWithValue("Debe seleccionar una talla");
    }

    const existingItemIndex = currentCart.items.findIndex(
      (item: Product) => item.referencia === product.referencia
    );

    if (
      (product.segmento_Prenda === "SUPERIOR" &&
        currentCart.counters.back.upper >= prendas_superiores) ||
      (product.segmento_Prenda === "INFERIOR" &&
        currentCart.counters.back.lower >= prendas_inferiores) ||
      (product.segmento_Prenda === "CHAQUETA" &&
        currentCart.counters.back.other >= prendas_otros) ||
      (product.segmento_Prenda === "SACO" &&
        currentCart.counters.back.other + 0.5 > prendas_otros) ||
      (product.segmento_Prenda === "VESTIDO" &&
        (currentCart.counters.back.upper + 1 > prendas_superiores ||
          currentCart.counters.back.lower + 1 > prendas_inferiores)) ||
      (product.segmento_Prenda === "TRAJE" &&
        (currentCart.counters.back.upper + 1 > prendas_superiores ||
          currentCart.counters.back.lower + 1 > prendas_inferiores)) ||
      (product.segmento_Prenda === "ENTERIZO" &&
        (currentCart.counters.back.upper + 1 > prendas_superiores ||
          currentCart.counters.back.lower + 1 > prendas_inferiores))
    ) {
      return rejectWithValue("No se puede agregar más prendas de este tipo");
    }

    const response = await handleCartAdd(product, talla, token, dia);
    if (response.code === 200) {
      if (existingItemIndex !== -1) {
        const updatedItems = currentCart.items.map(
          (item: Product, index: number) =>
            index === existingItemIndex ? { ...item, talla } : item
        );

        return {
          type: "update",
          product,
          talla,
          data: undefined,
          updatedItems,
        };
      } else {
        return { type: "add", product, talla, data: response.data };
      }
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

    const response = await handleCartRemove(
      currentCart.items[productIndex].id_prenda,
      token
    );
    if (response.code === 200) {
      return { type: "remove", data: { productIndex } };
    } else {
      return rejectWithValue("Hubo un error al eliminar la prenda");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addClothingItem: (state, action: PayloadAction<CartOptionsAdd>) => {
      const { product, limits, talla, id } = action.payload;

      const currentCart = state.cart;

      if (id) {
        currentCart.id = id;
      }

      const { prendas_superiores, prendas_inferiores, prendas_otros } = limits;

      const existingItemIndex = currentCart.items.findIndex(
        (item: Product) => item.referencia === product.referencia
      );

      if (existingItemIndex !== -1) {
        currentCart.items[existingItemIndex].talla = talla;
        state.cart.message = "Talla actualizada exitosamente";
        return;
      }

      const addCount = ({ prenda }: Product) => {
        const product = prenda;

        if (product.segmento_Prenda === "SUPERIOR") {
          currentCart.counters.back.upper++;
        } else if (product.segmento_Prenda === "INFERIOR") {
          currentCart.counters.back.lower++;
        } else if (product.segmento_Prenda === "CHAQUETA") {
          currentCart.counters.back.other++;
        } else if (product.segmento_Prenda === "SACO") {
          currentCart.counters.back.other += 0.5;
        } else if (
          product.segmento_Prenda === "VESTIDO" ||
          product.segmento_Prenda === "TRAJE" ||
          product.segmento_Prenda === "ENTERIZO"
        ) {
          currentCart.counters.back.upper++;
          currentCart.counters.back.lower++;
          currentCart.counters.back.otherClothe++;
        }
      };

      state.cart.messageId = uuidv4();

      if (!talla) {
        state.cart.message = "Debe seleccionar una talla";
        return;
      }

      if (
        product.segmento_Prenda === "SUPERIOR" &&
        currentCart.counters.back.upper >= prendas_superiores
      ) {
        state.cart.message = "No se puede agregar más prendas superiores";
        return;
      } else if (
        product.segmento_Prenda === "INFERIOR" &&
        currentCart.counters.back.lower >= prendas_inferiores
      ) {
        state.cart.message = "No se puede agregar más prendas inferiores";
        return;
      } else if (
        product.segmento_Prenda === "CHAQUETA" &&
        currentCart.counters.back.other >= prendas_otros
      ) {
        state.cart.message = "No se puede agregar más prendas de otros tipos";
        return;
      } else if (
        product.segmento_Prenda === "VESTIDO" &&
        (currentCart.counters.back.upper + 1 > prendas_superiores ||
          currentCart.counters.back.lower + 1 > prendas_inferiores)
      ) {
        state.cart.message = "No se puede agregar más prendas de tipo vestido";
        return;
      } else if (
        product.segmento_Prenda === "TRAJE" &&
        (currentCart.counters.back.upper + 1 > prendas_superiores ||
          currentCart.counters.back.lower + 1 > prendas_inferiores)
      ) {
        state.cart.message = "No se puede agregar más prendas de tipo traje";
        return;
      } else if (
        product.segmento_Prenda === "ENTERIZO" &&
        (currentCart.counters.back.upper + 1 > prendas_superiores ||
          currentCart.counters.back.lower + 1 > prendas_inferiores)
      ) {
        state.cart.message = "No se puede agregar más prendas de tipo enterizo";
        return;
      }

      currentCart.items.push({ ...product.prenda, talla });

      addCount(product);

      state.cart.message = "Prenda agregada exitosamente";
    },
    removeClothingItem: (state, action: PayloadAction<CartOptionsRemove>) => {
      const { productId, talla } = action.payload;

      const currentCart = state.cart;
      const existingItemIndex = currentCart.items.findIndex(
        (item: Product) => item.id === productId && item.talla === talla
      );

      if (existingItemIndex !== -1) {
        const product = currentCart.items[existingItemIndex];

        const subtractCount = () => {
          if (product.segmento_Prenda === "SUPERIOR") {
            currentCart.counters.back.upper--;
          } else if (product.segmento_Prenda === "INFERIOR") {
            currentCart.counters.back.lower--;
          } else if (product.segmento_Prenda === "CHAQUETA") {
            currentCart.counters.back.other--;
          } else if (product.segmento_Prenda === "SACO") {
            currentCart.counters.back.other -= 0.5;
          } else if (
            product.segmento_Prenda === "VESTIDO" ||
            product.segmento_Prenda === "TRAJE" ||
            product.segmento_Prenda === "ENTERIZO"
          ) {
            currentCart.counters.back.upper--;
            currentCart.counters.back.lower--;
            currentCart.counters.back.otherClothe--;
          }
        };

        subtractCount();

        currentCart.items.splice(existingItemIndex, 1);
        state.cart.message = "Prenda eliminada exitosamente";
        state.cart.messageId = uuidv4();
      }
    },
    clearMessage: (state) => {
      state.cart.message = "Se ha limpiado el mensaje";
      state.cart.messageId = "0000000000";
    },
    resetcart: (state) => {
      state.cart = {
        id: uuidv4(),
        name: "Carrito",
        items: [],
        counters: {
          back: {
            upper: 0,
            lower: 0,
            otherClothe: 0,
            other: 0,
          },
          front: {
            upper: 0,
            lower: 0,
            other: 0,
          },
        },
        message: "El carrito se ha limpiado",
        messageId: "1010101010",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addClothingItemThunk.pending, (state) => {
        state.cart.message = "Agregando prenda...";
      })
      .addCase(addClothingItemThunk.fulfilled, (state, action) => {
        const { type, product, talla, data, updatedItems } = action.payload;

        const addCount = () => {
          if (product.segmento_Prenda === "SUPERIOR") {
            state.cart.counters.back.upper++;
          } else if (product.segmento_Prenda === "INFERIOR") {
            state.cart.counters.back.lower++;
          } else if (product.segmento_Prenda === "CHAQUETA") {
            state.cart.counters.back.other++;
          } else if (product.segmento_Prenda === "SACO") {
            state.cart.counters.back.other += 0.5;
          } else if (
            product.segmento_Prenda === "VESTIDO" ||
            product.segmento_Prenda === "TRAJE" ||
            product.segmento_Prenda === "ENTERIZO"
          ) {
            state.cart.counters.back.upper++;
            state.cart.counters.back.lower++;
            state.cart.counters.back.otherClothe++;
          }
        };

        if (type === "add") {
          if (data) {
            state.cart.items.push({
              ...product,
              talla,
              id_prenda: data.id_prenda,
            });
            addCount();
            state.cart.message = "Prenda agregada exitosamente";
          } else {
            state.cart.message = "La prenda no pudo ser agregada";
          }
        } else if (type === "update") {
          state.cart.items = updatedItems;
          state.cart.message = "Talla actualizada exitosamente";
        }

        state.cart.messageId = uuidv4();
      })
      .addCase(addClothingItemThunk.rejected, (state, action) => {
        state.cart.message = action.payload as string;
      })
      .addCase(removeClothingItemThunk.pending, (state) => {
        state.cart.message = "Removiendo prenda...";
      })
      .addCase(removeClothingItemThunk.fulfilled, (state, action) => {
        const { productIndex } = action.payload.data;

        if (productIndex !== -1) {
          const product = state.cart.items[productIndex];

          const subtractCount = () => {
            if (product.segmento_Prenda === "SUPERIOR") {
              state.cart.counters.back.upper--;
            } else if (product.segmento_Prenda === "INFERIOR") {
              state.cart.counters.back.lower--;
            } else if (product.segmento_Prenda === "CHAQUETA") {
              state.cart.counters.back.other--;
            } else if (product.segmento_Prenda === "SACO") {
              state.cart.counters.back.other -= 0.5;
            } else if (
              product.segmento_Prenda === "VESTIDO" ||
              product.segmento_Prenda === "TRAJE" ||
              product.segmento_Prenda === "ENTERIZO"
            ) {
              state.cart.counters.back.upper--;
              state.cart.counters.back.lower--;
              state.cart.counters.back.otherClothe--;
            }
          };

          subtractCount();

          state.cart.items.splice(productIndex, 1);
          state.cart.message = "Prenda eliminada exitosamente";
          state.cart.messageId = uuidv4();
        } else {
          state.cart.message = "La prenda no pudo ser eliminada";
          state.cart.messageId = uuidv4();
        }
      })
      .addCase(removeClothingItemThunk.rejected, (state, action) => {
        state.cart.message = action.payload as string;
      });
  },
});

export const { addClothingItem, removeClothingItem, clearMessage, resetcart } =
  cartSlice.actions;
export default cartSlice.reducer;
