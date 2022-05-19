# babel 手册


## Babel是什么？

Babel 是一个 JavaScript 编译器<br />Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。下面列出的是 Babel 能为你做的事情：

- 语法转换
- 通过 Polyfill 方式在目标环境中添加缺失的特性 （通过引入第三方 polyfill 模块，例如 core-js）（preset env 会根据 targets 来引入插件，实现转换和 polyfill）
- 源码转换（codemods）

利用Babel对源码的操作，可以用来静态分析。实战中经常会用到的有：自动国际化、自动生成文档、自动埋点、js解释器等。

## Babel的编译过程

babel 是 source to source 的转换，整体编译流程分为三步：

- parse：通过 parser 把源码转成抽象语法树（AST）
- transform：遍历 AST，调用各种 transform 插件对 AST 进行增删改
- generate：把转换后的 AST 打印成目标代码，并生成 sourcemap


### parse

parse 阶段的目的是把源码字符串转换成机器能够理解的 AST，这个过程分为词法分析、语法分析。

比如 let name = 'lin'; 这样一段源码，我们要先把它分成一个个不能细分的单词（token），也就是 let, name, =, 'lin'，这个过程是词法分析，按照单词的构成规则来拆分字符串成单词。

之后要把 token 进行递归的组装，生成 AST，这个过程是语法分析，按照不同的语法结构，来把一组单词组合成对象。


### transform

transform 阶段是对 parse 生成的 AST 的处理，会进行 AST 的遍历，遍历的过程中处理到不同的 AST 节点会调用注册的相应的 visitor 函数，visitor 函数里可以对 AST 节点进行增删改，返回新的 AST（可以指定是否继续遍历新生成的 AST）。这样遍历完一遍 AST 之后就完成了对代码的修改。


### generate
generate 阶段会把 AST 打印成目标代码字符串，并且会生成 sourcemap。不同的 AST 对应的不同结构的字符串。比如 IfStatement 就可以打印成 if(test) {} 格式的代码。这样从 AST 根节点进行递归打印，就可以生成目标代码的字符串。
> <br />sourcemap 记录了源码到目标代码的转换关系，通过它我们可以找到目标代码中每一个节点对应的源码位置
> 



## AST

babel 编译的第一步是把源码 parse 成抽象语法树 AST （Abstract Syntax Tree），后续对这个 AST 进行转换。（之所以叫抽象语法树是因为省略掉了源码中的分隔符、注释等内容）

AST 也是有标准的，JS parser 的 AST 大多是 estree 标准，从 SpiderMonkey 的 AST 标准扩展而来。babel 的整个编译流程都是围绕 AST 来的，这一节我们来学一下 AST。

熟悉了 AST，也就是知道转译器和 JS 引擎是怎么理解代码的，对深入掌握 Javascript 也有很大的好处。


### 常见的AST

AST 是对源码的抽象，字面量、标识符、表达式、语句、模块语法、class 语法都有各自的 AST。我们分别来了解一下：


#### Literal

是字面量的意思，比如 let name = 'lin'中，'lin'就是一个字符串字面量 StringLiteral，相应的还有数字字面量 NumericLiteral，布尔字面量 BooleanLiteral，字符串字面量 StringLiteral，正则表达式字面量 RegExpLiteral 等。


#### Identifier

Identifer 是标识符的意思，变量名、属性名、参数名等各种声明和引用的名字，都是Identifer。<br />比如 let name = 'lin' 里面的name


#### Statement

statement 是语句，它是可以独立执行的单位，比如 break、continue、debugger、return 或者 if 语句、while 语句、for 语句，还有声明语句，表达式语句等。我们写的每一条可以独立执行的代码都是语句。


#### Declaration

声明语句是一种特殊的语句，它执行的逻辑是在作用域内声明一个变量、函数、class、import、export 等。


#### Expression

expression 是表达式，特点是执行完以后有返回值，这是和语句 (statement) 的区别。<br />有的节点可能会是多种类型，identifier、super 有返回值，符合表达式的特点，所以也是 expression。


#### Program & Directive

program 是代表整个程序的节点，它有 body 属性代表程序体，存放 statement 数组，就是具体执行的语句的集合。还有 directives 属性，存放Directive 节点，比如"use strict" 这种指令会使用 Directive 节点表示。


#### File & Comment

babel 的 AST 最外层节点是 File，它有 program、comments、tokens 等属性，分别存放 Program 程序体、注释、token 等，是最外层节点。<br />注释分为块注释和行内注释，对应 CommentBlock 和 CommentLine 节点。


### AST 可视化查看工具

