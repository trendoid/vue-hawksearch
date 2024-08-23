# Contributing to HawkSearch Vue SDK 

## Releasing pathes (hotfixes)

Let's say, we are releasing a new release 0.9.107. The latest one is 0.9.106.

- `git checkout master`
- `git branch hotfix/0.9.107`
- Create a release PR from `hotfix/0.9.107` branch to `master` branch on GitHub
- Draft a new release on GitHub:
    - Set title to **0.9.107**
    - Choose tag: add new tag **v0.9.107** on publish
    - Target branch: **hotfix/0.9.107**
    - Previous tag: **v0.9.106**
    - Auto generate release notes
    - Update "What's Changed" section based on actual commits/PRs
    - Save release as draft
- Create pull requests from feature branches to `hotfix/0.9.107` branch
- Merge pull requests to  `hotfix/0.9.107` branch
- Push a release preparation commit:
    - update `version` in `package.json` to "0.9.107"
    - build dist from sources `npm run release`
    - commit to `hotfix/0.9.107` branch and push to remote
- Review release description on GitHub and update "What's Changed" section based on actual commits/PRs
- Publish release on GitHub. A new tag **v0.9.107** will be created on `hotfix/0.9.107` branch
- Merge a release PR from `hotfix/0.9.107` to `master`
- Remove `hotfix/0.9.107` branch
- Merge `master` branch to `develop` with fast-forward strategy, if possible
