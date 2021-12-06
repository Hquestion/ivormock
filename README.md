# ivormock

A tool to mock REST API, speed up your frontend development

## Features

- Decentralization
- Auto update router
- Switch response on demand
- Lightweight
- Version control
- Work with multi projects
- User friendly
- Easy to integrate with `webpack` and `vite`

## Install

Globally, used as a single server:

```shell

# with npm:

npm install -g ivormock

# or with yarn:

yarn global add ivormock
```

We also support use `ivormock` with `webpack` or `vite`, which is more efficient:

```shell

# for vite:
npm install -g ivormock vite-plugin-ivormock

# for webpack:
npm install -g ivormock webpack-plugin-ivormock

```

[Getting start with plugins]()


## Getting Start

### 1. Create a "ivormock" project

```shell
ivermock create <projectName> -b <projectRoot> -mp <mockFileFolderPath> -p <port> -d [description]
```
#### Params
- **`projectName`**: Your project name, should be unique globally
- `projectRoot`: Your project root path, such as `D:\\code\\projects\\someProject`
- `mockFileFolderPath`: Where your mock files' folder located, relative to `projectRoot`, default is `mock`
- `port`: Which port should your project's `ivormock` server started at, default is `6000`
- `description`: Optional, you can specify a description for your project

### 2. Start your "ivormock" server

After create your project successfully, simply start a `ivormock` server via your project name.

```shell
ivormock start <projectName>
```
If configured correctly, you would see a log on your screen, which indicates your `ivormock` server is started.

### 3. Write your mock file

Create a new `.js` file in your mock files folder and name it to `get__api_v1_users.js`, and paste the code below into your mock file:

```js

module.exports = function(ctx) {
  return {
    message: "Hello, ivormock"
  }
}
```
Ok, save it!

With the file, we have creat a rest api which url is `GET /api/v1/users`, and will return a JSON:

```json
{
  "message": "Hello, ivormock"
}
```

### 4. Check your server

Let's access our first `ivormock` api with `curl`:

```shell
curl http://localhost:6000/api/v1/users
```

Ok, you should have seen `Hello, ivormock` on your screen.

## Plugin support

With plugin, `ivormock` is easy to integrate with our current workflow.

### Work with `vite`

In your `vite.config.js`：

```js
const ivormock = require("vite-plugin-ivormock");

export default {
    // ... 
    plugins: [
        //...
        ivormock({
            mockPath: "mock",   // mock file path, relative to project root
            port: 3456          // ivormock server port
        })
    ]
}
```


### Work with `webpack`

In your `webpack.config.js`：

```js
const IvormockWebpackPlugin = require("webpack-plugin-ivormock");

const isDev = process.env.NODE_ENV === "development";

module.exports = {
    // ... 
    plugins: [
        //...
        // Only used in development envorioment
        isDev && new IvormockWebpackPlugin({
            mockPath: "mock",   // mock file path, relative to project root
            port: 3456,          // ivormock server port
            prefix: "/mock"     // request with "/mock" prefix will pass to ivormock 
        })
    ]
}
```

## TODO

- <input type="checkbox" readonly disabled /> Customization: path separator, api prefix...
- <input type="checkbox" readonly disabled /> UI
- <input type="checkbox" readonly disabled /> Log
- <input type="checkbox" readonly disabled /> Generate API document