import React, { useState } from 'react';

const Context = React.createContext({});

const Consumer = Context.Consumer;

const Provider: React.FC = ({ children }) => {
    const [store, setStore] = useState<any>({});
    return (
        <Context.Provider
            value={{
                store: store,
                setStore: setStore,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export { Provider, Consumer };
