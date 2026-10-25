// no-store on every page so the back button can't show a cached dashboard after logout
module.exports = {
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }] }];
  },
};
