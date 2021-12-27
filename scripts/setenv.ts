// @ts-nocheck
const { writeFile } = require('fs');
const { argv } = require('yargs');
require('dotenv').config();

const envKey = 'FD_';
const configuration = argv.configuration;
const isProduction = configuration === 'prod';
const targetPath = isProduction
  ? `./src/environments/environment.prod.ts`
  : `./src/environments/environment.ts`;

// @ts-ignore
const env = Object.keys(process.env)
  .filter(key => {
    return key.startsWith(envKey);
  })
  .reduce((result: any, key: string) => {
    result[key.replace(envKey, '')] = JSON.stringify(process.env[key]);

    return result;
  }, {});

let environmentFileContent = `export const environment = {
  production: ${ isProduction },`;

Object.keys(env)
  .forEach(key => {
    environmentFileContent = `${ environmentFileContent }
  ${ key }: ${ env[key] },`;
  });

environmentFileContent = `${ environmentFileContent }
};
`;

writeFile(targetPath, environmentFileContent, (err: any) => {
  if (err) {
    console.log(err);
  }
  console.log(`Wrote variables to ${ targetPath }`);
});
