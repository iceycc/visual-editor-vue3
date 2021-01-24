# 可视化拖拽训练_01

本次内容主要讲解以下两个知识点：
- 主页面结构：左侧可选组件列表、中间容器画布、右侧编辑组件定义好的属性
- 从菜单拖拽组件到容器；

视频链接地址：[https://www.bilibili.com/video/BV13y4y1171n](https://www.bilibili.com/video/BV13y4y1171n)


# vue版本
## 创建工程
1. `vue create demo-visual-editor`
2. 选择自定义模式 `Manually select features `
3. 选择 `TypeScript/CSS Pre-processors/` 
4. 选择 vue3.0
5. `class-style component syntax? (y/N)` N
6. Eslint默认的
7. yy

## 有计划
训练主要流程（中途可能会补充或者调整顺序）
- [ ] 主页面结构：左侧可选组件列表、中间容器画布、右侧编辑组件定义好的属性
- [ ] 从菜单拖拽组件到容器；
- [ ] Block的选中状态；
- [ ] 容器内的组件可以拖拽移动位置；
- [ ] 命令队列以及对应的快捷键；
- [ ] 单选、多选；
- [ ] 设计好操作栏按钮：
    - [ ] 撤销、重做；
    - [ ] 导入、导出；
    - [ ] 置顶、置底；
    - [ ] 删除、清空；
- [ ] 拖拽贴边；
- [ ] 组件可以设置预定义好的属性；
- [ ] 右键操作菜单；
- [ ] 拖拽调整宽高；
- [ ] 组件绑定值；
- [ ] 根据组件标识，通过作用域插槽自定义某个组件的行为
    - [ ] 输入框：双向绑定值、调整宽度；
    - [ ] 按钮：类型、文字、大小尺寸、拖拽调整宽高；
    - [ ] 图片：自定义图片地址，拖拽调整图片宽高；
    - [ ] 下拉框：预定义选项值，双向绑定字段；


## 开发
1. 删除无用文件
2. 开发编辑页面布局：左、中、右
3. 开发组件：放在packages文件夹下
4. 按照自己的需求创建修改eslint配置
    ```
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    'no-extra-boolean-cast': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    'prefer-const': 'off',
    ```
5. 创建第一个组件:
