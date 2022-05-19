发生更新的组件对应的fiber节点会被打上 effectTag ，这些 fiber 节点在render阶段的 ‘归 ’会被形成一个链表，在commit 阶段会遍历这条链表，执行对应的操作 mutation ，这些操作对于 hostcomponent 来说相当于增删改

