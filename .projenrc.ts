import { javascript } from "projen";
import { monorepo } from "@aws/pdk";

const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "sample-construct",
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,
  buildWorkflow: true,
  release: true,
  github: true,
  githubOptions: {
    mergify: false
  },
  pnpmVersion: "8",
});

const exclusions = ['.DS_Store', '.idea', '*.iml']
project.gitignore.exclude(...exclusions)
project.synth();