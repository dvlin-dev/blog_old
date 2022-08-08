--
title: commander 入门
--


# 基础使用
## 创建实例

```js
const commander = require('commander');
const pkg = require('../package.json');

const { program } = commander;

program
  .name(Object.keys(pkg.bin)[0]) // 设置 usage 的 name 
  .usage('<command>[options]') // 设置 usage 的 message
  .parse(process.argv); // 解析参数

```
## 其他 api
```js
打印出命令的 options
console.log(program.opts());
// 打印出帮助信息
program.outputHelp();
```

## 注册命令

方法一: command 注册命令
```js
const clone = program.command('clone <source> [destination]');
clone
  .description('克隆一个仓库')
  .option('-f, --force', '是否强制克隆') // 注册 clone 命令下的 option
  .action((source, destination, cmdObj) => {
    console.log('do clone', source, destination, cmdObj.force);
  });
```

方法二: addCommand 注册命令

```js
// 创建一个新的命令
const service = new commander.Command('service').description('启动一个服务');

添加子命令
service
  .command('start [port]')
  .description('启动服务')
  .action((port) => {
    console.log(`服务启动于${port}`);
  });

// 添加子命令
service
  .command('stop')
  .description('停止服务')
  .action(() => {
    console.log('服务停止了');
  });

// 把命令添加到脚手架中
program.addCommand(service);
```

## 匹配所有命令
```js
匹配所有不存在的命令，强制用户传递一个参数
program
  .arguments('<cmd> [options]')
  .description('友情提示:', {
    cmd: '要有一个必须的命令',
    option: '有一个可选的参数',
  })
  .action((cmd, options) => {
    console.log(cmd, options);
  });
```
```html
 "<>" 代表必须，"[]" 代表可选。必须要有一个命令。
-h 的时候会出现提示
```
## 脚手架互相调用

```js
执行新的命令，用于脚手架之间互相调用
program
  .command('install [name]', 'install package', {
    executableFile: 'bowling-cli', // 切换要执行的命令名称 
    isDefault: true, // 默认执行这个命令
    hidden: true, // 隐藏命令，不在 help 中显示
  })
  .alias('i');
```
## 高级定制 help 信息
```js
program.helpInformation = function () {
  return '';
};

program.on('--help', function () {
  console.log('我是帮助信息');
});
再执行 -h 就不会出现之前的内容了，而是调用我们自定义的方法。
```
## 高级定制 实现 debug 模式

```js
program.on('option:debug', () => {
  console.log('开启debug模式');
  if (program.debug) {
    process.env.LOG_LEVEL = 'verbose';
  }
  console.log(process.env.LOG_LEVEL);
});

```
## 高级定制 对所有未知命令监听
当输入未知命令时，执行自定义的回调。
```js
program.on('command:*', (obj) => {
  const commands = program.commands.map((command) => command.name());
  console.log(`可用命令为${commands.join(',')}`);
});
```
