/**
 * ngTweet - Angular directives for better Twitter integration.
 *
 * @license
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Aru Sahni, http://arusahni.net
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
//!function(){"use strict";angular.module("ngtweet",[]).value("ngTweetLogVerbose",!0).value("twitterWidgetURL","https://platform.twitter.com/widgets.js")}(),function(){"use strict";function e(e,t){var n=function(){},i=function(e){return t===!0?e:n};return{log:i(e.log),debug:i(e.debug),info:i(e.info),warn:e.warn,error:e.error}}e.$inject=["$log","ngTweetLogVerbose"],angular.module("ngtweet").factory("ngTweetLogger",e)}(),function(){"use strict";function e(e,t){function n(e,t){this.timelineType=e,this.message=t}function i(e){function t(e){return 1===e.length?'"'+e+'"':'("'+e.join('" AND "')+'")'}return e.map(t).join(" OR ")}function r(e){var t={sourceType:e.sourceType};if(!u.hasOwnProperty(e.sourceType))throw new n(e.sourceType,"unknown type");for(var r=u[e.sourceType],o=!1,c=0,a=r.length;a>c;c++){for(var d=r[c],g={},l=0,s=d.length;s>l;l++)e[d[l]]&&(g[d[l]]=e[d[l]]);if(Object.keys(g).length===s){angular.merge(t,g),o=!0;break}}if(!o)throw new n(e.sourceType,"args: "+i(r));return t}function o(n,i,o){e.debug("Linking",n,i,o),n.id&&!angular.isString(n.id)&&e.warn("twitterTimelineId should probably be a string due to loss of precision.");try{n.twitterTimelineOptions=JSON.parse(o.twitterTimelineOptions)}catch(u){n.$watch(function(){return n.$parent.$eval(o.twitterTimelineOptions)},function(e,t){n.twitterTimelineOptions=e})}if(angular.isUndefined(n.twitterTimelineOptions)&&(n.twitterTimelineOptions={}),n.sourceType){var c;try{c=r(n)}catch(u){return void e.error('Could not create new timeline: bad args for type "'+u.timelineType+'". Reason: '+u.message)}t.createTimelineNew(c,i[0],n.twitterTimelineOptions).then(function(t){e.debug("New Timeline Success!!!")})["catch"](function(t){e.error("Could not create new timeline: ",t,i)})}else!angular.isUndefined(n.id)||angular.isString(n.screenName)?t.createTimeline(n.id,n.screenName,i[0],n.twitterTimelineOptions).then(function(t){e.debug("Timeline Success!!!")})["catch"](function(t){e.error("Could not create timeline: ",t,i)}):t.load(i[0])}var u={profile:[["screenName"],["userId"]],likes:[["screenName"],["userId"]],collection:[["id"]],widget:[["id"]],list:[["id"],["ownerScreenName","slug"]],url:[["url"]]};return{restrict:"E",replace:!0,transclude:!0,scope:{id:"=?twitterTimelineId",screenName:"=?twitterTimelineScreenName",sourceType:"@?twitterTimelineType",userId:"=?twitterTimelineUserId",ownerScreenName:"=?twitterTimelineOwnerScreenName",slug:"=?twitterTimelineSlug",url:"=?twitterTimelineUrl"},template:'<div class="ngtweet-wrapper" ng-transclude></div>',link:o}}e.$inject=["ngTweetLogger","TwitterWidgetFactory"],angular.module("ngtweet").directive("twitterTimeline",e)}(),function(){"use strict";function e(e,t){return{restrict:"E",replace:!0,transclude:!0,scope:{twitterWidgetId:"=",twitterWidgetOnRendered:"&",twitterWidgetOptions:"@"},template:'<div class="ngtweet-wrapper" ng-transclude></div>',link:function(n,i,r){n.$watch("twitterWidgetId",function(o,u){e.debug("Linking",i,r);var c=n.$eval(r.twitterWidgetOptions);void 0!==u&&o!==u&&angular.element(i[0]).empty(),angular.isUndefined(n.twitterWidgetId)?t.load(i[0]):(angular.isString(n.twitterWidgetId)||e.warn("twitterWidgetId should probably be a string due to loss of precision."),t.createTweet(n.twitterWidgetId,i[0],c).then(function(t){e.debug("Created tweet widget: ",n.twitterWidgetId,i),n.twitterWidgetOnRendered()})["catch"](function(t){e.error("Could not create widget: ",t,i)}))})}}}e.$inject=["ngTweetLogger","TwitterWidgetFactory"],angular.module("ngtweet").directive("twitterWidget",e)}(),function(){"use strict";function e(e,t,n,i,r,o){function u(){o.twttr=function(e,t,n){var r,u=e.getElementsByTagName(t)[0],c=o.twttr||{};if(!e.getElementById(n))return r=e.createElement(t),r.id=n,r.src=i,u.parentNode.insertBefore(r,u),c._e=[],c.ready=function(e){c._e.push(e)},c}(e[0],"script","twitter-wjs")}function c(){return angular.isUndefined(w)?(w=r.defer(),u(),o.twttr.ready(function(e){n.debug("Twitter script ready"),e.events.bind("rendered",a),w.resolve(e)}),w.promise):w.promise}function a(e){n.debug("Tweet rendered",e.target.parentElement.attributes)}function d(e,t,i){return c().then(function(o){return n.debug("Creating Tweet",o,e,t,i),r.when(o.widgets.createTweet(e,t,i))})}function g(e,t,i,o){return c().then(function(u){return n.debug("Creating Timeline",e,t,o,i),angular.isString(t)&&t.length>0&&(o.screenName=t),r.when(u.widgets.createTimeline(e,i,o))})}function l(e,t,i){return c().then(function(o){return n.debug("Creating new Timeline",e,i,t),r.when(o.widgets.createTimeline(e,t,i))})}function s(e){c().then(function(t){n.debug("Wrapping",t,e),t.widgets.load(e)})["catch"](function(t){n.error("Could not wrap element: ",t,e)})}var w;return{createTweet:d,createTimeline:g,createTimelineNew:l,initialize:c,load:s}}e.$inject=["$document","$http","ngTweetLogger","twitterWidgetURL","$q","$window"],angular.module("ngtweet").factory("TwitterWidgetFactory",e)}(),function(){"use strict";function e(e,t){return{restrict:"A",replace:!1,scope:!1,link:function(n,i,r){e.debug("Initializing"),t.initialize()}}}e.$inject=["ngTweetLogger","TwitterWidgetFactory"],angular.module("ngtweet").directive("twitterWidgetInitialize",e)}(),function(){"use strict";function e(e){e.decorator("ngTweetLogVerbose",["$delegate",function(e){return!1}])}e.$inject=["$provide"],angular.module("ngtweet").config(e)}();

'use strict';

angular.module('ngTweets', [])
  .service('tweets', function($http) {
    var service = this;
    this.get = function(config) {
      return $http({
        url: url(config.widgetId, config.lang),
        method: 'JSONP',
        transformResponse: appendTransform($http.defaults.transformResponse, function(value) {
          return parse(value);
        })
      });
    };
    this.getTweets = function(config) {
      return service.get(config)
        .then(trim);
    };
  });

function trim(request) {
  return request.data.tweets;
}

function url(id, lang) {
  return [
    'http://cdn.syndication.twimg.com/widgets/timelines/',
    id,
    '?&lang=',
    (lang || 'en'),
    '&callback=JSON_CALLBACK',
    '&suppress_response_codes=true&rnd=',
    Math.random()
  ].join('');
}


function appendTransform(defaults, transform) {
  defaults = angular.isArray(defaults) ? defaults : [defaults];
  return defaults.concat(transform);
}

function parse(data) {
  var response = {
    headers: data.headers,
    tweets: []
  },
  els,
  el,
  tweet,
  x,
  tmp;

  if (data.body) {
      els = angular.element(data.body)[0].getElementsByClassName('timeline-Tweet');
      for (x = 0; x < els.length; x++) {
        el = els[x];
        tweet = {};
        tweet.retweet = (el.getElementsByClassName('timeline-Tweet-retweetCredit').length > 0);
        tweet.id = el.getAttribute('data-tweet-id');
        tmp = el.getElementsByClassName('timeline-Tweet-text')[0];
        tweet.html = tmp.innerHTML;
        tweet.text = tmp.textContent || tmp.innerText; // IE8 doesn't support textContent
        tmp = el.getElementsByClassName('timeline-Tweet-author')[0];
        tweet.author = {
          url: tmp.getElementsByClassName('TweetAuthor-link')[0].getAttribute('href'),
          avatar: tmp.getElementsByClassName('Avatar')[0].getAttribute('data-src-1x'),
          fullName: tmp.getElementsByClassName('TweetAuthor-name')[0].innerText,
          nickName: tmp.getElementsByClassName('TweetAuthor-screenName')[0].innerText
        };
        tweet.updated = el.getElementsByClassName('dt-updated')[0].innerText;
        tweet.permalink = el.getElementsByClassName('timeline-Tweet-timestamp')[0].getAttribute('href');
        if (el.getElementsByClassName('timeline-Tweet-media')[0]) {
          tweet.inlineMedia = el.getElementsByClassName('timeline-Tweet-media')[0].innerHTML;
        }
        response.tweets.push(tweet);
      }
    }
  return response;
}