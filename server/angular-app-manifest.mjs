
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://CParsonsDev.github.io/portfolio/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/portfolio/about"
  },
  {
    "renderMode": 2,
    "route": "/portfolio/portfolio"
  },
  {
    "renderMode": 2,
    "route": "/portfolio/projects"
  },
  {
    "renderMode": 2,
    "route": "/portfolio/world-map"
  },
  {
    "renderMode": 2,
    "redirectTo": "/portfolio/about",
    "route": "/portfolio/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 124676, hash: '889b4218856be8364d5bf44f98f99cfe73f03209f131109640ebc51eeec145a9', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 119981, hash: '119c224dc7d66addb3010928430210d53c0c4592d9c0019017d9ec43ce2340cb', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'portfolio/index.html': {size: 133619, hash: 'c360e4b352abc4e69a81d19ab1783c0c83436358485fe8a4be636bf03ff4c515', text: () => import('./assets-chunks/portfolio_index_html.mjs').then(m => m.default)},
    'projects/index.html': {size: 134551, hash: '4fc5b27654a4ce31d5a7182733883b521647e3774952cf58e33e2dd93e8f65bf', text: () => import('./assets-chunks/projects_index_html.mjs').then(m => m.default)},
    'about/index.html': {size: 135712, hash: 'aefca7806935396e47a526333031876323e7d8efa93eda3e38e94b7528dcfd1a', text: () => import('./assets-chunks/about_index_html.mjs').then(m => m.default)},
    'world-map/index.html': {size: 1380056, hash: 'f6d99d3240078740e34a3db4170c84382735d34e6d7ab1ac1999321c9126f10b', text: () => import('./assets-chunks/world-map_index_html.mjs').then(m => m.default)},
    'styles-XHYR7CEB.css': {size: 6330, hash: 'fZI51qVs0ns', text: () => import('./assets-chunks/styles-XHYR7CEB_css.mjs').then(m => m.default)}
  },
};
