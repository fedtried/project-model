function passCheck(){
    if(prompt("Please enter your password","") == "letmein"){
        document.getElementById("passwordprotected").classList.toggle("invisible");
        alert("Welcome");  
    }else{
      window.location = "https://www.google.co.uk/";
    }
  }

var denominator =0;
var energyGenerated =0;
var capacity = 3.6;
var numTurbines = 175;
var availability = 0.9989;
var capacityFactor=0.789;

document.getElementById("CAPEX").value = "1950000000";
document.getElementById("life").value = "25";
document.getElementById("IR").value = "2";
document.getElementById("price").value = "34";
document.getElementById("diver").value = "23";
document.getElementById("ROC").value = "45";
document.getElementById("avail").value = "99.89";
document.getElementById("capfactor").value = "78.9";
document.getElementById("numberofturbines").value = "175";
document.getElementById("turbinecapacity").value = "3.6";

function showChange(){
    var selected_scenario = document.getElementById("scenario").value;
    document.getElementById("scenario_display").innerText = selected_scenario;
    firstrun=false;
    if(selected_scenario == "Divers"){
        document.getElementById("scenario_recommend").innerText = "23";
        document.getElementById("diver").value = "23";
    }
    else if(selected_scenario == "ROVs"){
        document.getElementById("scenario_recommend").innerText = "2";
        document.getElementById("diver").value = "2";
    }
    else if(selected_scenario == "AUVs"){
        document.getElementById("scenario_recommend").innerText = "2";
        document.getElementById("diver").value = "2";
    }
}

function showAdvanced(){
    var advs = document.getElementsByClassName("advs");
    for(var i=0; i<advs.length; i++) {
        advs[i].classList.toggle("invisible");
    }
    if(document.getElementById("advancedsettings").checked){
        document.getElementById("avail").style.visibility = "visible";
        document.getElementById("capfactor").style.visibility = "visible";
        document.getElementById("numberofturbines").style.visibility = "visible";
        document.getElementById("turbinecapacity").style.visibility = "visible";
    }
    else {
        document.getElementById("avail").style.visibility = "hidden";
        document.getElementById("capfactor").style.visibility = "hidden";
        document.getElementById("numberofturbines").style.visibility = "hidden";
        document.getElementById("turbinecapacity").style.visibility = "hidden";
    }

}

function CAPEX(){
    var initial = parseInt(document.getElementById("CAPEX").value);
    var lifespan = parseFloat(document.getElementById("life").value);
    var interest = parseFloat(document.getElementById("IR").value)/100;
    var capitalrepayment = initial/lifespan;
    var i;
    var cap=0;
    var expense =0;
    for (i=0; i<lifespan;i++){
        expense = capitalrepayment + (initial*interest);
        cap = cap + expense;
        initial = initial - capitalrepayment;
    }
    denominator = Math.pow((1+interest), lifespan);
    return cap;
}

function activityBased(){
    var selected_scenario = document.getElementById("scenario").value;
    var numberNeeded = parseInt(document.getElementById("diver").value);
    var totalTechnicians =0;
    var divertotal =0;
    var rovtotal =0;
    var auvtotal =0;
    if(selected_scenario == "Divers"){
       var totalTechnicians = numberNeeded * 3;
       var supervisors = totalTechnicians/3;
       var othertechnicians = totalTechnicians-supervisors;
       var boats= Math.ceil((totalTechnicians+numberNeeded)/12);
       divertotal = (numberNeeded*580)+(supervisors*516)+(othertechnicians*276)+(boats*2345)+9230+(boats*20);
    }
    else if(selected_scenario == "ROVs"){
        var boats= Math.ceil((totalTechnicians+numberNeeded)/12); 
        rovtotal = (numberNeeded*4075)+(boats*2345)+9230+(boats*20);
        
    }
    else if(selected_scenario == "AUVs"){
        var upfront = numberNeeded*70000;
        var operations = numberNeeded*1000;
        var boats= Math.ceil((totalTechnicians+numberNeeded)/12); 
        auvtotal = operations+(boats*2345)+(boats*20);
    }
    return (divertotal+rovtotal+auvtotal);
}

