import {javascript, ReleasableCommits, TextFile} from "projen";
import {monorepo} from "@aws/pdk";
import {AwsCdkConstructLibrary} from "projen/lib/awscdk";
import {CodeArtifactAuthProvider} from "projen/lib/release/publisher";

const licenseConfig = {
  licensed: false,
  licenseOptions: {
    copyrightOwner: 'CloudKitect Inc',
    licenseText: 'CloudKitect All Rights Reserved',
    disableDefaultLicenses: true,
  }
}

const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "sample-construct",
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,
  github: true,
  githubOptions: {
    mergify: false
  },
  pnpmVersion: "9",
  workspaceConfig: {
    linkLocalWorkspaceBins: true,
  },
  pullRequestTemplateContents: [
    "## What is this PR for?",
    "",
    "## What type of PR is it?",
    "",
    "- [ ] Bug fix",
    "- [ ] Feature",
    "- [ ] Documentation update",
    "- [ ] Other, please describe:",
    "",
    "## What is the new behavior?",
    "",
    "## Does this PR introduce a breaking change?",
    "",
    "- [ ] Yes",
    "- [ ] No",
    "",
    "## Other information",
    "",
    "## Checklist:",
    "",
    "- [ ] Code review",
    "- [ ] Tests",
    "- [ ] Documentation",
    "",
  ],
  ...licenseConfig
});

const subProjectSettings = {
  authorAddress: "support@example.com",
  parent: project,
  defaultReleaseBranch: 'main',
  cdkVersion: '2.138.0',
  constructsVersion: '10.3.0',
  author: 'CloudKitect',
  authorOrganization: true,
  repositoryUrl: 'https://github.com/cloudkitect/sample-construct',
  jsiiVersion: '~5.3.0',
  packageManager: project.package.packageManager,
  github: true,
  release: true,
  buildWorkflow: true,
  githubOptions: {
    mergify: false,
  },
  majorVersion: 1,
  releasableCommits: ReleasableCommits.featuresAndFixes(),
  pnpmVersion: "9",
  ...licenseConfig
}

const components = new AwsCdkConstructLibrary({
  ...subProjectSettings,
  description: "Sample constructs",
  name: `@cloudkitect/sample-construct`,
  outdir: `packages/sample-construct`,
});

// const awsSetup = {
//   name: 'Configure aws credentials',
//   uses: 'aws-actions/configure-aws-credentials@v1',
//   with: {
//     'aws-region': 'us-east-1' ,
//     'role-to-assume': 'arn:aws:iam::053336355397:role/GithubRole-RepositoryPublisherRole-Ou627tXHJL0P',
//     'role-session-name': 'RepoPublishPackage',
//     'role-duration-seconds': 900
//   }
// }
//https://my_domain-111122223333.d.codeartifact.us-west-2.amazonaws.com/npm/my_repo/

const registryEndPoint: string = "cloudkitect-053336355397.d.codeartifact.us-east-1.amazonaws.com/npm/cloudkitect-artifacts/"

project.npmrc.addRegistry(registryEndPoint);
project.npmrc.addConfig('//cloudkitect-053336355397.d.codeartifact.us-east-1.amazonaws.com/npm/cloudkitect-artifacts/:_authToken', '${CODEARTIFACT_AUTH_TOKEN}');
project.npmrc.addConfig('//cloudkitect-053336355397.d.codeartifact.us-east-1.amazonaws.com/npm/cloudkitect-artifacts/:always-auth', 'true');



components.release?.publisher.publishToNpm({
  registry: registryEndPoint,
  codeArtifactOptions: {
    roleToAssume: 'arn:aws:iam::053336355397:role/GithubRole-RepositoryPublisherRole-Ou627tXHJL0P',
    authProvider: CodeArtifactAuthProvider.GITHUB_OIDC
  }
})

const licenseText = 'CloudKitect. Commercial License, All Rights Reserved'
new TextFile(components, 'LICENSE', {
  lines: [licenseText]
})

components.synth()

const releaseYaml = project.tryFindObjectFile('.github/workflows/release_cloudkitect-sample-construct.yml');
releaseYaml!.addOverride('jobs.release_npm.steps.5.run', 'cd .repo && pnpm i --no-frozen-lockfile')

const patterns = new AwsCdkConstructLibrary({
  ...subProjectSettings,
  description: 'Sample patterns',
  name: `@cloudkitect/sample-pattern`,
  outdir: `packages/sample-pattern`,
});

new TextFile(patterns, 'LICENSE', {
  lines: [licenseText]
})

patterns.synth()

const releaseYaml2 = project.tryFindObjectFile('.github/workflows/release_cloudkitect-sample-pattern.yml');
releaseYaml2!.addOverride('jobs.release_npm.steps.5.run', 'cd .repo && pnpm i --no-frozen-lockfile')

const exclusions = ['.DS_Store', '.idea', '*.iml']
project.gitignore.exclude(...exclusions)
project.synth();