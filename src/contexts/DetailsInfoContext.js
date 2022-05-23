import {createContext} from "react";

export const DetailsInfoContext = createContext({
  status: false,
  startDate: "",
  endDate: "",
});
