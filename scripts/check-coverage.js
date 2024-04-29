import { schema } from '../index.js';
import { readFileSync } from 'fs';

const checkCoverage = (definitions, file) => {
  let flag = false;
  Object.entries(definitions).forEach(([key]) => {
    const script = readFileSync(file).toString();
    if (script.indexOf("describe('" + key) == -1) {
      console.error('not covered by tests:', key);
      flag = true;
    }
  });
  if (flag) {
    throw new Error("Coverage not complete!");
  }
};

checkCoverage(schema.definitions, './test/babbage.js');
