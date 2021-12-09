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

[Getting start with webpack](https://github.com/Hquestion/webpack-plugin-ivormock)

[Getting start with vite](https://github.com/Hquestion/vite-plugin-ivormock)


## Getting Start

### 1. Create a "ivormock" project

```shell
ivormock create <projectName> -b <projectRoot> -mp <mockFileFolderPath> -p <port> -d [description]
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

## How to write mock file

### Folder

With `ivormock`, you should specify a `mock` folder where your mock files locates. Folder name and path can be specified with `ivormock` command line or in plugin options.

For example, if your mock files locates at `<projectRoot>/__mock__`, you can tell `ivormock` via command line:

```shell
ivormock config <projectName> -mp __mock__
```

Or in plugin params:

```js
new IvormockWebpackPlugin({
    mockPath: "__mock__"
})
```

With that, `Ivormock` can parse your mock files correctly.

> Once you specify your `mockPath`, sub-folders is supported. You can put your mock files in different folders under `mockPath`

### Filename

In `Ivormock`, **FileName** is used as url of a route, so it's important to name your mock files.

Rule of filename like this:

```text
<GET|POST|PUT|PATCH|DELETE|...>__<URL_SLICE>_<URL_SLICE>_[id]
```

> `[id]` is used to indicate that "id" is a param in route

FileName is composed with **Method** and **Url**, with a double underline as separator. if **Url** includes "/", you should transform it to "_".

Here is an example:

I have a scene to update user's information. The API may like: `POST /api/v1/user/:id`. I will do this:

- Create a file under `mockPath`, named with `post__api_v1_user_[id].js`.
- That's all!

A router named `/api/v1/user/:id` has been created by `Ivormock`, and it's ready for end users. But currently there's no response yet.
Let's move on to define the API's response.

### File content

Firstly, I will tell you something important:

1. Only **Commonjs** module is supported now
2. Must export a **function**, and the function should return an **object**
3. You can use any **nodejs package**, but make sure to install it firstly

With the restriction, `Ivormock` support three kinds of common usage:

#### Simply give me a success response

Mock file's code may like this:

```js
// post__api_v1_user_[id].js

module.exports = function() {
    return {
        foo: "sth",
        boo: "sth",
        // anything
    }
}
```

#### I want to customize my http code

`Ivormock` will return a `200` http code default. If you want to get a failed response, you could specify your http code with `$$status` and `$$body`:

```js
// post__api_v1_user_[id].js

module.exports = function() {
    return {
        $$status: 400,
        $$body: {
            foo: "sth",
            boo: "sth",
            // anything
        }
    }
}
```

#### I want to switch success/fail response on demand

`Ivormock` support switch response on demand. The feature can free us from annotating code when we want to get a different response.

```js
// post__api_v1_user_[id].js

module.exports = function() {
    return {
        $$type: "SWITCH",     // tell ivormock to switch response on demand
        $$active: 1,          // specify current active response index
        $$options: [          // all possible responses
            {
                $$status: 200,
                $$body: {
                    message: "this is a success response"
                }
            },
            {
                $$status: 500,
                $$body: {
                    message: "this is a failed response"
                }
            }
        ]
    }
}
```

### Interact with request params

`Ivormock` is written with `koa2`. `Ivormock` has already pass the `koa` context to the function defined in mock file.
You can get your param with the context.

For example:

```js
module.exports = function(ctx) {
    // get params in body
    const body = ctx.request.body;
    if (!body.name) {
        return {
            $$status: 400,
            $$body: {
                message: "name is needed!"
            }
        }
    }
    return {
        $$status: 204
    }
}
```

For more details on `koa context`, please refer to `koa` documentation.


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
