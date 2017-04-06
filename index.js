const querystring = require("querystring");

module.exports = function(configs) {
  if (!Array.isArray(configs)) {
    configs = [configs];
  }

  return configs.map(c => {
    c.module.rules = [];

    (c.module.loaders || []).forEach(l => {
      if (/^json/.test(l.loader)) {
        return;
      }

      l.use = l.loader.split("!").map(l => {
        const [loader, query] = l.split("?");

        if (query) {
          const options = querystring.parse(query);

          return {
            loader,
            options
          };
        }

        return loader;
      });

      delete l.loader;

      c.module.rules.push(l);
    });

    if (c.resolve && c.resolve.root) {
      c.resolve.modules = Array.isArray(c.resolve.root)
        ? c.resolve.root
        : [c.resolve.root];
      delete c.resolve.root;
    }

    if (c.resolveLoader) {
      delete c.resolveLoader.root;
    }

    c.plugins = c.plugins.filter(
      p =>
        p &&
        p.constructor &&
        ["DedupePlugin", "OccurrenceOrderPlugin"].indexOf(p.constructor.name) <
          0
    );

    delete c.module.loaders;

    return c;
  });
};
