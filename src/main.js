#!/usr/bin/env node
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("angular/packages/compiler-cli/src/main", ["require", "exports", "reflect-metadata", "typescript", "tsickle/src/tsickle", "angular/packages/compiler-cli/src/transformers/api", "angular/packages/compiler-cli/src/transformers/util", "angular/packages/compiler-cli/src/perform_compile", "angular/packages/compiler-cli/src/perform_watch"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("reflect-metadata");
    var ts = require("typescript");
    var tsickle = require("tsickle/src/tsickle");
    var api = require("angular/packages/compiler-cli/src/transformers/api");
    var util_1 = require("angular/packages/compiler-cli/src/transformers/util");
    var perform_compile_1 = require("angular/packages/compiler-cli/src/perform_compile");
    var perform_watch_1 = require("angular/packages/compiler-cli/src/perform_watch");
    function main(args, consoleError, config) {
        if (consoleError === void 0) { consoleError = console.error; }
        var _a = config || readNgcCommandLineAndConfiguration(args), project = _a.project, rootNames = _a.rootNames, options = _a.options, configErrors = _a.errors, watch = _a.watch, emitFlags = _a.emitFlags;
        if (configErrors.length) {
            return reportErrorsAndExit(configErrors, /*options*/ undefined, consoleError);
        }
        if (watch) {
            var result = watchMode(project, options, consoleError);
            return reportErrorsAndExit(result.firstCompileResult, options, consoleError);
        }
        var compileDiags = perform_compile_1.performCompilation({ rootNames: rootNames, options: options, emitFlags: emitFlags, emitCallback: createEmitCallback(options) }).diagnostics;
        return reportErrorsAndExit(compileDiags, options, consoleError);
    }
    exports.main = main;
    function createEmitCallback(options) {
        var transformDecorators = options.annotationsAs !== 'decorators';
        var transformTypesToClosure = options.annotateForClosureCompiler;
        if (!transformDecorators && !transformTypesToClosure) {
            return undefined;
        }
        if (transformDecorators) {
            // This is needed as a workaround for https://github.com/angular/tsickle/issues/635
            // Otherwise tsickle might emit references to non imported values
            // as TypeScript elided the import.
            options.emitDecoratorMetadata = true;
        }
        var tsickleHost = {
            shouldSkipTsickleProcessing: function (fileName) {
                return /\.d\.ts$/.test(fileName) || util_1.GENERATED_FILES.test(fileName);
            },
            pathToModuleName: function (context, importPath) { return ''; },
            shouldIgnoreWarningsForPath: function (filePath) { return false; },
            fileNameToModuleId: function (fileName) { return fileName; },
            googmodule: false,
            untyped: true,
            convertIndexImportShorthand: false, transformDecorators: transformDecorators, transformTypesToClosure: transformTypesToClosure,
        };
        return function (_a) {
            var program = _a.program, targetSourceFile = _a.targetSourceFile, writeFile = _a.writeFile, cancellationToken = _a.cancellationToken, emitOnlyDtsFiles = _a.emitOnlyDtsFiles, _b = _a.customTransformers, customTransformers = _b === void 0 ? {} : _b, host = _a.host, options = _a.options;
            return tsickle.emitWithTsickle(program, __assign({}, tsickleHost, { options: options, host: host }), host, options, targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, {
                beforeTs: customTransformers.before,
                afterTs: customTransformers.after,
            });
        };
    }
    function readNgcCommandLineAndConfiguration(args) {
        var options = {};
        var parsedArgs = require('minimist')(args);
        if (parsedArgs.i18nFile)
            options.i18nInFile = parsedArgs.i18nFile;
        if (parsedArgs.i18nFormat)
            options.i18nInFormat = parsedArgs.i18nFormat;
        if (parsedArgs.locale)
            options.i18nInLocale = parsedArgs.locale;
        var mt = parsedArgs.missingTranslation;
        if (mt === 'error' || mt === 'warning' || mt === 'ignore') {
            options.i18nInMissingTranslations = mt;
        }
        var config = readCommandLineAndConfiguration(args, options, ['i18nFile', 'i18nFormat', 'locale', 'missingTranslation', 'watch']);
        var watch = parsedArgs.w || parsedArgs.watch;
        return __assign({}, config, { watch: watch });
    }
    function readCommandLineAndConfiguration(args, existingOptions, ngCmdLineOptions) {
        if (existingOptions === void 0) { existingOptions = {}; }
        if (ngCmdLineOptions === void 0) { ngCmdLineOptions = []; }
        var cmdConfig = ts.parseCommandLine(args);
        var project = cmdConfig.options.project || '.';
        var cmdErrors = cmdConfig.errors.filter(function (e) {
            if (typeof e.messageText === 'string') {
                var msg_1 = e.messageText;
                return !ngCmdLineOptions.some(function (o) { return msg_1.indexOf(o) >= 0; });
            }
            return true;
        });
        if (cmdErrors.length) {
            return {
                project: project,
                rootNames: [],
                options: cmdConfig.options,
                errors: cmdErrors,
                emitFlags: api.EmitFlags.Default
            };
        }
        var allDiagnostics = [];
        var config = perform_compile_1.readConfiguration(project, cmdConfig.options);
        var options = __assign({}, config.options, existingOptions);
        if (options.locale) {
            options.i18nInLocale = options.locale;
        }
        return {
            project: project,
            rootNames: config.rootNames, options: options,
            errors: config.errors,
            emitFlags: config.emitFlags
        };
    }
    exports.readCommandLineAndConfiguration = readCommandLineAndConfiguration;
    function reportErrorsAndExit(allDiagnostics, options, consoleError) {
        if (consoleError === void 0) { consoleError = console.error; }
        var errorsAndWarnings = perform_compile_1.filterErrorsAndWarnings(allDiagnostics);
        if (errorsAndWarnings.length) {
            var currentDir_1 = options ? options.basePath : undefined;
            var formatHost = {
                getCurrentDirectory: function () { return currentDir_1 || ts.sys.getCurrentDirectory(); },
                getCanonicalFileName: function (fileName) { return fileName; },
                getNewLine: function () { return ts.sys.newLine; }
            };
            consoleError(perform_compile_1.formatDiagnostics(errorsAndWarnings, formatHost));
        }
        return perform_compile_1.exitCodeFromResult(allDiagnostics);
    }
    function watchMode(project, options, consoleError) {
        return perform_watch_1.performWatchCompilation(perform_watch_1.createPerformWatchHost(project, function (diagnostics) {
            consoleError(perform_compile_1.formatDiagnostics(diagnostics));
        }, options, function (options) { return createEmitCallback(options); }));
    }
    exports.watchMode = watchMode;
    // CLI entry point
    if (require.main === module) {
        var args = process.argv.slice(2);
        process.exitCode = main(args);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQVVBLDRCQUEwQjtJQUUxQiwrQkFBaUM7SUFHakMsNkNBQW1DO0lBQ25DLHdFQUEwQztJQUUxQyw0RUFBb0Q7SUFFcEQscUZBQW9NO0lBQ3BNLGlGQUFnRjtJQUVoRixjQUNJLElBQWMsRUFBRSxZQUFpRCxFQUNqRSxNQUErQjtRQURmLDZCQUFBLEVBQUEsZUFBb0MsT0FBTyxDQUFDLEtBQUs7UUFFL0QsSUFBQSx1REFDa0QsRUFEakQsb0JBQU8sRUFBRSx3QkFBUyxFQUFFLG9CQUFPLEVBQUUsd0JBQW9CLEVBQUUsZ0JBQUssRUFBRSx3QkFBUyxDQUNqQjtRQUN2RCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDaEYsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUN6RCxNQUFNLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztRQUMvRSxDQUFDO1FBQ00sSUFBQSw0S0FBeUIsQ0FDZ0Q7UUFDaEYsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQWZELG9CQWVDO0lBR0QsNEJBQTRCLE9BQTRCO1FBQ3RELElBQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLGFB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QUFDLG1DQUFpQixDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDakUsQ0FBQztRQUNELE1BQU0sQ0FBQyxvQ0FBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsbUJBQ0ksT0FBZSxFQUFFLE9BQTRCLEVBQUUsWUFBaUM7UUFDbEYsTUFBTSxDQUFDLHVDQUF1QixDQUFDLHNDQUFzQixDQUFDLE9BQU8sRUFBRSxVQUFBLFdBQVc7WUFDeEUsWUFBWSxDQUFDLG1DQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFBLE9BQU8sSUFBSSxPQUFBLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxFQUEzQixDQUEyQixDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBTEQsOEJBS0M7SUFFRCxrQkFBa0I7SUFDbEIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzVCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIE11c3QgYmUgaW1wb3J0ZWQgZmlyc3QsIGJlY2F1c2UgQW5ndWxhciBkZWNvcmF0b3JzIHRocm93IG9uIGxvYWQuXG5pbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB0c2lja2xlIGZyb20gJ3RzaWNrbGUnO1xuaW1wb3J0ICogYXMgYXBpIGZyb20gJy4vdHJhbnNmb3JtZXJzL2FwaSc7XG5pbXBvcnQgKiBhcyBuZ2MgZnJvbSAnLi90cmFuc2Zvcm1lcnMvZW50cnlfcG9pbnRzJztcbmltcG9ydCB7R0VORVJBVEVEX0ZJTEVTfSBmcm9tICcuL3RyYW5zZm9ybWVycy91dGlsJztcblxuaW1wb3J0IHtleGl0Q29kZUZyb21SZXN1bHQsIHBlcmZvcm1Db21waWxhdGlvbiwgcmVhZENvbmZpZ3VyYXRpb24sIGZvcm1hdERpYWdub3N0aWNzLCBEaWFnbm9zdGljcywgUGFyc2VkQ29uZmlndXJhdGlvbiwgUGVyZm9ybUNvbXBpbGF0aW9uUmVzdWx0LCBmaWx0ZXJFcnJvcnNBbmRXYXJuaW5nc30gZnJvbSAnLi9wZXJmb3JtX2NvbXBpbGUnO1xuaW1wb3J0IHtwZXJmb3JtV2F0Y2hDb21waWxhdGlvbizCoGNyZWF0ZVBlcmZvcm1XYXRjaEhvc3R9IGZyb20gJy4vcGVyZm9ybV93YXRjaCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWluKFxuICAgIGFyZ3M6IHN0cmluZ1tdLCBjb25zb2xlRXJyb3I6IChzOiBzdHJpbmcpID0+IHZvaWQgPSBjb25zb2xlLmVycm9yLFxuICAgIGNvbmZpZz86IE5nY1BhcnNlZENvbmZpZ3VyYXRpb24pOiBudW1iZXIge1xuICBsZXQge3Byb2plY3QsIHJvb3ROYW1lcywgb3B0aW9ucywgZXJyb3JzOiBjb25maWdFcnJvcnMsIHdhdGNoLCBlbWl0RmxhZ3N9ID1cbiAgICAgIGNvbmZpZyB8fCByZWFkTmdjQ29tbWFuZExpbmVBbmRDb25maWd1cmF0aW9uKGFyZ3MpO1xuICBpZiAoY29uZmlnRXJyb3JzLmxlbmd0aCkge1xuICAgIHJldHVybiByZXBvcnRFcnJvcnNBbmRFeGl0KGNvbmZpZ0Vycm9ycywgLypvcHRpb25zKi8gdW5kZWZpbmVkLCBjb25zb2xlRXJyb3IpO1xuICB9XG4gIGlmICh3YXRjaCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHdhdGNoTW9kZShwcm9qZWN0LCBvcHRpb25zLCBjb25zb2xlRXJyb3IpO1xuICAgIHJldHVybiByZXBvcnRFcnJvcnNBbmRFeGl0KHJlc3VsdC5maXJzdENvbXBpbGVSZXN1bHQsIG9wdGlvbnMsIGNvbnNvbGVFcnJvcik7XG4gIH1cbiAgY29uc3Qge2RpYWdub3N0aWNzOiBjb21waWxlRGlhZ3N9ID0gcGVyZm9ybUNvbXBpbGF0aW9uKFxuICAgICAge3Jvb3ROYW1lcywgb3B0aW9ucywgZW1pdEZsYWdzLCBlbWl0Q2FsbGJhY2s6IGNyZWF0ZUVtaXRDYWxsYmFjayhvcHRpb25zKX0pO1xuICByZXR1cm4gcmVwb3J0RXJyb3JzQW5kRXhpdChjb21waWxlRGlhZ3MsIG9wdGlvbnMsIGNvbnNvbGVFcnJvcik7XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlRW1pdENhbGxiYWNrKG9wdGlvbnM6IGFwaS5Db21waWxlck9wdGlvbnMpOiBhcGkuVHNFbWl0Q2FsbGJhY2t8dW5kZWZpbmVkIHtcbiAgY29uc3QgdHJhbnNmb3JtRGVjb3JhdG9ycyA9IG9wdGlvbnMuYW5ub3RhdGlvbnNBcyAhPT0gJ2RlY29yYXRvcnMnO1xuICBjb25zdCB0cmFuc2Zvcm1UeXBlc1RvQ2xvc3VyZSA9IG9wdGlvbnMuYW5ub3RhdGVGb3JDbG9zdXJlQ29tcGlsZXI7XG4gIGlmICghdHJhbnNmb3JtRGVjb3JhdG9ycyAmJiAhdHJhbnNmb3JtVHlwZXNUb0Nsb3N1cmUpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGlmICh0cmFuc2Zvcm1EZWNvcmF0b3JzKSB7XG4gICAgLy8gVGhpcyBpcyBuZWVkZWQgYXMgYSB3b3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci90c2lja2xlL2lzc3Vlcy82MzVcbiAgICAvLyBPdGhlcndpc2UgdHNpY2tsZSBtaWdodCBlbWl0IHJlZmVyZW5jZXMgdG8gbm9uIGltcG9ydGVkIHZhbHVlc1xuICAgIC8vIGFzIFR5cGVTY3JpcHQgZWxpZGVkIHRoZSBpbXBvcnQuXG4gICAgb3B0aW9ucy5lbWl0RGVjb3JhdG9yTWV0YWRhdGEgPSB0cnVlO1xuICB9XG4gIGNvbnN0IHRzaWNrbGVIb3N0OiBQaWNrPFxuICAgICAgdHNpY2tsZS5Uc2lja2xlSG9zdCwgJ3Nob3VsZFNraXBUc2lja2xlUHJvY2Vzc2luZyd8J3BhdGhUb01vZHVsZU5hbWUnfFxuICAgICAgJ3Nob3VsZElnbm9yZVdhcm5pbmdzRm9yUGF0aCd8J2ZpbGVOYW1lVG9Nb2R1bGVJZCd8J2dvb2dtb2R1bGUnfCd1bnR5cGVkJ3xcbiAgICAgICdjb252ZXJ0SW5kZXhJbXBvcnRTaG9ydGhhbmQnfCd0cmFuc2Zvcm1EZWNvcmF0b3JzJ3wndHJhbnNmb3JtVHlwZXNUb0Nsb3N1cmUnPiA9IHtcbiAgICBzaG91bGRTa2lwVHNpY2tsZVByb2Nlc3Npbmc6IChmaWxlTmFtZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvXFwuZFxcLnRzJC8udGVzdChmaWxlTmFtZSkgfHwgR0VORVJBVEVEX0ZJTEVTLnRlc3QoZmlsZU5hbWUpLFxuICAgIHBhdGhUb01vZHVsZU5hbWU6IChjb250ZXh0LCBpbXBvcnRQYXRoKSA9PiAnJyxcbiAgICBzaG91bGRJZ25vcmVXYXJuaW5nc0ZvclBhdGg6IChmaWxlUGF0aCkgPT4gZmFsc2UsXG4gICAgZmlsZU5hbWVUb01vZHVsZUlkOiAoZmlsZU5hbWUpID0+IGZpbGVOYW1lLFxuICAgIGdvb2dtb2R1bGU6IGZhbHNlLFxuICAgIHVudHlwZWQ6IHRydWUsXG4gICAgY29udmVydEluZGV4SW1wb3J0U2hvcnRoYW5kOiBmYWxzZSwgdHJhbnNmb3JtRGVjb3JhdG9ycywgdHJhbnNmb3JtVHlwZXNUb0Nsb3N1cmUsXG4gIH07XG5cbiAgcmV0dXJuICh7XG4gICAgICAgICAgIHByb2dyYW0sXG4gICAgICAgICAgIHRhcmdldFNvdXJjZUZpbGUsXG4gICAgICAgICAgIHdyaXRlRmlsZSxcbiAgICAgICAgICAgY2FuY2VsbGF0aW9uVG9rZW4sXG4gICAgICAgICAgIGVtaXRPbmx5RHRzRmlsZXMsXG4gICAgICAgICAgIGN1c3RvbVRyYW5zZm9ybWVycyA9IHt9LFxuICAgICAgICAgICBob3N0LFxuICAgICAgICAgICBvcHRpb25zXG4gICAgICAgICB9KSA9PlxuICAgICAgICAgICAgIHRzaWNrbGUuZW1pdFdpdGhUc2lja2xlKFxuICAgICAgICAgICAgICAgICBwcm9ncmFtLCB7Li4udHNpY2tsZUhvc3QsIG9wdGlvbnMsIGhvc3R9LCBob3N0LCBvcHRpb25zLCB0YXJnZXRTb3VyY2VGaWxlLFxuICAgICAgICAgICAgICAgICB3cml0ZUZpbGUsIGNhbmNlbGxhdGlvblRva2VuLCBlbWl0T25seUR0c0ZpbGVzLCB7XG4gICAgICAgICAgICAgICAgICAgYmVmb3JlVHM6IGN1c3RvbVRyYW5zZm9ybWVycy5iZWZvcmUsXG4gICAgICAgICAgICAgICAgICAgYWZ0ZXJUczogY3VzdG9tVHJhbnNmb3JtZXJzLmFmdGVyLFxuICAgICAgICAgICAgICAgICB9KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOZ2NQYXJzZWRDb25maWd1cmF0aW9uIGV4dGVuZHMgUGFyc2VkQ29uZmlndXJhdGlvbiB7IHdhdGNoPzogYm9vbGVhbjsgfVxuXG5mdW5jdGlvbiByZWFkTmdjQ29tbWFuZExpbmVBbmRDb25maWd1cmF0aW9uKGFyZ3M6IHN0cmluZ1tdKTogTmdjUGFyc2VkQ29uZmlndXJhdGlvbiB7XG4gIGNvbnN0IG9wdGlvbnM6IGFwaS5Db21waWxlck9wdGlvbnMgPSB7fTtcbiAgY29uc3QgcGFyc2VkQXJncyA9IHJlcXVpcmUoJ21pbmltaXN0JykoYXJncyk7XG4gIGlmIChwYXJzZWRBcmdzLmkxOG5GaWxlKSBvcHRpb25zLmkxOG5JbkZpbGUgPSBwYXJzZWRBcmdzLmkxOG5GaWxlO1xuICBpZiAocGFyc2VkQXJncy5pMThuRm9ybWF0KSBvcHRpb25zLmkxOG5JbkZvcm1hdCA9IHBhcnNlZEFyZ3MuaTE4bkZvcm1hdDtcbiAgaWYgKHBhcnNlZEFyZ3MubG9jYWxlKSBvcHRpb25zLmkxOG5JbkxvY2FsZSA9IHBhcnNlZEFyZ3MubG9jYWxlO1xuICBjb25zdCBtdCA9IHBhcnNlZEFyZ3MubWlzc2luZ1RyYW5zbGF0aW9uO1xuICBpZiAobXQgPT09ICdlcnJvcicgfHwgbXQgPT09ICd3YXJuaW5nJyB8fCBtdCA9PT0gJ2lnbm9yZScpIHtcbiAgICBvcHRpb25zLmkxOG5Jbk1pc3NpbmdUcmFuc2xhdGlvbnMgPSBtdDtcbiAgfVxuICBjb25zdCBjb25maWcgPSByZWFkQ29tbWFuZExpbmVBbmRDb25maWd1cmF0aW9uKFxuICAgICAgYXJncywgb3B0aW9ucywgWydpMThuRmlsZScsICdpMThuRm9ybWF0JywgJ2xvY2FsZScsICdtaXNzaW5nVHJhbnNsYXRpb24nLCAnd2F0Y2gnXSk7XG4gIGNvbnN0IHdhdGNoID0gcGFyc2VkQXJncy53IHx8IHBhcnNlZEFyZ3Mud2F0Y2g7XG4gIHJldHVybiB7Li4uY29uZmlnLCB3YXRjaH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWFkQ29tbWFuZExpbmVBbmRDb25maWd1cmF0aW9uKFxuICAgIGFyZ3M6IHN0cmluZ1tdLCBleGlzdGluZ09wdGlvbnM6IGFwaS5Db21waWxlck9wdGlvbnMgPSB7fSxcbiAgICBuZ0NtZExpbmVPcHRpb25zOiBzdHJpbmdbXSA9IFtdKTogUGFyc2VkQ29uZmlndXJhdGlvbiB7XG4gIGxldCBjbWRDb25maWcgPSB0cy5wYXJzZUNvbW1hbmRMaW5lKGFyZ3MpO1xuICBjb25zdCBwcm9qZWN0ID0gY21kQ29uZmlnLm9wdGlvbnMucHJvamVjdCB8fCAnLic7XG4gIGNvbnN0IGNtZEVycm9ycyA9IGNtZENvbmZpZy5lcnJvcnMuZmlsdGVyKGUgPT4ge1xuICAgIGlmICh0eXBlb2YgZS5tZXNzYWdlVGV4dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IG1zZyA9IGUubWVzc2FnZVRleHQ7XG4gICAgICByZXR1cm4gIW5nQ21kTGluZU9wdGlvbnMuc29tZShvID0+IG1zZy5pbmRleE9mKG8pID49IDApO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG4gIGlmIChjbWRFcnJvcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb2plY3QsXG4gICAgICByb290TmFtZXM6IFtdLFxuICAgICAgb3B0aW9uczogY21kQ29uZmlnLm9wdGlvbnMsXG4gICAgICBlcnJvcnM6IGNtZEVycm9ycyxcbiAgICAgIGVtaXRGbGFnczogYXBpLkVtaXRGbGFncy5EZWZhdWx0XG4gICAgfTtcbiAgfVxuICBjb25zdCBhbGxEaWFnbm9zdGljczogRGlhZ25vc3RpY3MgPSBbXTtcbiAgY29uc3QgY29uZmlnID0gcmVhZENvbmZpZ3VyYXRpb24ocHJvamVjdCwgY21kQ29uZmlnLm9wdGlvbnMpO1xuICBjb25zdCBvcHRpb25zID0gey4uLmNvbmZpZy5vcHRpb25zLCAuLi5leGlzdGluZ09wdGlvbnN9O1xuICBpZiAob3B0aW9ucy5sb2NhbGUpIHtcbiAgICBvcHRpb25zLmkxOG5JbkxvY2FsZSA9IG9wdGlvbnMubG9jYWxlO1xuICB9XG4gIHJldHVybiB7XG4gICAgcHJvamVjdCxcbiAgICByb290TmFtZXM6IGNvbmZpZy5yb290TmFtZXMsIG9wdGlvbnMsXG4gICAgZXJyb3JzOiBjb25maWcuZXJyb3JzLFxuICAgIGVtaXRGbGFnczogY29uZmlnLmVtaXRGbGFnc1xuICB9O1xufVxuXG5mdW5jdGlvbiByZXBvcnRFcnJvcnNBbmRFeGl0KFxuICAgIGFsbERpYWdub3N0aWNzOiBEaWFnbm9zdGljcywgb3B0aW9ucz86IGFwaS5Db21waWxlck9wdGlvbnMsXG4gICAgY29uc29sZUVycm9yOiAoczogc3RyaW5nKSA9PiB2b2lkID0gY29uc29sZS5lcnJvcik6IG51bWJlciB7XG4gIGNvbnN0IGVycm9yc0FuZFdhcm5pbmdzID0gZmlsdGVyRXJyb3JzQW5kV2FybmluZ3MoYWxsRGlhZ25vc3RpY3MpO1xuICBpZiAoZXJyb3JzQW5kV2FybmluZ3MubGVuZ3RoKSB7XG4gICAgbGV0IGN1cnJlbnREaXIgPSBvcHRpb25zID8gb3B0aW9ucy5iYXNlUGF0aCA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCBmb3JtYXRIb3N0OiB0cy5Gb3JtYXREaWFnbm9zdGljc0hvc3QgPSB7XG4gICAgICBnZXRDdXJyZW50RGlyZWN0b3J5OiAoKSA9PiBjdXJyZW50RGlyIHx8IHRzLnN5cy5nZXRDdXJyZW50RGlyZWN0b3J5KCksXG4gICAgICBnZXRDYW5vbmljYWxGaWxlTmFtZTogZmlsZU5hbWUgPT4gZmlsZU5hbWUsXG4gICAgICBnZXROZXdMaW5lOiAoKSA9PiB0cy5zeXMubmV3TGluZVxuICAgIH07XG4gICAgY29uc29sZUVycm9yKGZvcm1hdERpYWdub3N0aWNzKGVycm9yc0FuZFdhcm5pbmdzLCBmb3JtYXRIb3N0KSk7XG4gIH1cbiAgcmV0dXJuIGV4aXRDb2RlRnJvbVJlc3VsdChhbGxEaWFnbm9zdGljcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YXRjaE1vZGUoXG4gICAgcHJvamVjdDogc3RyaW5nLCBvcHRpb25zOiBhcGkuQ29tcGlsZXJPcHRpb25zLCBjb25zb2xlRXJyb3I6IChzOiBzdHJpbmcpID0+IHZvaWQpIHtcbiAgcmV0dXJuIHBlcmZvcm1XYXRjaENvbXBpbGF0aW9uKGNyZWF0ZVBlcmZvcm1XYXRjaEhvc3QocHJvamVjdCwgZGlhZ25vc3RpY3MgPT4ge1xuICAgIGNvbnNvbGVFcnJvcihmb3JtYXREaWFnbm9zdGljcyhkaWFnbm9zdGljcykpO1xuICB9LCBvcHRpb25zLCBvcHRpb25zID0+IGNyZWF0ZUVtaXRDYWxsYmFjayhvcHRpb25zKSkpO1xufVxuXG4vLyBDTEkgZW50cnkgcG9pbnRcbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICBjb25zdCBhcmdzID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpO1xuICBwcm9jZXNzLmV4aXRDb2RlID0gbWFpbihhcmdzKTtcbn1cbiJdfQ==