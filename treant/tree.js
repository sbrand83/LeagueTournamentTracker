simple_chart_config = {
    chart: {
        container: "#tree-simple"
    },
    
    nodeStructure: {
        text: { name: "Parent node" },
        children: [
            {
                text: { name: "First child" }
            },
            {
                text: { name: "Second child" }
            }
        ],
        connectors: { type: "step" },
        collapsable: true
    }
};

var myChart = new Treant(simple_chart_config);