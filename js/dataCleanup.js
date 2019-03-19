dataset=[];
genList=[];
typeColorObj={};
data.forEach(row => {
    d={};
    d.imgBase64 = row.imgBase64;
    d.id =row.id;
    d.name = row.name;
    d.type1 = row.type1;
    d.type2 = row.type2;
    d.gen = row.gen;
    dataset.push(d);
    if ( genList.indexOf(row.gen) == -1 ){
        genList.push(row.gen);
    }
    if(!Object.keys(typeColorObj).includes(d.type1)){
        typeColorObj[d.type1]=row.type1Color;
    }
    if(!Object.keys(typeColorObj).includes(d.type2) && d.type2){
        typeColorObj[d.type2]=row.type1Color;
    }
});
genList.sort();
