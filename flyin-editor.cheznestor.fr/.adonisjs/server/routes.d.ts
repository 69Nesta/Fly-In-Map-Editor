import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'intra.redirect': { paramsTuple?: []; params?: {} }
    'intra.callback': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.update-metadata': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'logout': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin.home': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.users.updateAdmin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'intra.redirect': { paramsTuple?: []; params?: {} }
    'intra.callback': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin.home': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'intra.redirect': { paramsTuple?: []; params?: {} }
    'intra.callback': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin.home': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'projects.store': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.updateAdmin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'projects.update-metadata': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}