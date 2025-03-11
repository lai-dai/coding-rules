<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

# Table of content
- [Table of content](#table-of-content)
- [Rules for operations on the Frontend](#rules-for-operations-on-the-frontend)
  - [🏗️ Issue and Pull Request](#️-issue-and-pull-request)
  - [🎨 Working with CSS](#-working-with-css)
    - [TailwindCSS class naming convention](#tailwindcss-class-naming-convention)
      - [Choosing which unit to use for css](#choosing-which-unit-to-use-for-css)
      - [Using media breakpoints](#using-media-breakpoints)
      - [Logical Properties](#logical-properties)
      - [DO NOT use `!important`](#do-not-use-important)
  - [ESLint Rules](#eslint-rules)
  - [Git flow](#git-flow)
    - [Common rules](#common-rules)
    - [The Rule to Name Branch](#the-rule-to-name-branch)
    - [How to create branches and pull requests etc](#how-to-create-branches-and-pull-requests-etc)

<!-- TOC end -->

<!-- TOC --><a name="rules-for-operations-on-the-frontend"></a>
# Rules for operations on the Frontend

<!-- TOC --><a name="-issue-and-pull-request"></a>
## 🏗️ Issue and Pull Request
Before doing a task, you should create an issue to describe the problem first. After that, you can link your Pull Request with the respective issue.

Ideally, one PR should only close one issue. It's best if you can keep the PR small, because it will help the reviewers to review your code, which in turn will help your PR get merged faster. If you're unsure how to proceed, please don't hesitate to ask other members.

> Yêu cầu thêm người reviewers cho các pull request change, bạn có thể merge nếu như reivewer appoved pull request của bạn

<!-- TOC --><a name="-working-with-css"></a>
## 🎨 Working with CSS
<!-- TOC --><a name="choosing-which-unit-to-use"></a>
### TailwindCSS class naming convention
Example: <div className="home-banner | container flex justify-center ... | <other-class>"></div>

#### Choosing which unit to use for css
If you are changing line-height, please use a unitless value. If you are specifying the value of letter-spacing, please use em. Following this, the value will scale properly with the font-size, we don't need to specify them again when the font-size changes.

Other than the values that were stated above, you should use rem for everything.

There will be time when you need a small value that does not look good when converting to rem (1px = 0.0625rem). We use two custom properties for cases like this:

```css
:root {
  --size-thinnest: 1px;
}
```

<!-- TOC --><a name="using-media-breakpoints"></a>
#### Using media breakpoints
We use three breakpoints for our projects:

* 30rem (480px)
* 48rem (768px)
* 60rem (960px)
* 90rem (1440px)

<!-- TOC --><a name="logical-properties"></a>
#### Logical Properties
Logical properties are preferred over normal properties. Simply saying, using logical properties is just opting for `margin-block-start` instead of `margin-top`, or using `padding-inline-end` instead of `padding-right`.

Please use them whenever possible. If there's a situation in which you think that normal properties are better, please do tell us your reasons.

<!-- TOC --><a name="do-not-use-important"></a>
#### DO NOT use `!important`
If you have some experiences in CSS, you will probably know why we should avoid this keyword. In short, in breaks CSS specificity (or cascading order). We prohibit this keyword.

<!-- TOC --><a name="eslint-rules"></a>
## ESLint Rules
* `indent-in-infix-expression`
* `newline-per-parameter`
* `no-else-if`
* `no-if-in-oneline`
* `no-unexpected-multiline`
* Not allowed to use `Data`, `Info`, `Item`, `List`,  `Manager` as suffix of identifier.
* ...

<!-- TOC --><a name="git-flow"></a>
## Git flow
<!-- TOC --><a name="common-rules"></a>
### Common rules
* We use `git rebase` instead of `git merge`. If your `sub1` branch have merge commit from `sub2`, please use `git rebase -r` (`-r` mean keep merge commit) instead of `git rebase`. Please `git fetch` and `git rebase` before create Pull Resquest
* If you have an big feature or big tasks, please break down the task and create a list of issues task in your issue
* If you start doing a big task please use this follow branching:
```
dev -> feature/customer
// From feature/customer create sub2,... branch:
-> feature/customer-add
-> feature/customer-update
// After done one task please create PR into feature/customer branch
// After merged please `git fetch` and checkout from feature/customer and do again for the next task

// Git graphqh will look like this if done correctly:
||
||
||
||\\ Merged pull request from #xx feature/customer
|| \\
||  ||\\
||  || || feature/customer/update
||  ||//
||  ||\\
||  || || feature/customer/add
||  ||//
|| //
||// feature/customer (Start logic customer)
||
||
dev
```
* When create a merge pull request, alway note infomation of issue (ID) and screenshots (if nesscesary) to reduce reviewing time
Example markdown information for Pull Request:
```markdown
# Why
* To close #123

# Notes
* Some notes about the issue

# Screenshots
* Before: 📷
* After: 📷
```
* Always delete branch and close the issue after merge Pull Request (If have a new problem, please create a new issue)
* Always create a new issue and Pull Request for install new package (Please also ask everyone to consider allow to add new package)

<!-- TOC --><a name="the-rule-to-name-branch"></a>
### The Rule to Name Branch

| prefix | description |
|--------|-------------|
| feature | Branch for adding new features. For example, feature/user-authentication is a branch used for adding a user authentication feature. |
| fix | Branch for bug fixes. For instance, fix/issue-123 is a branch used for fixing issue number 123. |
| hotfix |Branch for critical bug fixes that need to be addressed urgently. |
| chore | Branch for miscellaneous maintenance tasks or changes to build scripts. For example, chore/update-dependencies is a branch used for updating dependencies. |
| docs | Branch for documentation changes or additions. For instance, docs/update-readme is a branch used for updating the README. |
| style | Branch for changes related to the user interface or styling. For example, style/update-landing-page is a branch used for making changes to the landing page design. |
| test | Branch for adding or modifying test code. For example, test/add-login-tests is a branch used for adding test code for the login functionality. |
| refactor | Branch for code refactoring. For instance, refactor/remove-legacy-code is a branch used for removing old or legacy code. |
| release |	Branch for releases. For example, release/v1.2.0 is a branch used for the release of version 1.2.0. |

<!-- TOC --><a name="how-to-create-branches-and-pull-requests-etc"></a>
### How to create branches and pull requests etc
1. Create a branch (for instance:`feature/logic-customer`) for main task from dev branch

2. Switch to that branch(`feature/logic-customer`)

3. Create an empty commit to start your main task
The above commit works when other sub tasks commits are later rebased
git command is something like this
```
git commit --allow-empty -m "Start to XXX"
```
4. Create branches for a sub1 task(for instance:`feature/logic-customer-add`) from the main task branch(`feature/logic-customer`)
   1. Switch to that branch(feature/table1-create-table)
   2. Make changes of sub tasks feature(and `git add`, `git push`.. etc), and create a pull request
   3. Merge pull request

5. (If you need)Create branches for a sub2 task(for instance:feature/table2-create-table) from the main task branch(`feature/logic-customer`)
* Do the same as above
* If you create this branch before merge(which is for sub1 task), you need to rebase this before creating a pull request
* `git` commands are:
```
git fetch origin --prune

git checkout feature/summary_monthly_customers_earned_points-to-create-table

git rebase origin/feature/summary_customers_earned_points-to-logic-customer
```

6. (If you need)Do the same for sub3 task

7. After all pull requests are merged, create a pull request of main task(`feature/logic-customer`)
```
# 1. fetch all changes from remote repository
git fetch origin --prune

# 2. update branch of the main task
git checkout `feature/logic-customer`
git merge origin/`feature/logic-customer`

# 3. reapply commits on top of another base tip(※1)
git rebase -r origin/dev

# 3-1. If you find any conflicts, you must resolve them.
#      For abort rebase command(git rebase --abort)

# 4. confirm the log graph(see git rebase images↓)
git log --graph --oneline --decorate --all( or gg)

# 5. push with force options, due to  commit history change by rebaseing
git push -f origin `feature/logic-customer`

# 6. create a pull request
```
