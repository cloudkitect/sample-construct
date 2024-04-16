import { javascript } from "projen";
import { monorepo } from "@aws/pdk";
import {AwsCdkConstructLibrary} from "projen/lib/awscdk";

const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "sample-construct",
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,
  release: true,
  github: true,
  githubOptions: {
    mergify: false
  },
  pnpmVersion: "8",

});

const components = new AwsCdkConstructLibrary({
  authorAddress: "support@cloudkitect.com",
  parent: project,
  defaultReleaseBranch: 'main',
  cdkVersion: '2.137.0',
  constructsVersion: '10.3.0',
  author: 'CloudKitect Inc',
  authorOrganization: true,
  repositoryUrl: 'https://github.com/cloudkitect/sample-construct',
  jsiiVersion: '~5.3.0',
  name: `@cloudkitect/sample-construct`,
  outdir: `packages/sample-construct`,
  packageManager: project.package.packageManager,
  github: true,
  release: true,
  buildWorkflow: true,
  githubOptions: {
    mergify: false,
  },
  pnpmVersion: "8",
});
components.synth()

const exclusions = ['.DS_Store', '.idea', '*.iml']
project.gitignore.exclude(...exclusions)
project.synth();