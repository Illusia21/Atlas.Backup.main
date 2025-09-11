# Dev Environment
```bash
git clone https://github.com/MCM-CSS/atlas.accounting.web.git
cd atlas.accounting.web
npm install
npm run dev
```
# Github Workflow
## Create a branch!
```bash
git fetch origin main
git checkout -b <ticket id> origin/main
```
## Pushing your changes
_Please refer to [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) for the format of your commit messages_
```bash
git add .
git commit -m "your message here"
git push origin <current branch name>
```
1. Create a PR (Pull Request)
2. Move the ticket to "For review" column
3. In case of errors:
```bash
git push origin <current branch name> --force
```
## Branch behind? do rebase!
Do this first before pushing your changes if you are behind!
```bash
git fetch origin main
git rebase origin/main
```
Stash if you can't rebase
```bash
git stash
git fetch origin main
git rebase origin/main
git stash pop
```
**_Fix possible merge conflicts_**

After fixing conflicts
```bash
git push origin <current branch name> --force
```
***WARNING: Always ask the last person who made changes on a conflict file to know which lines of code are okay to overwrite***
## Still in main branch?
Move to a remote branch
```bash
git checkout -b <ticket id> origin/main
```
If you can't move, stash!
```bash
git stash
git checkout -b <ticket id> origin/main
git stash pop
```
## Dependent branches
If a branch is dependent on an un-merged branch you can run
```bash
git fetch origin <dependent branch name>
git rebase origin/<dependent branch name>
```
If you're still in **main** branch 
```bash
git checkout -b <ticket id> origin/<dependent branch name>
```
**_1 ticket 1 branch rule, make sure to only have 1 branch for each ticket for easier monitoring and reviews_**

_Workflow by Sam Dacara_