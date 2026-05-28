/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'workshop.index': {
    methods: ["GET","HEAD"],
    pattern: '/workshop',
    tokens: [{"old":"/workshop","type":0,"val":"workshop","end":""}],
    types: placeholder as Registry['workshop.index']['types'],
  },
  'workshop.show': {
    methods: ["GET","HEAD"],
    pattern: '/workshop/:id',
    tokens: [{"old":"/workshop/:id","type":0,"val":"workshop","end":""},{"old":"/workshop/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['workshop.show']['types'],
  },
  'intra.redirect': {
    methods: ["GET","HEAD"],
    pattern: '/oauth/intra/redirect',
    tokens: [{"old":"/oauth/intra/redirect","type":0,"val":"oauth","end":""},{"old":"/oauth/intra/redirect","type":0,"val":"intra","end":""},{"old":"/oauth/intra/redirect","type":0,"val":"redirect","end":""}],
    types: placeholder as Registry['intra.redirect']['types'],
  },
  'intra.callback': {
    methods: ["GET","HEAD"],
    pattern: '/oauth/intra/callback',
    tokens: [{"old":"/oauth/intra/callback","type":0,"val":"oauth","end":""},{"old":"/oauth/intra/callback","type":0,"val":"intra","end":""},{"old":"/oauth/intra/callback","type":0,"val":"callback","end":""}],
    types: placeholder as Registry['intra.callback']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'projects.index': {
    methods: ["GET","HEAD"],
    pattern: '/projects',
    tokens: [{"old":"/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.index']['types'],
  },
  'projects.store': {
    methods: ["POST"],
    pattern: '/projects',
    tokens: [{"old":"/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.store']['types'],
  },
  'profile': {
    methods: ["GET","HEAD"],
    pattern: '/profile',
    tokens: [{"old":"/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile']['types'],
  },
  'projects.show': {
    methods: ["GET","HEAD"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.show']['types'],
  },
  'projects.update': {
    methods: ["PUT"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.update']['types'],
  },
  'projects.update-metadata': {
    methods: ["PATCH"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.update-metadata']['types'],
  },
  'projects.destroy': {
    methods: ["DELETE"],
    pattern: '/projects/:id',
    tokens: [{"old":"/projects/:id","type":0,"val":"projects","end":""},{"old":"/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.destroy']['types'],
  },
  'logout': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['logout']['types'],
  },
  'session.destroy': {
    methods: ["GET","HEAD"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'admin.home': {
    methods: ["GET","HEAD"],
    pattern: '/admin',
    tokens: [{"old":"/admin","type":0,"val":"admin","end":""}],
    types: placeholder as Registry['admin.home']['types'],
  },
  'admin.users.index': {
    methods: ["GET","HEAD"],
    pattern: '/admin/users',
    tokens: [{"old":"/admin/users","type":0,"val":"admin","end":""},{"old":"/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.users.index']['types'],
  },
  'admin.users.updateAdmin': {
    methods: ["PUT"],
    pattern: '/admin/users/:id/admin',
    tokens: [{"old":"/admin/users/:id/admin","type":0,"val":"admin","end":""},{"old":"/admin/users/:id/admin","type":0,"val":"users","end":""},{"old":"/admin/users/:id/admin","type":1,"val":"id","end":""},{"old":"/admin/users/:id/admin","type":0,"val":"admin","end":""}],
    types: placeholder as Registry['admin.users.updateAdmin']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
