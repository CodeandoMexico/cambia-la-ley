// Appends the author's username at the beginning of an annotation
Annotator.Plugin.Author = function (element) {
  // Private API

  // Returns a HTML anchor tag pointed at a twitter profile
  var twitterAnchorTag = function(twitterScreenName, twitterName) {
    var twitterUrl = 'http://twitter.com/' + (twitterScreenName || document.getElementById('sessionUserTwitterScreenName').innerHTML);
    var anchor = '<a href="' + twitterUrl + '" target="_blank">' + (twitterName || document.getElementById('sessionUserTwitterName').innerHTML) + '</a>';
    return anchor;
  },

  // Starts the plugin.
  pluginInit = function() {
    this.annotator.subscribe('annotationViewerTextField', function(field, annotation) {
      if (typeof annotation.user !== 'undefined') {
        $(field).html(twitterAnchorTag(annotation.user.twitterScreenName, annotation.user.twitterName) + ': ' + annotation.text);
        var btnsHtml = '';
        btnsHtml += '<span id="vote-btns-' + annotation.id + '">';
        if (document.getElementById('sessionUserId').innerHTML == '') {
          // The user is not logged in.
          btnsHtml += AjaxButtonManager.html.loggedout.unvoted.votedown(annotation.id);
          btnsHtml += AjaxButtonManager.html.loggedout.unvoted.voteup(annotation.id);
        } else {
          if (document.getElementById('sessionUserId').innerHTML == annotation.user.id) {
            // The logged-in user is the author of this annotation.
            btnsHtml += AjaxButtonManager.html.basic.edit;
            btnsHtml += AjaxButtonManager.html.basic.del;
          } else {
            // The logged-in user is not the author of this annotation.
            if (currentUserVotes[annotation.id] > 0) {
              // The user has already voted this annotation up and can only vote it down.
              btnsHtml += AjaxButtonManager.html.loggedin.unvoted.votedown(annotation.id);
              btnsHtml += AjaxButtonManager.html.loggedin.voted.voteup(annotation.id);
            }
            if (currentUserVotes[annotation.id] < 0) {
              // The user has already voted this annotation down and can only vote it up.
              btnsHtml += AjaxButtonManager.html.loggedin.voted.votedown(annotation.id);
              btnsHtml += AjaxButtonManager.html.loggedin.unvoted.voteup(annotation.id);
            }
            if (typeof currentUserVotes[annotation.id] === 'undefined') {
              // The user has not voted for this annotation.
              btnsHtml += AjaxButtonManager.html.loggedin.unvoted.votedown(annotation.id);
              btnsHtml += AjaxButtonManager.html.loggedin.unvoted.voteup(annotation.id);
            }
          }
        }
        btnsHtml += AjaxButtonManager.html.basic.score(annotation.id, annotation.score);
        btnsHtml += '</span>';
        document.getElementById('annotator-action-btns').innerHTML = btnsHtml;
      }
    });
  };

  // Public API
  return {
    pluginInit: pluginInit
  };
};
