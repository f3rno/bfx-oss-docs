# Bitfinex Documentation

> Heavily WIP

### Configuring

For now, see `config.json` for the config structure.

#### RIO Export Conversion Note

The `/data` folder exists for automated readme.io export conversion. To use,
create an export and extract the contents into `/data/readmeio`, then run
`yarn convert-rio-data` to generate native markdown files in the configured
source path (currently `_src`)

**NOTE**: This will clean the source path, overwriting it entirely. RIO export
conversion should only be done during migration, after which the relevant logic
will be removed or transferred to a different repo.

#### RIO Export Parser Notes
Currently `[block:parameters]` blocks are not converted/rendered in the new
native source file format, as matching the readme.io output (table w/ cells
containing markdown) is painful to author. We need a better solution for
authoring & rendering such data.

TBD: Given that there are few occurences of these blocks, potentially replace
them entirely. 

#### RIO Conversion Notes
For now, the `_src` directory is transient as it is re-generated when RIO
export sources are converted. As such, site structure configuration is
currently in `config.json`.

As `config.json` is meant for the static site generator, the structure
definition there will be moved to `_src/structure.json` after RIO migration is
complete.

### Building

```bash
yarn prepare
yarn build-bfx-jsdoc
yarn build-site
```

or just

```bash
yarn dist
```

### Serving Locally

* `yarn serve-site` to serve the built static site
* `yarn serve-jsdoc` to serve the built unified JSDoc documentation

### Building Unified JSDoc Documentation

Generating the unified JSDoc documentation for all of Bitfinex's JavaScript
projects is multi-step process:

* `yarn build-bfx-jsdoc-config` to generate the JSDoc config file for all
  projects (assuming `config.json` is correctly populated and submodules are
  present)
* `yarn build-bfx-jsdoc-html` to generate the unified documentation
* `yarn build-bfx-jsdoc-assets` to copy static assets to the dist folder

All of the above are available as `yarn build-bfx-jsdoc`, and can be cleaned up
with `yarn clean-jsdoc`.

### Building the Static Site

Similarly, building the static site requires:

* `yarn prepare-bfx-hf-chart` to build the `bfx-hf-chart` for inclusion in an
  iframe from the assets folder
* `yarn build-site` to render the site itself

All of the above are available as `yarn build-site`, and can be cleaned up
with `yarn clean-site`.

### Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
