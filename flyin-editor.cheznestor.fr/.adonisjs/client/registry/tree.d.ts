/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  intra: {
    redirect: typeof routes['intra.redirect']
    callback: typeof routes['intra.callback']
  }
  session: {
    create: typeof routes['session.create']
    destroy: typeof routes['session.destroy']
  }
  logout: typeof routes['logout']
  admin: {
    home: typeof routes['admin.home']
    users: {
      index: typeof routes['admin.users.index']
      updateAdmin: typeof routes['admin.users.updateAdmin']
    }
  }
}
