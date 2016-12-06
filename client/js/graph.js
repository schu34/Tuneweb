var graph = {
    nodes: [],
    links: [],
    svg: null,
    simulation: null,
    zoom: null,
    width: 0,
    height: 0,
    centerX: 0,
    centerY: 0,

    init: function(){
        this.svg = d3.select("svg")
        this.width = +this.svg.attr("width");
        this.height = +this.svg.attr("height");
        this.centerX = this.width/2;
        this.centerY  = this.height/2;

        this.simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) {
                return d.id;
            }).distance(300))
            .force("charge", d3.forceManyBody().strength(-1000))
            .force("center", d3.forceCenter(this.centerX, this.centerY))
        this.zoom = d3.zoom().on("zoom", this.zoomed);
        this.svg.call(this.zoom)

    },

    zoomed: function(){
        d3.select(".container").attr("transform", "translate("+ d3.event.transform.x + "," + d3.event.transform.y + ")scale(" + d3.event.transform.k + ")");
    },
    clear: function(){

    },
    update: function(artist, data) {
        this.updateModel(artist, data);
        this.updateView();
    },

    updateModel: function(artist, data) {
        this.nodes.push({
            id: artist
        });
        console.log("data: " + data);
        newNodes = data.map(function(a) {
            return {
                id: a.name,
                group: 1
            };
        })

        for (var i = 0; i < newNodes.length; i++) {
            artistIdx = this.nodes.indexOf(newNodes[i]);
            if (artistIdx !== -1) {
                this.links.push({
                    source: artist,
                    target: this.nodes[artistIdx].id,
                    value: 50
                })
                newNodes.splice(i, 1);
            }
        }

        for (var i = 0; i < newNodes.length; i++) {
            this.links.push({
                source: artist,
                target: newNodes[i].id,
                value: 500
            });
        }
        this.nodes = this.nodes.concat(newNodes);
    },

    updateView: function() {
        var link = d3.select("#links")
            .selectAll("line")
            .data(this.links)
            .enter().append("line")
            .attr("stroke-Width", function(d) {
                return Math.sqrt(d.value);
            });

        var node = d3.select("#nodes")
            .selectAll("text")
            .data(this.nodes)
            .enter().append("text")
            .text(function(d){return d.id;})

        node.append("title").text(function(d) {
            return d.id;
        });


        this.simulation
            .nodes(this.nodes)
            .on("tick", ticked);

        this.simulation
            .force("link")
            .links(this.links);

        this.simulation.restart();

        function ticked() {
            link
                .attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

            node
                .attr("x", function(d) {
                    return d.x
                })
                .attr("y", function(d) {
                    return d.y
                });
        }
    }
};
