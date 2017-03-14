angular.module('starter.services', [])

.factory("Copy", function() {
    var copy = {}

    copy.setCopy = function(reviewObject){
      copy = reviewObject;
      console.log(copy);
    }

    copy.getCopy = function(){
      return copy;
    }

    return copy;
  }
)

.service("Draft", function ($rootScope) {
  var draftId = "";
  return {
      getDraftId: function () {
          return draftId;
      },
      setDraftId: function(value) {
          draftId = value;
      }
  };
});
