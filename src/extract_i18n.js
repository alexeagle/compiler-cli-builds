#!/usr/bin/env node
"use strict";
require('reflect-metadata');
const compiler = require('@angular/compiler');
const tsc = require('@angular/tsc-wrapped');
const path = require('path');
const extractor_1 = require('./extractor');
function extract(ngOptions, cliOptions, program, host) {
    const extractor = extractor_1.Extractor.create(ngOptions, cliOptions.i18nFormat, program, host);
    const bundlePromise = extractor.extract();
    return (bundlePromise).then(messageBundle => {
        let ext;
        let serializer;
        const format = (cliOptions.i18nFormat || 'xlf').toLowerCase();
        switch (format) {
            case 'xmb':
                ext = 'xmb';
                serializer = new compiler.Xmb();
                break;
            case 'xliff':
            case 'xlf':
            default:
                ext = 'xlf';
                serializer = new compiler.Xliff();
                break;
        }
        const dstPath = path.join(ngOptions.genDir, `messages.${ext}`);
        host.writeFile(dstPath, messageBundle.write(serializer), false);
    });
}
// Entry point
if (require.main === module) {
    const args = require('minimist')(process.argv.slice(2));
    const project = args.p || args.project || '.';
    const cliOptions = new tsc.I18nExtractionCliOptions(args);
    tsc.main(project, cliOptions, extract)
        .then((exitCode) => process.exit(exitCode))
        .catch((e) => {
        console.error(e.stack);
        console.error('Extraction failed');
        process.exit(1);
    });
}
//# sourceMappingURL=extract_i18n.js.map