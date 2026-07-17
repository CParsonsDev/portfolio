
export default {
  basePath: 'https://CParsonsDev.github.io/portfolio',
  allowedHosts: [],
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
