Package.describe({
  name: 'doichain:accounts-password-doichain',
  summary: "accounts-password with additional storage for proof of existence on the Doichain blockchain",
  git: 'https://github.com/inspiraluna/meteor.git',
  documentation: 'README.md',
  version: "0.0.2"
});

Package.onUse(api => {
  api.use([
    'accounts-password@1.5.1',
    'http@1.4.2',
    'doichain:settings@0.1.6',
    'erasaur:meteor-lodash@4.0.0'
  ], ['server']);

  // Export Accounts (etc) to packages using this one.
  api.addFiles('doichain_server.js', 'server');
});

Package.onTest(api => {

});
