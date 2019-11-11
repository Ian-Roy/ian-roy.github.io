var filterGroup = d3.select('#genFilter');
var options = filterGroup.selectAll("lable")
    .data(genList)
    .enter()
    .append("lable")
    .text(d => ` ${d}: `)
    .append("input")
    .attr("type", "checkbox")
    .attr("class", "filter")
    .property('checked', true)
    .attr("value", d => d);

var sortByCol = 'id';

$(".filter").click(function() {
    finalData = filterData(getSelectedFilterOptions(), sortData(sortByCol));
    buildDataTable(finalData);
    buildTypeCountChart(finalData);
});

function getSelectedFilterOptions() {
    fl = [];
    $.each($('.filter:checked'), (i, d) => fl.push(d.value));
    return fl
}

function sortData(sortCol) {
    sortedData = dataset.slice(0);
    sortedData.sort((a, b) => a[sortCol] < b[sortCol] ? -1 : a[sortCol] > b[sortCol] ? 1 : 0);
    return sortedData
}

function filterData(filterList, sortedData) {
    var filterData = sortedData.filter(d => filterList.includes(d.gen));
    return filterData
}

function buildDataTable(filterData) {
    var tr = d3.select('tbody').selectAll('tr').data(filterData);
    tr.enter().append("tr").merge(tr).html(d =>
        `<th scope="row" class =><img src="data:image/png;base64, ${d.imgBase64}"></th>
        <td>${d.id}</td>
        <td>${d.name}</td>
        <td>${d.type1}</td>
        <td>${d.type2}</td>
        <td>${d.gen}</td>`
    );
    tr.exit().remove();
}

function setColorByType(type) {
    return typeColorObj[type]

}

function getCountByTypeList(filterData) {
    typeCount = {}
    filterData.forEach(row => {
        if (typeCount[row.type1]) {
            typeCount[row.type1] += 1;
        } else {
            typeCount[row.type1] = 1;
        }
        if (row.type2) {
            if (typeCount[row.type2]) {
                typeCount[row.type2] += 1;
            } else {
                typeCount[row.type2] = 1;
            }
        }
    });
    finalTypeList = [];
    Object.keys(typeCount).forEach(k => finalTypeList.push({ "type": k, "val": typeCount[k] }));
    console.log(finalTypeList);
    return finalTypeList
}

function buildTypeCountChart(filterData) {

    const margin = 60;
    const width = 1000 - 2 * margin;
    const height = 600 - 2 * margin;


    const svg = d3.select('svg')
        .attr("width", width + margin + margin)
        .attr("height", height + margin + margin);


    finalTypeList = getCountByTypeList(filterData)

    var x = d3.scaleBand()
        .domain(finalTypeList.map(d => d.type))
        .range([margin, width - margin])
        .padding(0.1);
    var y = d3.scaleLinear()
        .domain([0, d3.max(finalTypeList, d => d.val)])
        .range([height, 0]);

    var bars = svg.selectAll("rect")
        .data(finalTypeList);

    bars.enter()
        .append("rect")
        .merge(bars)
        .style("fill", d => setColorByType(d.type))
        .attr("x", d => x(d.type))
        .text(d => d.type)
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.val))
        .attr("height", d => height - y(d.val));

    bars.exit().remove();



    // xAxis = g => g
    svg.append('g')
        .attr("transform", `translate(0,${height - margin})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
}



//INIT calls 
finalData = filterData(genList, sortData(sortByCol));
buildDataTable(finalData);
buildTypeCountChart(finalData);