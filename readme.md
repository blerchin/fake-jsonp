# node-jsonp

A simple JSONP implementation for Node.js. Assuming your JSONP endpoint
provides standard JSON, this will run faster and avoid the hassle + risk of
eval-ing foreign code.

h/t @ngot for `node-json` module on which this is based


## API

### JSONP(url, data, method, callback)

- `url` (`String`) The URL you are requesting with the JSON data
- `data` (`Object`) The Data object you want to generate the URL params from
- `method` (`String`) The method name for the callback function. Defaults to callback (for example, flickr's is "jsoncallback")

returns a Promise, which resolves with `data` parameters.

###Examples
```js
	JSONP('http://twitter.com/users/oscargodson.json').then(function(json){
	 console.log(json)
	})
	
	JSONP('http://api.flickr.com/services/feeds/photos_public.gne',{'id':'12389944@N03','format':'json'},'jsoncallback').then(function(json){
     console.log(json)
    })
    
    JSONP('http://graph.facebook.com/FacebookDevelopers', 'callback').then(function(json){
     console.log(json)
    })
```	

## License

MIT
