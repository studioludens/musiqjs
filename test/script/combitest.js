// test speed of combinations

// the imperative version
var combinations = function(lists) {
        if (lists.length == 0) {
            return [];
        } else if( lists.length == 1 ){
            return lists[0];
        } else {
            var pr = combinations(_.rest(lists));
            var ret = [];
            _.each(_.first(lists),function(fp) {
                _.each(pr,function(p) {
                    ret.push( [fp].concat(p) );
                });
            });
          return ret;
        }
    };

// the functional version
var combinations2 = window.combinations = function(lists) {
     return (lists.length == 0) ? [] : 
     (lists.length == 1) ? _.first(lists) :
     _.reduce(combinations(_.rest(lists)),function(memo,p) {
      return _.map(_.first(lists),function(f){return [f].concat(p);}).concat(memo);
     },[]);
     

test("Combinations", function(){
    
    //expect(0);
    
    
    
    // make some lists
    var list1 = [ _.range(10),_.range(10),_.range(10),_.range(10),_.range(10),_.range(10) ];
    
    //var list2 = combinations(list1);
    //var list3 = combinations2(list1);
    
    ok(list1.length > 0);
    
    console.log("list length: ", list2.length);
    console.log("list 2 length: ", list3.length);
    
    
};
    
});