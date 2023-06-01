# docsify-pdf-converter

## Install

```sh
npm install
```

## Using custom configuration:

Create:

* config file `.docsifytopdfrc.<js|json|yaml>`

Example `.docsifytopdfrc.js` content:

```js
 module.exports = {
  addResumeFor: ['docs', 'code-guides'], // split documentation file with `_sidebar.md`
  pathToPublic: 'pdf', // path where pdf will stored
  pathToPublicHtml: 'html', // path where html will stored
  pathToDocsifyStyles: 'assets/css/docsify4-themes-vue.css', // path where docsify styles file is stored
  removeTemp: true, // remove temporary generated .md and .html in `docs` folder or not
  emulateMedia: 'screen', // mediaType, emulating by puppeteer for rendering pdf (reference: https://pptr.dev/api/puppeteer.page.emulatemediatype)
  pathToDocsifyEntryPoint: '.', // path where docsify `index.html` file is stored
  pdfOptions: { // options for rendering pdf (reference: https://pptr.dev/api/puppeteer.pdfoptions)
    format: 'A2',
    margin: {
      bottom: 120,
      left: 0,
      right: 0,
      top: 70,
    }
  },
}
```

## Usage

Move files from your docsify folder to `.bin` and run `node cli.js`.
