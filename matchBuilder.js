(function(){
    var teams = [1,2,3,4,5,6,7,8];
    var numberOfTeams = teams.length;
    var numberOfMatches = numberOfTeams - 1;
    //log base 2 of numberOfMatches
    var numberOfLevels = Math.log(numberOfMatches) / Math.LN2;

    var numberInFirstLevel = Math.floor(numberOfTeams / 2);

    var matchTree = {};

    // for(var i = 0; i < numberInFirstLevel; i++){

    // }

    function match(team1, team2, child1, child2, number){
        this.team1 = team1;
        this.team2 = team2;
        this.left = child1;
        this.right = child2;
        this.number = number;
    }

    var currentMatchNumber = numberOfMatches;
    var rootMatch = null;

    //adds match in next avaliable spot
    function addMatch(root, num){
        if(root === null){
            return new match(null, null, null, null, num);
        }
         
        if(num < root.number){
            root.left = addMatch(root.left, num);
            return root;
        }else if(num > root.number){
            root.right = addMatch(root.right, num);
            return root;
        }else{
            return root;
        }

    }
    
    function postOrder(root){
        var str = '';
        if(root.left !== null){
            str += postOrder(root.left);
        }

        if(root.right !== null){
            str += postOrder(root.right);
        }

        return str + root.number;
    }

    function findOrder(array){
        if(array.length === 1 || array.length === 0){
            return array;
        }

        //console.log(array);
        var middle = parseInt(array.length / 2);
        //splits firsthalf, not including middle
        var firsthalf = array.slice(0, middle);
        //slits secondehalf, not including middle
        var secondhalf = array.slice(middle + 1, array.length);

        var returnArray = [];
        returnArray.push(array[middle]);

        return returnArray.concat(findOrder(firsthalf).concat(findOrder(secondhalf)));
    }

    var matches = 2;
    //var middle = parseInt(7/2);

    var numberArray = [];
    for(var i = 0; i < matches; i++){
        numberArray.push(i);
    }
    console.log('NumberArray: ' + numberArray);

    var insertOrder = findOrder(numberArray);
    console.log(insertOrder);
    // insertOrder.push(middle);
    // console.log('Middle: ' + middle);


    var root4 = addMatch(null, insertOrder[0]);

    for(var r = 1; r < insertOrder.length; r++){
        addMatch(root4, insertOrder[r]);
    }

    console.log(root4);
    console.log(postOrder(root4));
    // 
    //console.log([0,1].slice(2, 2));
    
    //go throught this newly created tree and build the treant json out of it (use js object first)
    var tree = {};
    //one time thing at beginning
    tree.chart = {};
    tree.chart.container = '#tree-simple';

    //start of traversing tree
    tree.nodeStructure = {};

    function buildTreantTree(root, nodeObject){
        nodeObject.text = {name: root.number};
        nodeObject.children = [];
        //var str = '';
        if(root.left !== null){
            var childObjleft = {};
            nodeObject.children.push(childObjleft);
            buildTreantTree(root.left, childObjleft);
        }

        if(root.right !== null){
            var childObjright = {};
            nodeObject.children.push(childObjright);
            buildTreantTree(root.right, childObjright);
        }

        return;
    }

    buildTreantTree(root4, tree.nodeStructure);

    console.log(tree);
    
})();