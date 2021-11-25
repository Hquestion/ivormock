# Note

##监听服务器被CTRL+C停止

```js
process.on('SIGTERM');
process.on('SIGINT');
```

