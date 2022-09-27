/**
 * Authors : Costa Bruno, Frossard Loïc, Izzo Valentino et Lopes Da Silva Diogo
 * Version : 21w14a
 */

// Valeurs importantes au bon fonctionnement du programme
var max = 100;
var min = -100;
var step = 0.01;
var delta = 0.015; // valeur d'incertitude max
document.getElementById("incertitude").innerHTML = delta;

// Points y des deux fonctions
let function1 = new Array();
let function2 = new Array();

// Les racines de la première fonction
let func_zeros_x_1 = new Array();
let func_zeros_y_1 = new Array();

// Les racines de la seconde fonction
let func_zeros_x_2 = new Array();
let func_zeros_y_2 = new Array();

// Range des points (selon les steps, la valeur min et la valeur max)
let rangeMinMax = range(min, max, step);

// Calcul tous les points des deux fonctions étudiées
for(let i = min ; i <= max ; i += step){
    function1.push(Math.sin(i) - i/13);
    function2.push(i / (Math.round( (1 - Math.pow(i,2)) * 100 ) / 100));    
}

// Calcul des racines des fonctions
dichotomie(0, function1.length, function1, true);
dichotomie(0, function2.length, function2, false);

// Function 1 : sin(x) - x/13
var func1_plot = {
    x: rangeMinMax,
    y: function1,
    type: 'scatter',
    name: 'sin(x) - x/13'
};

// Function 2 : x / (1 - x^2)
var func2_plot = {
    x: rangeMinMax, 
    y: function2,
    type: 'scatter',
    name: 'x / (1 - x^2)'
};

// Les racines de la 1ère fonction
var dot_func1 = {
    x: func_zeros_x_1,
    y: func_zeros_y_1,
    mode: 'markers',
    type: 'scatter',
    name: 'Racines',
    marker: {
        color: 'rgb(255, 20, 20)'
    }
  };

// Les racines de la 2ème fonction
var dot_func2 = {
    x: func_zeros_x_2,
    y: func_zeros_y_2,
    mode: 'markers',
    type: 'scatter',
    name: 'Racines',
    marker: {
        color: 'rgb(255, 20, 20)'
    }
  };

// Dessin de la première fonction
changeFunction(1);

// Fonction qui retourne une range de min à max
function range(min, max, step) {
    let len = ((max - min) / step) +1;
    let arr = new Array(len);
    for (let i=0; i<len; i++) {
        arr[i] = min + (step*i);
    }
    return arr;
}

// Fonction de recherches des racines par dichotomies
function dichotomie(begin, end, func, who) {
    if((end - begin) < 2){
        return 0;
    }

    console.log("begin : " + begin + " end : " + end);

    let a = begin;
    let b = end;
    let m = begin + Math.round((b - a) / 2);

    // Récupère la valeur si elle vaut ~0
    if(Math.abs(func[m]) < delta) {
        if(who) {
            func_zeros_x_1.push(rangeMinMax[m]);
            func_zeros_y_1.push(func[m]);
        } else {
            func_zeros_x_2.push(rangeMinMax[m]);
            func_zeros_y_2.push(func[m]);
        }        
    }

    dichotomie(a, m-1, func, who);        
    dichotomie(m+1, b, func, who);
}

// Fonction qui dessine le graphe
function draw() {
    // Data : Valeurs qui vont être dessinées
    let data = [plot,dot];

    // Layout de graphe (Configuration des axes)
    let layout = {
        yaxis: {
            domain: [Math.min(plot),Math.max(plot)],
            anchor: 'x2'
        },
        xaxis: {
            domain: [min, max],
            anchor: 'y2'
        }
    };
  
    Plotly.newPlot('caneva', data, layout);
}

function calculError(who){
    let avg = 0;
    if(who) {
        for(let i = 0; i< func_zeros_y_1.length;i++) {
            avg += Math.abs(func_zeros_y_1[i]);
        }
        avg = avg / func_zeros_y_1.length
    } else {
        for(let i = 0; i< func_zeros_y_1.length;i++) {
            avg += Math.abs(func_zeros_y_2[i]);
        }
        avg = avg / func_zeros_y_2.length
    }
    return avg;
}

// Change la fonction qui va être dessinée
function changeFunction(nb){
    if(nb === 1){
        plot = func1_plot;
        dot = dot_func1;
        document.getElementById("incertitudeReel").innerHTML = calculError(true);
    }else{
        plot = func2_plot;
        dot = dot_func2;
        document.getElementById("incertitudeReel").innerHTML = calculError(false);
    }
    draw();
}