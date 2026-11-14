// grammY v2 and NestJS 12 ship ESM only: the test scripts run Jest with --experimental-vm-modules, so it loads them
// natively through require(esm) and only this project's own .ts files need ts-jest.
module.exports = {
  rootDir: "../../src",
  moduleFileExtensions: ["js", "json", "ts"],
  testEnvironment: "node",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/../tsconfig.json" }]
  },
  setupFilesAfterEnv: ["@mdreal/nestjs-grammy-testing/jest"]
};
