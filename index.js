"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var compiler_1 = require('@angular/compiler');
exports.StaticReflector = compiler_1.StaticReflector;
exports.StaticSymbol = compiler_1.StaticSymbol;
var codegen_1 = require('./src/codegen');
exports.CodeGenerator = codegen_1.CodeGenerator;
var compiler_host_1 = require('./src/compiler_host');
exports.CompilerHost = compiler_host_1.CompilerHost;
exports.NodeCompilerHostContext = compiler_host_1.NodeCompilerHostContext;
var extractor_1 = require('./src/extractor');
exports.Extractor = extractor_1.Extractor;
__export(require('@angular/tsc-wrapped'));
var core_1 = require('@angular/core');
/**
 * @stable
 */
exports.VERSION = new core_1.Version('2.3.0-beta.0-f275f36');
//# sourceMappingURL=index.js.map