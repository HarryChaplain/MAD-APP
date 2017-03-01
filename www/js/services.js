angular.module('starter.services', [])

.factory("Copy", function() {
    var copy = {}

    copy.setCopy = function(reviewObject){
      copy = reviewObject;
    }

    copy.getCopy = function(){
      return copy;
    }

    return copy;
  }
)
