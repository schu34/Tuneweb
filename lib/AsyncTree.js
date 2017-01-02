/**
* AsyncTree.js
* Builds a tree asynchronously
* @param {Object} root - node to use at root
* @param {function} getChildren - function that takes and object and returns and array of children
* @param {number} maxHeight - Optional. the maximum height of the tree;
*/

function AsyncTree(root, getChildren, maxHeight) {
    if(!root){
        throw new Error("expected root node got " + root);
    }
    if(getChildren.constructor !== Function){
        throw new Error("Expected getChildren to be function")
    }

    this.root = {
        val: root,
        children: [],
        level: 0
    }
    this.getChildren = getChildren;
    this.maxHeight = maxHeight || -1;
    this.nodes = [];

    this.recursiveBuild = function(node){
        if(node.level === this.maxHeight){
            return Promise.resolve();
        }
        return getChildren(node).then(function(children){
            var childNodes = children.map(function(a){
                return {
                    val: a,
                    children: [],
                    level: node.level+1
                }
            })
            var promises = [];

            for (var i = 0; i < childNodes.length; i++) {
                promises.append(this.recursiveBuild(childNodes[i]));
            }
            node.children = children;
            this.nodes.append(node);
            return Promise.all(promises);
        });
    }

    this.recursiveBuild(root);
    return this;
}

module.exports = AsyncTree;
