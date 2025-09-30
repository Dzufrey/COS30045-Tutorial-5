// D3 Donut Chart: Energy consumption by screen technology

const width = 450, height = 400, margin = 40;
const radius = Math.min(width, height) / 2 - margin;

const svg = d3.select("#donut-tech")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2},${height/2})`);

d3.csv("Ex5/Ex5_TV_energy_Allsizes_byScreenType.csv").then(data => {
    // Aggregate energy consumption by screen technology
    const techData = d3.rollups(
        data,
        v => d3.sum(v, d => +d['Mean(Labelled energy consumption (kWh/year))']),
        d => d.Screen_Tech
    ).map(([Screen_Tech, TotalEnergy]) => ({ Screen_Tech, TotalEnergy }));

    // Set color scale
    const color = d3.scaleOrdinal()
        .domain(techData.map(d => d.Screen_Tech))
        .range(d3.schemeCategory10);

    // Pie generator
    const pie = d3.pie()
        .value(d => d.TotalEnergy);

    // Arc generator
    const arc = d3.arc()
        .innerRadius(radius * 0.5) // Donut thickness
        .outerRadius(radius);

    // Draw slices
    svg.selectAll('path')
        .data(pie(techData))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.Screen_Tech))
        .attr('stroke', 'white')
        .style('stroke-width', '2px');

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${radius + 20},${-radius})`);

    techData.forEach((d, i) => {
        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 22)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", color(d.Screen_Tech));
        legend.append("text")
            .attr("x", 24)
            .attr("y", i * 22 + 13)
            .text(d.Screen_Tech)
            .style("font-size", "14px");
    });
});