当然，我们并不需要记什么内容对应什么 AST 节点，可以通过 [axtexplorer.net](https://astexplorer.net/) 这个网站来直观的查看。


### AST 的公共属性

每种 AST 都有自己的属性，但是它们也有一些公共属性：

- `type`： AST 节点的类型
- `start、end、loc：start 和 end` 代表该节点对应的源码字符串的开始和结束下标，不区分行列。而 loc 属性是一个对象，有 line 和 column 属性分别记录开始和结束行列号。
- `leadingComments、innerComments、trailingComments`： 表示开始的注释、中间的注释、结尾的注释，因为每个 AST 节点中都可能存在注释，而且可能在开始、中间、结束这三种位置，通过这三个属性来记录和 Comment 的关联。
- `extra`：记录一些额外的信息，用于处理一些特殊情况。比如 StringLiteral 修改 value 只是值的修改，而修改 extra.raw 则可以连同单双引号一起修改。


## Babel API


### @babel/parser

Babel parser（以前的 Babylon）是Babel 中使用的 JavaScript 解析器。


#### 输出

Babel 解析器根据Babel AST 格式生成 AST 。


#### 例子

```javascript
require("@babel/parser").parse("code", {
  // parse in strict mode and allow module declarations
  sourceType: "module",

  plugins: [
    // enable jsx and flow syntax
    "jsx",
    "flow",
  ],
});
```


### @babel/traverse

当您想要转换一个AST时，您必须递归地遍历树。<br />我们可以将它与 babel 解析器一起使用来遍历和更新节点：

```javascript
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";

const code = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(code);

traverse(ast, {
  enter(path) {
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  },
});
```


#### Visitors

当我们谈论“去”一个节点，我们实际上意味着我们正在访问它们。我们之所以使用visitor这个术语，是因为有访问者这个概念。<br />访问者是跨语言的 AST 遍历中使用的模式。简单地说，它们是一个对象，其中定义了用于接受树中特定节点类型的方法。这有点抽象，让我们来看一个例子。

```javascript
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};

// You can also create a visitor and add methods on it later
let visitor = {};
visitor.MemberExpression = function() {};
visitor.FunctionDeclaration = function() {}
```

> 注意:Identifier(){…}是Identifier:{enter(){…}}的缩写。

这是一个基本的访问者，在遍历过程中使用时，它将为树中的每个 Identifier 调用 Identifier ()方法。<br />因此，使用这段代码，Identifier ()方法将被每个 Identifier (包括平方)调用四次。

```javascript
function square(n) {
  return n * n;
}
```

```javascript
path.traverse(MyVisitor);
Called!
Called!
Called!
Called!
```

让我们看看上面那个树怎么运行的

- Enter FunctionDeclaration 
   - Enter Identifier (id) 
      - Hit dead end
   - Exit Identifier (id)
   - Enter Identifier (params[0]) 
      - Hit dead end
   - Exit Identifier (params[0])
   - Enter BlockStatement (body) 
      - Enter ReturnStatement (body) 
         - Enter BinaryExpression (argument) 
            - Enter Identifier (left) 
               - Hit dead end
            - Exit Identifier (left)
            - Enter Identifier (right) 
               - Hit dead end
            - Exit Identifier (right)
         - Exit BinaryExpression (argument)
      - Exit ReturnStatement (body)
   - Exit BlockStatement (body)
- Exit FunctionDeclaration

如果需要，还可以为多个访问者节点应用相同的函数，方法是将它们与方法名中的 | 作为一个字符串(比如 Identifier | MemberExpression)分开。<br />flow-comments插件中的用法示例

```javascript
const MyVisitor = {
  "ExportNamedDeclaration|Flow"(path) {}
};
```

还可以使用别名作为访问者节点(如 babel-types 中定义的那样)。<br />Function 是 FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, ObjectMethod and ClassMethod的别名

```javascript
const MyVisitor = {
  Function(path) {}
};
```


### @babel/generator

将 AST 转换为代码。


#### 例子

```javascript
import { parse } from "@babel/parser";
import generate from "@babel/generator";

const code = "class Example {}";
const ast = parse(code);

const output = generate(
  ast,
  {
    /* options */
    sourceMaps: true
  },
  code
);
```


### @babel/code-frame

一般用于标出代码位置


#### 例子

```javascript
import { codeFrameColumns } from "@babel/code-frame";

const rawLines = `class Foo {
  constructor()
}`;
const location = { start: { line: 2, column: 16 } };

const result = codeFrameColumns(rawLines, location, {
  /* options */
});

console.log(result);
```

```javascript
  1 | class Foo {
> 2 |   constructor()
    |                ^
  3 | }
```

更多库 可以到Babel官网进行查看。


## 总结

了解的Babel的运转模式，学会了AST，就可以对代码的操作转换为AST的操作了。可以进行Babel插件的编写
