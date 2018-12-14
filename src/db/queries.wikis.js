const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;

const Authorizer = require("../policies/wiki");

module.exports = {
  getAllWikis(callback){
    return Wiki.all({
      include: [
        {model: Collaborator, as: "collaborators"}
      ]
    })
    .then((wikis) => {
      function sortByUpdatedAtDate(wikis) {
        let swapped;
        do {
          swapped = false;
          for (let i=0; i < wikis.length; i++) {
            if (wikis[i] && wikis[i + 1] && wikis[i].updatedAt < wikis[i + 1].updatedAt) {
              [wikis[i], wikis[i + 1]] = [wikis[i + 1], wikis[i]];
              swapped = true;
            }
          }
        } while (swapped);
        
        return wikis;
      }

      sortByUpdatedAtDate(wikis);
      
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    })
  },

  searchWikis(searchTitle, callback){
    return Wiki.all()
    .then((wikis) => {
      
      function sortByTitle(wikis) {
        let swapped;
        do {
          swapped = false;
          for (let i=0; i < wikis.length; i++) {
            if (wikis[i] && wikis[i + 1] && wikis[i].title < wikis[i + 1].title) {
              [wikis[i], wikis[i + 1]] = [wikis[i + 1], wikis[i]];
              swapped = true;
            }
          }
        } while (swapped);
        
        return wikis;
      }

      sortByTitle(wikis)
      
      .then((wikis) => {
        //search here
        
      var searchByTitle = function(needle, haystack, case_insensitive) {
        if(needle == "") return [];
        var haystackLength 	= haystack.length;
        var letterNumber 	= needle.length;
        case_insensitive 	= (typeof(case_insensitive) === 'undefined' || case_insensitive) ? true : false;
        needle = (case_insensitive) ? needle.toLowerCase():needle;
          
        var getElementPosition = findElement();
        
        if(getElementPosition == -1) return [];

        return getRangeElement = findRangeElement()
        
        function findElement() {
          if (typeof(haystack) === 'undefined' || !haystackLength) return -1;
          
          var high = haystack.length - 1;
          var low = 0;
          
          while (low <= high) {
            mid = parseInt((low + high) / 2);
            var element = haystack[mid].substr(0,letterNumber);
            element = (case_insensitive) ? element.toLowerCase():element;
            
            if (element > needle) {
              high = mid - 1;
            } else if (element < needle) {
              low = mid + 1;
            } else {
              
              return mid;
            }
          }
          return -1;
        }
        function findRangeElement(){
          
          for(i=getElementPosition; i>0; i--){
            var element =  (case_insensitive) ? haystack[i].substr(0,letterNumber).toLowerCase() : haystack[i].substr(0,letterNumber);
            if(element != needle){
              var start = i+1;
              break;
            }else{
              var start = 0;
            }
          }
          for(i=getElementPosition; i<haystackLength; i++ ){
            var element =  (case_insensitive) ? haystack[i].substr(0,letterNumber).toLowerCase() : haystack[i].substr(0,letterNumber);
            if(element != needle){
              var end = i;
              break;
            }else{
              var end = haystackLength -1;
            }
          }
          var result = [];
          for(i=start; i<end;i++){
            result.push(haystack[i])
          }

          return result;
        }
        
      }

        callback(null, result);
      })
    })
    .catch((err) => {
      callback(err);
    })
  },

  addWiki(newWiki, callback){
      return Wiki.create(newWiki)
      .then((wiki) => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      })
  },

  getWiki(id, callback){
    return Wiki.findById(id, {
      include: [{
        model: Collaborator, 
        as: "collaborators",
        include: [{
          model: User
        }]
      }]
    })
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },

  deleteWiki(req, callback){
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      const authorized = new Authorizer(req.user, wiki).destroy();
      if(authorized) {
        wiki.destroy()
        .then((res) => {
          callback(null, wiki);
        })
      } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401);
      }
    })
    .catch((err) => {
      callback(err);
    })
  },

  updateWiki(req, updatedWiki, callback){
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      if(!wiki){
        return callback("Wiki not found");
      }

      const authorized = new Authorizer(req.user, wiki).update();
      
      if(authorized) {
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
          callback("Forbidden");
      }
    });
  }
}