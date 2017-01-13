var GraphView = {
    nodes: [],
    links: [],
    svg: null,
    simulation: null,
    zoom: null,
    width: 0,
    height: 0,
    centerX: 0,
    centerY: 0,
    color: {},
    newData: function(graph) {
        this.nodes = graph.nodes.map(function(a, index) {
            a.index = index;
            return a
        });
        var idsInOrder = this.nodes.map(function(a){return a.id});
        this.links = graph.links.map(function(a){
            a.srcIndex = idsInOrder.indexOf(a.source);
            return a;
        });
        this.updateView();
    },
    init: function() {
        this.svg = d3.select("svg")
        this.width = +this.svg.attr("width");
        this.height = +this.svg.attr("height");
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        this.color = d3.scaleOrdinal(d3.schemeCategory20);

        this.simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) {
                return d.id;
            }).distance(100).strength(1))
            .force("charge", d3.forceManyBody().strength(-1000))
            .force("center", d3.forceCenter(this.centerX, this.centerY))
        this.zoom = d3.zoom()
            .scaleExtent([1 / 2, 96])
            .on("zoom", this.zoomed);
        this.svg.call(this.zoom)

    },

    zoomed: function() {
        d3.select(".container").attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ")scale(" + d3.event.transform.k + ")");
    },
    clear: function() {

    },
    update: function(artist, data) {
        this.updateModel(artist, data);
        this.updateView();
    },

    updateView: function() {
        var that = this;
        var link = d3.select("#links")
            .selectAll("line")
            .data(this.links)
            .enter().append("line")
            .attr("stroke-width", 2)
            .attr("stroke", function(d) {
                return that.color(d.srcIndex);
            });

        var idx = 0;
        var node = d3.select("#nodes")
            .selectAll("text")
            .data(this.nodes)
            .enter().append("text")
            .text(function(d) {
                return d.id;
            })
            .attr("fill", function(d) {
                return that.color(d.index);
            })
            .attr("stroke", 'black')
            .attr("stroke-width", .1)

        node.append("title").text(function(d) {
            return d.id;
        });


        this.simulation
            .nodes(this.nodes)
            .on("tick", ticked);

        this.simulation
            .force("link")
            .links(this.links);

        this.simulation.restart().alpha(1).alphaDecay(.01);

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
