"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var TypeDoc = require("typedoc");
var path = require("path");
var child_process_1 = require("child_process");
var fs_1 = require("fs");
/**
 * Exports API references using TypeDoc.
 */
var ApiReferenceExporter = /** @class */ (function () {
    /**
     * @param pkg - Lerna package information.
     * @param config - Configuration options for TypeDoc.
     * @param settings - Additional custom settings, eg. `includeOpenAPIDoc`
     */
    function ApiReferenceExporter(pkg, config, settings) {
        if (settings === void 0) { settings = {}; }
        var _this = this;
        var _a;
        this.pkg = pkg;
        this.config = config;
        this.settings = settings;
        /**
         * Universal configuration options for TypeDoc.
         */
        this.universalConfig = {
            excludeExternals: true,
            logLevel: 'Error'
        };
        this.app = new TypeDoc.Application();
        this.app.options.addReader(new TypeDoc.TSConfigReader());
        Object.assign(this.config, __assign(__assign({}, this.universalConfig), { tsconfig: path.resolve(this.pkg.location, (_a = this.config.tsconfig) !== null && _a !== void 0 ? _a : 'tsconfig.json'), entryPoints: this.config.entryPoints.map(function (filePath) {
                return path.resolve(_this.pkg.location, filePath);
            }) }));
    }
    /**
     * Runs the exporter.
     */
    ApiReferenceExporter.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var project, outputDir, openAPIDocFile, openAPIContent, lines, frontMatterEndsAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.app.bootstrap(this.config);
                        project = this.app.convert();
                        if (!project) {
                            throw new Error('Typedoc project reflection is not converted correctly.');
                        }
                        outputDir = path.resolve(__dirname, 'docs', this.config.out);
                        // Generate docs
                        return [4 /*yield*/, this.app.generateDocs(project, outputDir)];
                    case 1:
                        // Generate docs
                        _a.sent();
                        // Post export
                        if (this.settings.includeOpenAPIDoc) {
                            openAPIDocFile = path.resolve(this.pkg.location, 'openapi.md');
                            if (!(0, fs_1.existsSync)(openAPIDocFile)) {
                                throw new Error('openapi.md is missing in '.concat(this.pkg.name));
                            }
                            openAPIContent = (0, fs_1.readFileSync)(openAPIDocFile, 'utf-8');
                            lines = openAPIContent.split('\n');
                            frontMatterEndsAt = 15;
                            lines.splice(0, frontMatterEndsAt);
                            // join the remaining lines back into a string
                            openAPIContent = lines.join('\n');
                            // fix language name in codeblocks
                            openAPIContent = openAPIContent.replace(/```.javascript--nodejs/gm, '```js');
                            // write openapi.md to `outputDir`
                            (0, fs_1.writeFileSync)(path.resolve(outputDir, 'openapi.md'), openAPIContent);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return ApiReferenceExporter;
}());
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var packages, _i, packages_1, pkg, packageJson, exporter;
        return __generator(this, function (_a) {
            var _b;
            switch (_a.label) {
                case 0:
                    packages = JSON.parse((0, child_process_1.execSync)("npx lerna ls --json --loglevel silent").toString());
                    _i = 0, packages_1 = packages;
                    _a.label = 1;
                case 1:
                    if (!(_i < packages_1.length)) return [3 /*break*/, 5];
                    pkg = packages_1[_i];
                    return [4 /*yield*/, (_b = path.resolve(pkg.location, 'package.json'), Promise.resolve().then(function () { return require(_b); }))];
                case 2:
                    packageJson = _a.sent();
                    if (packageJson.typedoc === undefined ||
                        packageJson.typedoc.config === undefined) {
                        return [3 /*break*/, 4];
                    }
                    exporter = new ApiReferenceExporter(pkg, packageJson.typedoc.config, packageJson.typedoc.settings);
                    return [4 /*yield*/, exporter.run()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
main();
