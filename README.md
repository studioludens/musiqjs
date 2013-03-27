MUSIQ.js
========

#### A music analysis library for javascript ####

This open-source MIT-licensed library is your swiss knife of musical analysis. 
It allows you to descibe notes, intervals, chords, scales and other concepts 
used in musical theory.

It gives you all sorts of ways to work with these concepts, like looking up 
chords from notes, finding scales belonging to a certain chord, viewing the 
relationship between notes and more.

The Library
-----------

Still working on putting it in namespaces, writing tests and making it ready for
production.

Getting Started
---------------

Take a look at the MUSIQ.js primer. 

Testing
-------

There is a QUnit test suite included in this release. Start the simple static file server as so:

    node ./server.js
    
And then navigate to the URL:

    http://musiqjs-server/test/qunit.html
    
You can add new tests as well.

API documentation
-----------------

Musiq.js uses jsdoc to create it's API documentation with a custom template that lives in
./jsdoc-template/. You can build the documentation again by running the following command
(provided you have jsdoc npm module installed):

    ./node_modules/jsdoc/jsdoc -r src/ -d docs/ -t jsdoc-template
    
Or simply run the provided shell script:

    ./doc
    


Instruments supported
---------------------

So far the only instrument that is supported is the guitar. There are plans to support
at least the piano as well. Empty files for this can be found in the src/piano/ folder.