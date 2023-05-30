const path = require("path");
const { merge } = require("lodash");
const logger = require("./logger.js");
const getFreePorts = require("./free-port.js");
const fs = require("fs");

const defaultConfig = {
  contents: [], // array of "table of contents" files path
  pathToPublic: 'files/pdf', // path where pdf will stored
  pathToPublicHtml: 'files/html', // path where pdf will stored
  pathToDocsifyStyles: 'assets/css/docsify4-themes-vue.css', // path where pdf will stored
  removeTemp: true, // remove generated .md and .html or not
  emulateMedia: 'screen', // mediaType, emulating by puppeteer for rendering pdf, 'print' by default (reference:
  // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageemulatemediamediatype)
  pathToDocsifyEntryPoint: '.',
  pathToStatic: 'html/docs/static',
  routeToStatic: 'static',
  mainMdFilename: 'main.md',
  pdfOptions: {
    format: 'A2', margin: {
      bottom: 120, // minimum required for footer msg to display
      left: 0,
      right: 0,
      top: 70,
    }
  },
};

const run = async incomingConfig => {
  const preBuildedConfig = merge(defaultConfig, incomingConfig);

  fs.readdirSync('html/docs').forEach(file => {
    if (new RegExp(/([^\/]+\.md)$/).test(file) && !(new RegExp(/(_sidebar.md)$/).test(file))) {
      return;
    }

    if (new RegExp(/(_sidebar.md)$/).test(file)) {
      preBuildedConfig.contents.push('html/docs/' + file);
    } else {
      fs.readdirSync('html/docs/' + file).forEach(file1 => {
        if (new RegExp(/(_sidebar.md)$/).test(file1)) {
          preBuildedConfig.contents.push('html/docs/' + file + '/' + file1);
        }
      })
    }
  });

  for (const document of preBuildedConfig.contents) {
    const [docsifyRendererPort, docsifyLiveReloadPort] = await getFreePorts();

    const config = {
      ...preBuildedConfig,
      docsifyRendererPort,
      docsifyLiveReloadPort,
      contents: [document]
    };

    const finalName = path.resolve(config.contents[0]).match(/.*\/([^\/]+)\/.*/m)[1];

    config.pathToPublic += `/${finalName}.pdf`;
    config.pathToPublicHtml += `/${finalName}.html`;
    config.finalName = finalName;

    logger.info("Build with settings:");
    console.log(JSON.stringify(config, null, 2));
    console.log("\n");

    const { combineMarkdowns } = require("./markdown-combine.js")(config);
    const { closeProcess, prepareEnv, cleanUp } = require("./utils.js")(config);
    const { createRoadMap } = require("./contents-builder.js")(config);
    const { runDocsifyRenderer } = require("./docsify-server.js")(config);
    const { htmlToPdf } = require("./render.js")(config);

    try {
      await cleanUp();
      await prepareEnv();
      const { roadMap, resume } = await createRoadMap();
      await combineMarkdowns(roadMap, resume);

      runDocsifyRenderer();
      await htmlToPdf();

      logger.success(path.resolve(config.pathToPublic));
    } catch (error) {
      logger.err("run error", error);
    } finally {
      await closeProcess();
    }
  }

  return process.exit(0);
};

module.exports = run;
