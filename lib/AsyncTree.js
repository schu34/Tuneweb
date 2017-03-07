/**
 * AsyncTree.js
 * Builds a tree asynchronously
 * @param {Object} root - Node to use as root
 * @param {function} getChildren - Takes a node and returns a promise that resolves to an array of children
 * @param {number} maxHeight - Optional. the maximum height of the tree;
 */

function AsyncTree(root, getChildren, maxHeight) {
    if (!root) {
        throw new Error("expected root node got " + root);
    }
    if (getChildren.constructor !== Function) {
        throw new Error("Expected getChildren to be function");
    }

    this.root = {
        val: root,
        children: [],
        level: 0
    }
    this.getChildren = getChildren;
    this.maxHeight = maxHeight || -1;
    this.nodes = [];
    this.nodeVals = [root];

    this.recursiveBuild = function(node) {
        //base case :)
        if (!node || node.level >= this.maxHeight) {
            return Promise.resolve();
        }

        var that = this;
        return this.getChildren(node.val).then(function(children) {
            that.nodeVals = that.nodeVals.concat(children);
            var childNodes = children.map(function(a) {
                return {
                    val: a,
                    children: [],
                    level: node.level + 1,
                    parentVal : node.val
                }
            })
            var filteredChildNodes = childNodes.filter(function(a) {
                if (that.nodeVals.indexOf(a) < 0) {
                    return true;
                } else {
                    return false;
                }
            });

            if(node.parentVal){
                for(var i = 0; i < childNodes.length; i++){
                    if(childNodes[i].val === node.parentVal){
                        childNodes.splice(i, 1);
                    }
                }
            }
            var promises = [];
            node.children = childNodes;
            for (var i = 0; i < filteredChildNodes.length; i++) {
                promises.push(that.recursiveBuild(filteredChildNodes[i]));
            }

            that.nodes.push(node);
            return Promise.all(promises);
        });
    }

    this.init = function() {
        var that = this;
        return this.recursiveBuild(this.root).then(function() {
            return that;
        }, function(err){
            console.log(err);
            throw err;
        });
    }

    this.flatten = function() {
        return AsyncTree.flatten(this.root);
    };
    return this

}
AsyncTree.flatten = function(root) {
    if(!root){
        throw new Error("expected root instead got " + root);
    }
    var queue = [root];
    var nodes = [];

    while (queue.length) {
        var currNode = queue[0];
        if(!currNode) break;
        queue.splice(0, 1);
        nodes.push({
            val: currNode.val,
            level: currNode.level
        });
        queue = queue.concat(currNode.children);
    }
    return nodes;
};

module.exports = AsyncTree;
