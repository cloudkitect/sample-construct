import {javascript} from "projen";
import {monorepo} from "@aws/pdk";
import {AwsCdkConstructLibrary} from "projen/lib/awscdk";
import {NpmAccess} from "projen/lib/javascript";

const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "sample-construct",
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,
  github: true,
  githubOptions: {
    mergify: false
  },
  pnpmVersion: "8",
  workspaceConfig: {
    linkLocalWorkspaceBins: true,
  },
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
  npmAccess: NpmAccess.PUBLIC,
  npmProvenance: false,
});
components.synth()


const releaseYaml = project.tryFindObjectFile('.github/workflows/release_cloudkitect-sample-construct.yml');
releaseYaml!.addOverride('jobs.release_npm.steps.5.run', 'cd .repo && pnpm i --no-frozen-lockfile')


const patterns = new AwsCdkConstructLibrary({
  authorAddress: "support@cloudkitect.com",
  parent: project,
  defaultReleaseBranch: 'main',
  cdkVersion: '2.137.0',
  constructsVersion: '10.3.0',
  author: 'CloudKitect Inc',
  authorOrganization: true,
  repositoryUrl: 'https://github.com/cloudkitect/sample-construct',
  jsiiVersion: '~5.3.0',
  name: `@cloudkitect/sample-pattern`,
  outdir: `packages/sample-pattern`,
  packageManager: project.package.packageManager,
  github: true,
  release: true,
  buildWorkflow: true,
  npmAccess: NpmAccess.PUBLIC,
  npmProvenance: false,
  githubOptions: {
    mergify: false,
  },
  pnpmVersion: "8",
});
patterns.synth()

const releaseYaml2 = project.tryFindObjectFile('.github/workflows/release_cloudkitect-sample-pattern.yml');
releaseYaml2!.addOverride('jobs.release_npm.steps.5.run', 'cd .repo && pnpm i --no-frozen-lockfile')

const exclusions = ['.DS_Store', '.idea', '*.iml']
project.gitignore.exclude(...exclusions)
project.synth();