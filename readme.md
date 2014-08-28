# pandora

 > pandora 启动脚本

## 更新模块

  - 修改 `package.json` 中的 `spm.alias`
  - 修改 `src/pandora.js` 中的 `alias`

## 更新记录

  - 1.0.0 - release

## 附录：开发指引

### 环境配置

  1. 安装 NODE
    - http://nodejs.org/download/
    - npm config set registry http://10.5.121.139:8888

  1. 安装 generator
    - npm install -g yo
    - npm install -g generator-pandora

  1. 安装 GRUNT
    - npm install grunt-cli -g

  1. 安装 SPM
    - npm install spm@2.2.7 -g
    - spm config source:default.url http://10.5.121.139:3000
    - spm login (username: spm, password: password)

### 创建组件

  1. 初始化
    - yo pandora

  1. 安装 NPM 依赖
    - npm install

  1. 安装 SPM 依赖
    - spm install

### 发布组件

  1. 构建
    - grunt

  1. 发布
    - spm publish
