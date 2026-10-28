module.exports = {
  rootDir: "../../src",
  moduleFileExtensions: ["js", "json", "ts"],
  testEnvironment: "node",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    // grammY v2 ships ESM only; compile it (and its @jsr dependencies) to CommonJS for Jest
    "/node_modules/.+\\.js$": ["ts-jest", { tsconfig: { allowJs: true, module: "commonjs", target: "es2022" } }],
    "^.+\\.(t|j)s$": ["ts-jest", { tsconfig: "<rootDir>/../tsconfig.json" }]
  },
  transformIgnorePatterns: ["/node_modules/(?!(grammy|@jsr)/)"],
  setupFilesAfterEnv: ["@mdreal/nestjs-grammy-testing/jest"]
};
