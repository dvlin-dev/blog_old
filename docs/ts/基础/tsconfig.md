# tsconfig

## noImplicitAny
如果你没有指定一个类型，TypeScript 也不能从上下文推断出它的类型，编译器就会默认设置为 any 类型。

如果你总是想避免这种情况，毕竟 TypeScript 对 any 不做类型检查，你可以开启编译项 noImplicitAny (opens new window)，当被隐式推断为 any 时，TypeScript 就会报错。

## strictNullChecks
默认情况下，像 null 和 undefined 这样的值可以赋值给其他的类型。这可以让我们更方便的写一些代码。但是忘记处理 null 和 undefined 也导致了不少的 bug，甚至有些人会称呼它为价值百万的错误 , [strictNullChecks](https://www.typescriptlang.org/tsconfig#strictNullChecks) 选项会让我们更明确的处理 null 和 undefined，也会让我们免于忧虑是否忘记处理 null 和 undefined 。
