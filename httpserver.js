#!/usr/bin/env node
"use strict";

const
    pathName = str => require( "url" ).parse( str ).pathname.replace( /\.\.\//g, '' ),
    send = ( req, path ) => require( 'send' )( req, path, { index: [ 'index.html', 'index.htm' ], root: process.cwd() } ),
    port = process.argv[ 2 ] ? Number( process.argv[ 2 ] ) : 8080;

require( "http" ).createServer( ( request, response ) => send( request, pathName( request.url ) ).pipe( response ) ).listen( port );

console.log( `Static file server running on => http://localhost:${port}\nCTRL + C to shutdown` );
