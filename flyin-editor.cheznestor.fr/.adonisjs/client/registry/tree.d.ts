/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  workshop: {
    index: typeof routes['workshop.index']
    show: typeof routes['workshop.show']
  }
  intra: {
    redirect: typeof routes['intra.redirect']
    callback: typeof routes['intra.callback']
  }
  session: {
    create: typeof routes['session.create']
    destroy: typeof routes['session.destroy']
  }
  projects: {
    index: typeof routes['projects.index']
    store: typeof routes['projects.store']
    show: typeof routes['projects.show']
    update: typeof routes['projects.update']
    updateMetadata: typeof routes['projects.update-metadata']
    destroy: typeof routes['projects.destroy']
  }
  profile: typeof routes['profile']
  logout: typeof routes['logout']
  admin: {
    home: typeof routes['admin.home']
    users: {
      index: typeof routes['admin.users.index']
      updateAdmin: typeof routes['admin.users.updateAdmin']
    }
  }
}
