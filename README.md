# swagger-split

h1. Helps you have the Dopest Swagger on the Block

Did you start off your swagger project like a fool? Did you modify a single swagger.yaml/swagger.json file until you hated yourself? Do you now have a swagger file that is thousands of lines long?

Well now you can fix that! With Swagger-split. The awesome tool to split your Swagger file into many smaller files, making your code more maintainable and your wife love you more.

example:

```javascript
var swag = require('swagger-split');

/*
 * @param {string} file - the swagger file to read from
 * @param {int} depth - how deep the files should be split up before stopping
 * @param {string} outputDirectory - where to create a directory and write your new split up swagger!
 */
swag.splitFile('swagger.yaml', 3, './out');
```

More to come soon!
