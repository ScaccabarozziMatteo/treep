import React, {createContext, useState} from "react";

export const DetailsContext = createContext();

export const DetailsContextProvider = (props) => {
  const [detailsList, setDetailsList] = useState([]);

  return (
    <DetailsContextProvider.Provider
      value={{
        detailsList, setDetailsList
      }}>
      {props.children}
    </DetailsContextProvider.Provider>
  );
}
