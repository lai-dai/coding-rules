import {
  type Session,
} from "next-auth"
import {
  create,
} from "zustand"

interface ConfirmAlertStore {
  session?: Session
  getUserSession: () => Session["user"] | undefined
  getBranchIDUser: () => string | undefined
}

// eslint-disable-next-line custom-rules/encourage-object-params
export const useSessionStore = create<ConfirmAlertStore>()((
  set, get
) => ({
  session: undefined,
  getUserSession: () => {
    return get().session?.user!
  },
  getBranchIDUser: () => {
    return get().getUserSession()?.branch_id
  },
}))

export const getBranchIDUser = useSessionStore.getState().getBranchIDUser
export const getUserSession = useSessionStore.getState().getUserSession
