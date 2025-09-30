// D3 Donut Chart: Energy consumption by screen technology (responsive)
(function() {
    function drawDonutChart() {
        // Remove any existing SVG (for redraw on resize)
        d3.select("#donut-tech").selectAll("svg").remove();

        // Responsive width based on container or window
        const container = document.getElementById("donut-tech");
        const width = Math.min(container.offsetWidth || 600, 600);
        const height = 400;
        const margin = 40;
        const radius = Math.min(width, height) / 2 - margin;

        const svg = d3.select("#donut-tech")
            .append("svg")
            .attr("width", "100%")
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
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
                .innerRadius(radius * 0.5)
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

            // Add numbers inside each arc
            svg.selectAll("text.donut-value")
                .data(pie(techData))
                .enter()
                .append("text")
                .attr("class", "donut-value")
                .attr("transform", d => `translate(${arc.centroid(d)})`)
                .attr("text-anchor", "middle")
                .attr("dy", "0.35em")
                .style("font-size", "14px")
                .style("fill", "#fff")
                .text(d => d.data.TotalEnergy.toFixed(0) + " kWh");

            // Add legend (move further right for small screens)
            const legendX = radius + 40;
            const legend = svg.append("g")
                .attr("transform", `translate(${legendX},${-radius})`);

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
    }

    // Initial draw
    drawDonutChart();

    // Redraw on window resize
    window.addEventListener("resize", drawDonutChart);
})();