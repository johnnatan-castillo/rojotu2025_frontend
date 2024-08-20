import storageSession from "redux-persist/lib/storage/session"; 
import { PersistConfig } from "redux-persist";

const persistConfig: PersistConfig<any> = {
  key: "root",
  storage: storageSession,
  whitelist: ["auth", "carts"],
};

export default persistConfig;
