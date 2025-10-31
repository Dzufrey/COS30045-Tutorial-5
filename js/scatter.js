// D3 Scatter Plot for Energy Consumption vs Star Rating

// Set dimensions and margins
const margin = {top: 40, right: 40, bottom: 60, left: 60},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Append SVG to the scatterplot div
const svg = d3.select("#scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the CSV data
d3.csv("Ex5/Ex5_TV_energy.csv").then(data => {
    // Parse numeric values
    data.forEach(d => {
        d.star2 = +d.star2;
        d.energy_consumpt = +d.energy_consumpt;
    });

    // Set scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.star2)).nice()
        .range([0, width]);
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.energy_consumpt)).nice()
        .range([height, 0]);

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(6));
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add axis labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Star Rating");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .text("Energy Consumption (kWh)");

    // Draw scatter points
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.star2))
        .attr("cy", d => y(d.energy_consumpt))
        .attr("r", 5)
        .attr("fill", "#007bff")
        .attr("opacity", 0.7);
});