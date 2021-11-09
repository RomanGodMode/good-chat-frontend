import { createContext, FC, useContext } from "react"

type AuthenticatedUser = {}

const userContext = createContext<AuthenticatedUser | null>(null)

export const useUser = () => useContext(userContext)

export const AuthenticatedUserProvider: FC = ({children}) => {
  const user = true

  return <userContext.Provider value={user}>
    {children}
  </userContext.Provider>
}


