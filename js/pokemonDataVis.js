
var filterGroup = d3.select('#genFilter');
var options = filterGroup.selectAll("lable")
    .data(genList)
    .enter()
    .append("lable")
    .text(d => ` ${d}: `)
    .append("input")
    .attr("type","checkbox")
    .attr("class","filter")
    .property('checked', true)
    .attr("value",d => d);

var sortByCol = 'id';

$(".filter").click(function(){
    finalData = filterData(getSelectedFilterOptions(), sortData(sortByCol));
    buildDataTable(finalData);
    buildTypeCountChart(finalData);
});

function getSelectedFilterOptions(){
    fl=[];
    $.each($('.filter:checked'), (i, d) => fl.push(d.value));
    return fl
}

function sortData(sortCol){
    sortedData=dataset.slice(0);
    sortedData.sort((a,b) => a[sortCol]<b[sortCol] ? -1 : a[sortCol] > b[sortCol] ? 1 : 0 );
    return sortedData
}

function filterData(filterList, sortedData){
    var filterData = sortedData.filter(d => filterList.includes(d.gen) );
    return filterData
}

function buildDataTable(filterData){
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

function setColorByType(type){
    return typeColorObj[type]

}
function buildTypeCountChart(filterData){

    const margin = 60;
    const width = 1000 - 2 * margin;
    const height = 600 - 2 * margin;

    var x = d3.scaleLinear().domain([0, 200]);
    var y = d3.scaleLinear().range([height, 0]);

// var xAxis = d3.axisBottom()
//     .scale(x);
// var yAxis = d3.axisLeft()
//     .scale(y)
//     .ticks(10);

    const svg = d3.select('svg')
        .attr("width", width + margin + margin)
        .attr("height", height + margin + margin);

    const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

// svg.append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis)
//   .selectAll("text")
//     .style("text-anchor", "end")
//     .attr("dx", "-.8em")
//     .attr("dy", "-.55em")
//     .attr("transform", "rotate(-90)" );

// svg.append("g")
//     .attr("class", "y axis")
//     .call(yAxis)
//   .append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 6)
//     .attr("dy", ".71em")
//     .style("text-anchor", "end")
//     .text("Value ($)");

    typeCount = { }
    filterData.forEach(row => {
        if(typeCount[row.type1]){
            typeCount[row.type1] += 1;
        }
        else{
            typeCount[row.type1] = 1; 
        }
        if (row.type2){
            if(typeCount[row.type2]){
                typeCount[row.type2] += 1;
            }
            else{
                typeCount[row.type2] = 1; 
            }
        }
    });
    finalTypeList=[];
    Object.keys(typeCount).forEach(k => finalTypeList.push({"type":k,"val":typeCount[k]}));
    console.log(finalTypeList);
    svg.selectAll("bar")
        .data(finalTypeList)
        .enter()
        .append("rect")
        .merge(svg)
        .style("fill", d => setColorByType(d.type))
        .attr("x", d => 20 * finalTypeList.indexOf(d))
        .text(d => d.type)
        .attr("width", 15)
        .attr("y", d => d.val )
        .attr("height", d => height - y(d.val));
    svg.exit().remove();


}



//INIT calls 
finalData = filterData(genList, sortData(sortByCol));
    buildDataTable(finalData);
    buildTypeCountChart(finalData);