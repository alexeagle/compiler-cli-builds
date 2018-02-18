#!/usr/bin/env node
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("angular/packages/compiler-cli/src/metadata/bundle_index_main", ["require", "exports", "reflect-metadata", "typescript", "angular/packages/compiler-cli/src/main", "angular/packages/compiler-cli/src/metadata/bundle_index_host", "angular/packages/compiler-cli/src/transformers/entry_points"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("reflect-metadata");
    var ts = require("typescript");
    var main_1 = require("angular/packages/compiler-cli/src/main");
    var bundle_index_host_1 = require("angular/packages/compiler-cli/src/metadata/bundle_index_host");
    var ng = require("angular/packages/compiler-cli/src/transformers/entry_points");
    function main(args, consoleError) {
        if (consoleError === void 0) { consoleError = console.error; }
        var _a = main_1.readCommandLineAndConfiguration(args), options = _a.options, rootNames = _a.rootNames;
        var host = ng.createCompilerHost({ options: options });
        var _b = bundle_index_host_1.createBundleIndexHost(options, rootNames, host), bundleHost = _b.host, indexName = _b.indexName, errors = _b.errors;
        if (!indexName) {
            console.error('Did not find an index.ts in the top-level of the package.');
            return 1;
        }
        rootNames.push(indexName);
        var program = ts.createProgram(rootNames, options, bundleHost);
        var indexSourceFile = program.getSourceFile(indexName);
        if (!indexSourceFile) {
            console.error(indexSourceFile + " is not in the program. Please file a bug.");
            return 1;
        }
        program.emit(indexSourceFile);
        return 0;
    }
    exports.main = main;
    // CLI entry point
    if (require.main === module) {
        var args = process.argv.slice(2);
        process.exitCode = main(args);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlX2luZGV4X21haW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL21ldGFkYXRhL2J1bmRsZV9pbmRleF9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQVVBLDRCQUEwQjtJQUUxQiwrQkFBaUM7SUFFakMsK0RBQXdEO0lBQ3hELGtHQUEwRDtJQUMxRCxnRkFBbUQ7SUFFbkQsY0FBcUIsSUFBYyxFQUFFLFlBQWlEO1FBQWpELDZCQUFBLEVBQUEsZUFBb0MsT0FBTyxDQUFDLEtBQUs7UUFDOUUsSUFBQSxpREFBNEQsRUFBM0Qsb0JBQU8sRUFBRSx3QkFBUyxDQUEwQztRQUNuRSxJQUFNLElBQUksR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUMsRUFBQyxPQUFPLFNBQUEsRUFBQyxDQUFDLENBQUM7UUFDeEMsSUFBQSx3RUFBdUYsRUFBdEYsb0JBQWdCLEVBQUUsd0JBQVMsRUFBRSxrQkFBTSxDQUFvRDtRQUM5RixFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLDJEQUEyRCxDQUFDLENBQUM7WUFDM0UsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFDRCxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFCLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNqRSxJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNyQixPQUFPLENBQUMsS0FBSyxDQUFJLGVBQWUsK0NBQTRDLENBQUMsQ0FBQztZQUM5RSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFqQkQsb0JBaUJDO0lBRUQsa0JBQWtCO0lBQ2xCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM1QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBNdXN0IGJlIGltcG9ydGVkIGZpcnN0LCBiZWNhdXNlIEFuZ3VsYXIgZGVjb3JhdG9ycyB0aHJvdyBvbiBsb2FkLlxuaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtyZWFkQ29tbWFuZExpbmVBbmRDb25maWd1cmF0aW9ufSBmcm9tICcuLi9tYWluJztcbmltcG9ydCB7Y3JlYXRlQnVuZGxlSW5kZXhIb3N0fSBmcm9tICcuL2J1bmRsZV9pbmRleF9ob3N0JztcbmltcG9ydCAqIGFzIG5nIGZyb20gJy4uL3RyYW5zZm9ybWVycy9lbnRyeV9wb2ludHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gbWFpbihhcmdzOiBzdHJpbmdbXSwgY29uc29sZUVycm9yOiAoczogc3RyaW5nKSA9PiB2b2lkID0gY29uc29sZS5lcnJvcik6IG51bWJlciB7XG4gIGNvbnN0IHtvcHRpb25zLCByb290TmFtZXN9ID0gcmVhZENvbW1hbmRMaW5lQW5kQ29uZmlndXJhdGlvbihhcmdzKTtcbiAgY29uc3QgaG9zdCA9IG5nLmNyZWF0ZUNvbXBpbGVySG9zdCh7b3B0aW9uc30pO1xuICBjb25zdCB7aG9zdDogYnVuZGxlSG9zdCwgaW5kZXhOYW1lLCBlcnJvcnN9ID0gY3JlYXRlQnVuZGxlSW5kZXhIb3N0KG9wdGlvbnMsIHJvb3ROYW1lcywgaG9zdCk7XG4gIGlmICghaW5kZXhOYW1lKSB7XG4gICAgY29uc29sZS5lcnJvcignRGlkIG5vdCBmaW5kIGFuIGluZGV4LnRzIGluIHRoZSB0b3AtbGV2ZWwgb2YgdGhlIHBhY2thZ2UuJyk7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgcm9vdE5hbWVzLnB1c2goaW5kZXhOYW1lKTtcbiAgY29uc3QgcHJvZ3JhbSA9IHRzLmNyZWF0ZVByb2dyYW0ocm9vdE5hbWVzLCBvcHRpb25zLCBidW5kbGVIb3N0KTtcbiAgY29uc3QgaW5kZXhTb3VyY2VGaWxlID0gcHJvZ3JhbS5nZXRTb3VyY2VGaWxlKGluZGV4TmFtZSk7XG4gIGlmICghaW5kZXhTb3VyY2VGaWxlKSB7XG4gICAgY29uc29sZS5lcnJvcihgJHtpbmRleFNvdXJjZUZpbGV9IGlzIG5vdCBpbiB0aGUgcHJvZ3JhbS4gUGxlYXNlIGZpbGUgYSBidWcuYCk7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgcHJvZ3JhbS5lbWl0KGluZGV4U291cmNlRmlsZSk7XG4gIHJldHVybiAwO1xufVxuXG4vLyBDTEkgZW50cnkgcG9pbnRcbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICBjb25zdCBhcmdzID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpO1xuICBwcm9jZXNzLmV4aXRDb2RlID0gbWFpbihhcmdzKTtcbn1cbiJdfQ==