function OPEX(){
    var bop = activityBased();
    var selected_scenario = document.getElementById("scenario").value;
    var numberNeeded = parseInt(document.getElementById("diver").value);
    if (selected_scenario == "AUV"){
        var lower = 315000+283000+2520000+252000+1500000+50400+6300000+3311000+((bop*180)+(numberNeeded*70000))+504000+252000;
        var upper = 630000+882000+3780000+252000+3000000+113400+17640000+3311000+((bop*200)+(numberNeeded*70000))+100800+630000;
    }
    else {
        var lower = 315000+283000+2520000+252000+1500000+50400+6300000+3311000+(bop*180)+504000+252000;
        var upper = 630000+882000+3780000+252000+3000000+113400+17640000+3311000+(bop*200)+100800+630000;
    }
    return (lower+upper)/2;
}

function revenue(){
    var time=365*24;
    availability = parseFloat(document.getElementById("avail").value)/100;
    capacityFactor = parseFloat(document.getElementById("capfactor").value)/100;
    numTurbines = parseFloat(document.getElementById("numberofturbines").value);
    capacity = parseFloat(document.getElementById("turbinecapacity").value);
    energyGenerated=capacity*numTurbines*availability*capacityFactor*time;
    var ROC = parseFloat(document.getElementById("ROC").value);
    var wholesale = parseFloat(document.getElementById("price").value);
    var lifespan = parseFloat(document.getElementById("life").value);
    var i;
    var rev=0;
    for(i=0;i<lifespan;i++){
        rev=rev+(energyGenerated*ROC*2)+(energyGenerated*wholesale);
    }
    return rev;
}

function run(){
    var rev = revenue();
    var capex = Number(CAPEX().toPrecision(2));
    var opex = Number(OPEX().toPrecision(2));
    var ex = (capex+(opex*25))/denominator;
    ex = Number(ex.toPrecision(2));
    var lcoe = ex/(energyGenerated*25);
    lcoe = Number(lcoe.toPrecision(2));
    energyGenerated = Number(energyGenerated.toPrecision(2));
    document.getElementById("opexout").innerHTML = "£" + opex;
    document.getElementById("genout").innerHTML = energyGenerated + "MWh";
    document.getElementById("exout").innerHTML = ex;
    document.getElementById("lcoeout").innerHTML = "£" + lcoe + "/MWh";

    var ctxopex = document.getElementById("pie-chart-opex").getContext('2d');
    var myChart = new Chart(ctxopex, {
        type: 'pie',
        data: {
            labels: ["Training", "Onshore Logistics", "Offshore Logistics", "Turbine Maintenance", "OFTO", "BOP", "Admin"],
            datasets: [{
              label: "OPEX costs",
              backgroundColor: ["#5b3758", "#c65b7c","#f9627d","#f9ada0","#83b692", "#90be6d", "#9cafb7"],
              data: [472500,582500,5733900,11970000,3311000,opex,1197000]
            }]
          },
      options: {
        tooltips: {
      enabled: false
 },
          plugins: {
         datalabels: {
             formatter: (value, ctxopex) => {
             
               let sum = 0;
               let dataArr = ctxopex.chart.data.datasets[0].data;
               dataArr.map(data => {
                   sum += data;
               });
               let percentage = (value*100 / sum).toFixed(2)+"%";
               return percentage;
             },
             color: '#fff',
                  }
     }
 }
    }); 

    var ctxlcoe = document.getElementById("pie-chart-lcoe").getContext('2d');
    var myChart = new Chart(ctxlcoe, {
        type: 'pie',
        data: {
          labels: ["OPEX", "CAPEX"],
          datasets: [{
            label: "Total Costs",
            backgroundColor: ["#3e95cd", "#8e5ea2"],
            data: [opex*25, capex]
          }]
        },
        options: {
            tooltips: {
          enabled: false
     },
              plugins: {
             datalabels: {
                 formatter: (value, ctxlcoe) => {
                 
                   let sum = 0;
                   let dataArr = ctxlcoe.chart.data.datasets[0].data;
                   dataArr.map(data => {
                       sum += data;
                   });
                   let percentage = (value*100 / sum).toFixed(2)+"%";
                   return percentage;
                 },
                 color: '#fff',
                      }
         }
     }
    }); 

}
