#!/usr/bin/env node
"use strict";

const
    connect = require( 'connect' ),
    serveStatic = require( 'serve-static' );

connect().use( serveStatic( __dirname ) ).listen( 8080, () => console.log( 'Server running on 8080...' ) );
