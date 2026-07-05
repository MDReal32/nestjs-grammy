require("reflect-metadata");
const { expect } = require("expect");
const { registerGrammyMatchers } = require("../build/matchers.cjs");

registerGrammyMatchers(expect);
