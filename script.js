var vimeoDemo = {
	getVideosForUser: function(userId) {
		JSONP.get(
			'https://vimeo.com/api/v2/' + userId + '/videos.json',
			{},
			vimeoDemo.processVideos
		);
	},
	
	processVideos: function(videosJson) {
		var counter = 0;
		for (var video in videosJson) {
			var thisVideo = videosJson[video];
			var divName = 'videolist';
			
			console.log(thisVideo);
			
			if (counter == 0) {
				divName = 'featurevideo';
			}
			
			var videoHtml = '<div class="video" id="' + thisVideo.id + '">';
			videoHtml += '<h2>' + thisVideo.title + '</h2>';
			videoHtml += '<a href="' + thisVideo.url + '" target="_blank">';
			videoHtml += '<img class="videothumb" src="' + thisVideo.thumbnail_medium + '" alt="' + thisVideo.title + '"/>';
			videoHtml += '</a>';
			videoHtml += '<p>Plays: ' + thisVideo.stats_number_of_plays + ', Likes: ' + thisVideo.stats_number_of_likes + ', Comments: ' + thisVideo.stats_number_of_comments + '</p>';
			videoHtml += '</div>';
			
			var divHolder = document.getElementById(divName);
			divHolder.innerHTML = divHolder.innerHTML + videoHtml;
			
			counter++;
		}
	}
}

window.onload = function() {
	vimeoDemo.getVideosForUser('gopro');
};

// The following is boilerplate to save dealing with the low level implications of JSONP.
// Lightweight JSONP from nonobtrusive.com
// http://www.nonobtrusive.com/2010/05/20/lightweight-jsonp-without-any-3rd-party-libraries/

var JSONP = (function(){
	var counter = 0, head, query, key, window = this;
	function load(url) {
		var script = document.createElement('script'),
			done = false;
		script.src = url;
		script.async = true;
 
		script.onload = script.onreadystatechange = function() {
			if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
				done = true;
				script.onload = script.onreadystatechange = null;
				if ( script && script.parentNode ) {
					script.parentNode.removeChild( script );
				}
			}
		};
		if ( !head ) {
			head = document.getElementsByTagName('head')[0];
		}
		head.appendChild( script );
	}
	function jsonp(url, params, callback) {
		query = "?";
		params = params || {};
		for ( key in params ) {
			if ( params.hasOwnProperty(key) ) {
				query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
			}
		}
		var jsonp = "json" + (++counter);
		window[ jsonp ] = function(data){
			callback(data);
			try {
				delete window[ jsonp ];
			} catch (e) {}
			window[ jsonp ] = null;
		};
 
		load(url + query + "callback=" + jsonp);
		return jsonp;
	}
	return {
		get:jsonp
	};
}());