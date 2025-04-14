"use client"

import { Provider } from "react-redux"
import { store, persistor } from "./store"
import { PersistGate } from "redux-persist/integration/react"
import I18nProvider from "@/components/I18nextProvider"


export default function Providers({children}) {
  return (
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor} >
        <I18nProvider>
          {children}
        </I18nProvider>
      </PersistGate>
    </Provider>
  )
}
