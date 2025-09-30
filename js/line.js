// D3 Line Chart: Spot power prices from 1998 to 2024 (['Average Price (notTas-Snowy)'] only)

(function() {
    const margin = {top: 40, right: 40, bottom: 60, left: 80},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#line-spotprice")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Update the file path and column names as per your CSV
    d3.csv("Ex5/Ex5_ARE_Spot_Prices.csv").then(data => {
        // Parse year and ['Average Price (notTas-Snowy)'] price
        const parsedData = data.map(d => ({
            Year: +d.Year,
            ['Average Price (notTas-Snowy)']: +d['Average Price (notTas-Snowy)']
        })).filter(d => d.Year >= 1998 && d.Year <= 2024);

        // X scale (years)
        const x = d3.scaleLinear()
            .domain(d3.extent(parsedData, d => d.Year))
            .range([0, width]);

        // Y scale Average Price
        const y = d3.scaleLinear()
            .domain([0, d3.max(parsedData, d => d['Average Price (notTas-Snowy)'])]).nice()
            .range([height, 0]);

        // X axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        // Y axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // Axis labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + 45)
            .attr("text-anchor", "middle")
            .text("Year");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -60)
            .attr("text-anchor", "middle")
            .text("Average Price ($/MWh)");

        // Line generator
        const line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d['Average Price (notTas-Snowy)']));

        // Draw line
        svg.append("path")
            .datum(parsedData)
            .attr("fill", "none")
            .attr("stroke", "#007bff")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Optional: Add dots for each year
        svg.selectAll("circle")
            .data(parsedData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.Year))
            .attr("cy", d => y(d['Average Price (notTas-Snowy)']))
            .attr("r", 3)
            .attr("fill", "#007bff");
    });
})();