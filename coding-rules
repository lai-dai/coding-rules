<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

# Table of content
   * [Never use abbreviated names](#never-use-abbreviated-names)
   * [Forbidden Words](#forbidden-words)
         - [Info name (information)](#info-name-information)
         - [data](#data)
         - [manager](#manager)
         - [list](#list)
         - [useful (utils)](#useful-utils)
         - [type](#type)
      + [suggestion](#suggestion)
   * [Base Class](#base-class)
   * [Verb of method name](#verb-of-method-name)
         - [Creational methods](#creational-methods)
         - [Getting methods](#getting-methods)
         - [Updating methods](#updating-methods)
   * [Contrasting terms](#contrasting-terms)
   * [Use blank lines properly](#use-blank-lines-properly)
   * [Prohibiting Rules](#prohibiting-rules)
   * [Never Use `else if` and `switch` Statement](#never-use-else-if-and-switch-statement)
   * [Ternary Operators: `a ? b : c`](#ternary-operators-a-b-c)
   * [Exception ](#exception)

<!-- TOC end -->


<!-- TOC --><a name="coding-rules"></a>
# Coding Rules

<!-- TOC --><a name="never-use-abbreviated-names"></a>
## Never use abbreviated names

```
// ❌ Never use
avg (average) 
arr (array)
auth (authentication? or authorization?)
btn (button)
cate (category)
cfg (configuration)
cnt (count)
cond (condition)
ctx (context)
e (error? event?)
err (error)
ev (event)
ex (exception)
fmt (format)
msg (message)
no (number)
num (number)
prod (production)
tx (transaction)
tz (time zone)
... etc.
```

```
// ✅ OK
admin (administrator)
app (application)
calc (calculate)
char (character)
config (configuration)
enum (enumerate)
env (environment)
exec (execute)
eval (evaluation)
id (identity)
info (information)
init (initialize)
int (integer)
max (maximum)
min (minimum)
sin (sine) 三角関数
... etc.

// [Special case] Allowed only in express-related definitions
req (request)
res (response)
```

<!-- TOC --><a name="forbidden-words"></a>
## Forbidden Words
> The following words are prohibited from being used as prefixes or suffixes in names:
``` 
// ❌ Prohibitted
info (information)
data
helper
manager
item
list
util (utils)
type (Only when used as a suffix, it is prohibited.)
```

<!-- TOC --><a name="info-name-information"></a>
#### Info name (information)
* It is tempting to use UserInfo, etc., but avoid it for the following three reasons.
1. `information` does not explain any new meaning. UserIt alone conveys the meaning of "user information".

2. The prototype of `info`, `information`, is spelled the same in singular and plural. If you use `UserInfo` as a class name, its plural form becomes `UserInfo`, which is indistinguishable.

3. This can be solved by adding a rule that the plural form of `UserInfo` should be written as `UserInfos`. However, it is better not to use `~Info` from the beginning than to share the exceptional rule among all developers.

<!-- TOC --><a name="data"></a>
#### data
* `data` is the same in that it provides no explanation to the reader of the code info.

<!-- TOC --><a name="manager"></a>
#### manager
Recognize that using `manager` in Class names, etc. is a famous "naming anti-pattern". It is one of the English words that can easily become a god class because it can be given various roles such as "access to API," "store in DB," and so on.

<!-- TOC --><a name="list"></a>
#### list
* Array variables are named with the "plural form of the English word that represents the element. An array containing instances of User is not called UserList.

<!-- TOC --><a name="useful-utils"></a>
#### useful (utils)
* Names that do not add new information to the responsibilities or roles of the class should not be used.

<!-- TOC --><a name="type"></a>
#### type
* It is tempting to use it as a suffix to indicate a type, but in most cases there are other expressions available, so we look for another expression.

<!-- TOC --><a name="suggestion"></a>
### suggestion
```
UserInfo -> userDetail, userPayment,...
SaveData -> saveUser, saveMessages,...
FileUtil -> FileNameCollector,...
```

<!-- TOC --><a name="base-class"></a>
## Base Class
> The "parent class that defines required methods" used in design patterns such as Template Pattern is prefixed withBase~ .

```
// ❌ Incorrect
class APIFetcher {
  fetchHeader () {
    throw new Error('must be implement #fetchHeader()')
  }
}

// ✅ OK
class BaseAPIFetcher {
  fetchHeader () {
    throw new Error('must be implement #fetchHeader()')
  }
}

```

```
// Use with `extends` 
class BaseAPIFetcher {
  fetchHeader () {
    throw new Error('must be fulfilled #fetchHeader()')
  }
}

class AmazonAPIFetcher extends BaseAPIFetcher {
  fetchHeader () {
    // fulfilled
  }
}

class FacebookAPIFetcher extends BaseAPIFetcher {
  fetchHeader () {
    // fulfilled
  }
}
```

<!-- TOC --><a name="verb-of-method-name"></a>
## Verb of method name
<!-- TOC --><a name="creational-methods"></a>
#### Creational methods
| verb | usage
| ------------- |-------------|
| create~ | Use for the name of the method that creates the instance by class. |
| generate~	| Use for method names that generate primitive values or temporary object.	 |
| make~ | Please do not use make~. |

<!-- TOC --><a name="getting-methods"></a>
#### Getting methods
 verb | usage
| ------------- |-------------|
| find~ | Use for method names that retrieve entities from the DB. Methods containing Model.findOne() or Model.findAll() should be find~, not get~ or fetch~. |
| fetch~ | 	Use for method names that access external APIs to retrieve data.	 |
| extract~ | Use for method names to extract data from variables and properties. |

<!-- TOC --><a name="updating-methods"></a>
#### Updating methods
 verb | usage
| ------------- |-------------|
| save~ | Use for method names that encompass the process of saving to DB. |
| send~ | Use for method names that access external APIs and update external data. |
| set~ | Use for method name to update property as setter. However, please never use setter in our development. |

<!-- TOC --><a name="contrasting-terms"></a>
## Contrasting terms
* Use fixed names for variables and members with conflicting meanings.
* Use consistent names for variables and members that have opposing meanings.
| Positive word |Negative word | Japanese |
|--------------|--------------|----------|
| add |	remove | Addition/Deletion |
| append | extract | Adding to/removing from the list |
| setup | teardown | Setting/Deleting |
| initialize | terminalize | Initial processing/disposal processing |
| benefit |	drawback |	Advantages and Disadvantages |
| pros | cons |	Pros and Cons |


<!-- TOC --><a name="use-blank-lines-properly"></a>
## Use blank lines properly
> Put a blank line where the meaning of the processing changes.

```
'use strict'
              <----------- here (1)
const fs = requre('fs')
              <----------- here (2)
const results = fs.readSync('...')
```


<!-- TOC --><a name="prohibiting-rules"></a>
## Prohibiting Rules
> It is prohibited to use this command if it contains the meaning of a control statement.

```javascript

// ❌ Prohibitted
return this.nextComposer
  ? Object.setPrototypeOf(
    this.integratedResolver,
    this.nextComposer.composeResolver()
  )
  : this.integratedResolver


// ✅ OK
if (!this.nextComposer) {
  return this.integratedResolver
}

return Object.setPrototypeOf(
  this.integratedResolver,
  this.nextComposer.composeResolver()
)
```

> Ternary operators are prohibited if the values ​​they separate are not homogeneous.

```javascript
// ❌ Prohibitted
return condition
  ? defaultValue
  : processValue()

// ✅ OK
if (condition) {
  return defaultValue
}

return processValue()

// ✅ OK
const STATUS = {
  OK: 0,
  ERROR: 1,
}

return condition
  ? STATUS.OK
  : STATUS.ERROR

// ✅ OK
return condition
  ? 100
  : 200
```

```javascirpt
// ❌ Prohibitted
const value = this.condition
  ? this.defaultValue
  : this.processValue()

// ✅ OK
const value = this.createValue()

...

createValue () {
  if (this.condition) {
    return this.defaultValue
  }

  return this.processValue()
}
```

<!-- TOC --><a name="never-use-else-if-and-switch-statement"></a>
## Never Use `else if` and `switch` Statement

* `else if` and `switch` statement should not be used in general.
> When the number of variations branched by else if or switch increases, the past code needs to be modified. It violates the Open-Close principle of SOLID principle.

<!-- TOC --><a name="ternary-operators-a-b-c"></a>
## Ternary Operators: `a ? b : c`
* Nesting of ternary operators is prohibited, even if assisted by parentheses.
* The second and third terms of the ternary operator must be chopped down in all contexts.
```
// ❌ Prohibitted
const results = array.map(it => /^(?:ok|warning|notice)$/.test(it.status) ? 'It not bad' : it.errorMessage)

// ✅ OK
const results = array.map(it =>
  /^(?:ok|warning|notice)$/.test(it.status)
    ? 'It not bad'
    : it.errorMessage
)
```

<!-- TOC --><a name="exception"></a>
## Exception 
> When implementing asynchronous processing in application code, be sure to catch and log exceptions where they occur.
