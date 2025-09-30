// D3 Bar Chart: Energy consumption by screen technology for 55inch TVs

(function() {
    const margin = {top: 40, right: 40, bottom: 60, left: 80},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#bar-55inch")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("Ex5/Ex5_TV_energy_55inchtv_byScreenType.csv").then(data => {
        // Prepare data: convert energy to number
        const techData = data.map(d => ({
            Screen_Tech: d.Screen_Tech,
            TotalEnergy: +d['Mean(Labelled energy consumption (kWh/year))']
        }));

        // X scale (technologies)
        const x = d3.scaleBand()
            .domain(techData.map(d => d.Screen_Tech))
            .range([0, width])
            .padding(0.2);

        // Y scale (energy)
        const y = d3.scaleLinear()
            .domain([0, d3.max(techData, d => d.TotalEnergy)]).nice()
            .range([height, 0]);

        // X axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // Y axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // Axis labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .attr("text-anchor", "middle")
            .text("Screen Technology");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -60)
            .attr("text-anchor", "middle")
            .text("Mean Energy Consumption (kWh)");

        // Bars
        svg.selectAll("rect")
            .data(techData)
            .enter()
            .append("rect")
            .attr("x", d => x(d.Screen_Tech))
            .attr("y", d => y(d.TotalEnergy))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.TotalEnergy))
            .attr("fill", "#ff9800");
    });
})();