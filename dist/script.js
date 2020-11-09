
async function fetchText(url) {
    let response = await fetch(url);
    if (response.status < 200 || response.status > 200) {
        throw Error("fetchText status=" + response.status + " url=" + url);
    }
    let text = await response.text();
    return text;
}

async function fetchJson(url) {
    let text = await fetchText(url);
    return JSON.parse(text);
}

async function main() {
    let data = await fetchJson("./data.json");
    console.log("json", data);

    var w = 500, h = 500;
    var colorscale = d3.scale.category10();

    //Legend titles
    //var LegendOptions = ['CPM-4V', 'CPM-20CV'];

    let nameToData = {};
    data.forEach(e => {
        nameToData[e.name] = e;
    });

    let names = Object.keys(nameToData);

    let d = [];
    names.forEach(name => {
        let o = [];
        let steelProperties = nameToData[name];
        Object.keys(steelProperties).forEach(property => {
            if (property.startsWith("bhq")) {
                let sproperty = property.substring(3);
                let propObj = { 
                    axis: sproperty,
                    value: steelProperties[property] / 10
                };
                //console.log("propObj", propObj);
                //console.log("o", o);
                o.push(propObj);
            }
        });
        d.push(o);
    });
    console.log("d", d);


    // var d = [
    //     [
    //         { axis: "Sharpening", value: 0.5 },
    //         { axis: "Retention", value: 0.8 },
    //         { axis: "Toughness", value: 0.9 },
    //         { axis: "Corrosion", value: 0.5 },
    //     ],
    //     [
    //         { axis: "Sharpening", value: 0.2 },
    //         { axis: "Retention", value: 0.9 },
    //         { axis: "Toughness", value: 0.6 },
    //         { axis: "Corrosion", value: 0.7 },
    //     ]
    // ];

    //Options for the Radar chart, other than default
    var mycfg = {
        w: w,
        h: h,
        maxValue: 1.0,
        levels: 6,
        ExtraWidthX: 300
    };

    var margin = { top: 100, right: 100, bottom: 100, left: 100 },
        width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

    var radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 0.5,
        levels: 5,
        roundStrokes: true,
        color: d3.scale.category10()
    };

    //Call function to draw the Radar chart
    //Will expect that data is in %'s
    //RadarChart.draw("#chart", d, mycfg);
    RadarChart("#chart", d, radarChartOptions);

    ////////////////////////////////////////////
    /////////// Initiate legend ////////////////
    ////////////////////////////////////////////

    var svg = d3.select('#body')
        .selectAll('svg')
        .append('svg')
        .attr("width", w + 300)
        .attr("height", h)

    //Create the title for the legend
    var text = svg.append("text")
        .attr("class", "title")
        .attr('transform', 'translate(300,0)')
        .attr("x", w - 70)
        .attr("y", 10)
        .attr("font-size", "12px")
        .attr("fill", "#404040")
        .text("Legend");

    //Initiate Legend	
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(200,20)')
        ;
    //Create colour squares
    legend.selectAll('rect')
        .data(names)
        .enter()
        .append("rect")
        .attr("x", w - 65)
        .attr("y", function (d, i) { return i * 20; })
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d, i) { return colorscale(i); })
        ;
    //Create text next to squares
    legend.selectAll('text')
        .data(names)
        .enter()
        .append("text")
        .attr("x", w - 52)
        .attr("y", function (d, i) { return i * 20 + 9; })
        .attr("font-size", "11px")
        .attr("fill", "#737373")
        .text(function (d) { return d; })
        ;

}

main();