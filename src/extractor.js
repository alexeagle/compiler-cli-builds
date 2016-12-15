/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
/**
 * Extract i18n messages from source code
 */
// Must be imported first, because angular2 decorators throws on load.
require('reflect-metadata');
const compiler = require('@angular/compiler');
const codegen_1 = require('./codegen');
const compiler_host_1 = require('./compiler_host');
class Extractor {
    constructor(ngExtractor, ngCompilerHost, program) {
        this.ngExtractor = ngExtractor;
        this.ngCompilerHost = ngCompilerHost;
        this.program = program;
    }
    extract() {
        return this.ngExtractor.extract(this.program.getSourceFiles().map(sf => this.ngCompilerHost.getCanonicalFileName(sf.fileName)));
    }
    static create(options, translationsFormat, program, moduleResolverHost, ngCompilerHost) {
        if (!ngCompilerHost)
            ngCompilerHost =
                new compiler_host_1.CompilerHost(program, options, new compiler_host_1.ModuleResolutionHostAdapter(moduleResolverHost));
        const { extractor: ngExtractor } = compiler.Extractor.create(ngCompilerHost, { excludeFilePattern: codegen_1.excludeFilePattern(options) });
        return new Extractor(ngExtractor, ngCompilerHost, program);
    }
}
exports.Extractor = Extractor;
//# sourceMappingURL=extractor.js.map