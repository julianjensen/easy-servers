Quickest and easiest possible HTTP servers
==========================================

> NOTE: Whenever you want to run a server on a port lower than 1024, you will need to run the command using `sudo`.

### Method #1

One time install:
```bash
sudo npm i -g http-server
```
To use it from your web root directory, i.e. where your `index.html` file lives:
```bash
http-server
```
You now have an HTTP server running on port 8080. Verify in your browser by going to `http://localhost:8080`

To run on a different port and to disable directory listings (you always want to do this):
```bash
http-server -p 1337 -d false
```
If you have a `./public` directory, it will default to using that, otherwise it just uses `./` but you can tell
it to serve files from elsewhere:

```bash
http-server ../my-web-files/webroot -p 80 -d false
```

More info here [http-server](https://www.npmjs.com/package/http-server)

### Method #2

This one is much like method #1 except this is a live-reload-style server. This is sometimes useful while
developing. It has a lot of options so you can look at them here: [live-server](https://www.npmjs.com/package/live-server), but basically, it monitors the files in the webroot directory and, if any
file is updated it automatically reloads the page in the browser, except for CSS changes which are applied without
reloading. In other words, you write your web code and the moment you save the file, your browser automatically
reloads the page so you can see your changes. This is instead of hitting CTRL-F5 (or COMAMND-R on Mac) in the browser.
Convenient but annoying if you save a file with a change that's not finished. YMMV.

```bash
live-server --port=80
```

### Method #3

There is also something called `light-server` which is much like `live-server` in method #2.
```bash
sudo npm i -g light-server
```
To run
```bash
light-server -p 80
```
Standard options, check it out here: [light-server](https://www.npmjs.com/package/light-server)

### Method #4

I'm not a python guy, but I'm told that this works well:
```bash
python -m SimpleHTTPServer
```
I can't tell you how to set it up or anything, I just included it for completeness.

Rolling your own
----------------
You can also write own HTTP server which is stupidly easy in _node.js_.

First some notes about how you can run a _node.js_ program, for example, let's say we have program that
we wrote in a file called `index.js`. Make sure you're on the latest version of node. Easy install from
here: https://github.com/nodesource/distributions There are instuctions on the page but they are
basically this:
```bash
# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```
There are also installers available on the official site: [node.js](https://nodejs.org/en/)

Run a node program like this:
```bash
node index.js
```
If you want something more like a normal command-line tool:
1. Make sure the very first line in your `index.js` file (or whatever it's called) is: `#!/usr/bin/env node`
2. Make it executable: `chmod 755 index.js`
3. Make a link in your path: `sudo ln -s ./index.js /usr/bin/myserver`

Now you can run it like so:
```bash
myserver
```

Okay, armed with this information here's how easy it is to write your own. We'll make two different ones.
We'll need some modules, so make a development directory if you don't already have one for this project.
```bash
cd my-project
npm init
npm i connect serve-static send
```
All done, we're ready.

### Easy server #1

This uses some heavier modules to do most of the work but it works fine and it's tiny. Make a file
called `simplehttp.js` with the contents shown below.

To run from your web directory: `node simplehttp.js`
or
```bash
chmod 755 simplehttp.js
sudo ln -s ./simplehttp.js /usr/bin/simplehttp
```
and now you can run it like this:
```bash
simplehttp
```
or, without the soft link:
```bash
./simplehttp.js
```
When you run it, you have to be in your web root directory.

The code is this:
```js
#!/usr/bin/env node
"use strict";

const
    connect = require( 'connect' ),
    serveStatic = require( 'serve-static' );

connect().use( serveStatic( __dirname ) ).listen( 8080, () => console.log( 'Server running on 8080...' ) );
```
or even shorter
```js
#!/usr/bin/env node
"use strict";

require( 'connect' )()
    .use( require( 'serve-static' )( __dirname ) )
    .listen( 8080, () => console.log( 'Server running on 8080...' ) );
```
There you have it, an HTTP server in one line of code.

In browser, go to: http://localhost:8080

### Easy server #2

Here's another simple one that uses some standard modules and one external one, the `send` module.

You can run it like this: `node httpserver.js 80` or do a soft link as described above. You can replace 80
with whatever port you want.

or

You have to be in your web directory, i.e. wherever you keep your index.html file.

In browser, go to: http://localhost:80

Here's the code:
```js
#!/usr/bin/env node
"use strict";

const
    pathName = str => require( "url" ).parse( str ).pathname.replace( /\.\.\//g, '' ),
    send = ( req, path ) => require( 'send' )( req, path, { index: [ 'index.html' ], root: process.cwd() } ),
    port = process.argv[ 2 ] ? Number( process.argv[ 2 ] ) : 8080;

require( "http" )
    .createServer( ( request, response ) => send( request, pathName( request.url ) ).pipe( response ) )
    .listen( port );

console.log( `Static file server running on => http://localhost:${port}\nCTRL + C to shutdown` );
```
And that's how simple it is. Let me know if there's anything else I can help with. And let me know if any of the
stuff above doesn't make sense.
