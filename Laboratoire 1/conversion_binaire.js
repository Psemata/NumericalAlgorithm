/**
 * Authors : Costa Bruno, Frossard Loïc, Izzo Valentino et Lopes Da Silva Diogo
 * Version : 21w11a
 */

/**
 * Fonction principale qui appelle les autres
 */
function sumbit(){ 
    //Récupère les éléments HTML   
    let float1 = document.getElementById("float1").value;
    let float2 = document.getElementById("float2").value;
    let labelResultFLoat = document.getElementById("resultFloat");
    let labelD = document.getElementById("dValue");
    let m = document.getElementById("m").value;
    
    //Affiche les deux nombres binaire
    if(m.length == 0 && float1.length == 0 && float2.length == 0){
        alert("Renseignez tous les inputs !!");
    }else{
        // Récupère les valeurs importantes à partir de m
        let e = findE(m);
        let d = findD(e);
        labelD.innerHTML = d;

        //Calcule de l'addition flottante
        labelResultFLoat.innerHTML = +float1 + +float2;
        
        //Convetit le premier float en binaire
        let sign1Binary = findSign(+float1);
        let float1MantisseExpo = findMantisse(Math.abs(float1));
        let exposant1Binary = conversion(float1MantisseExpo[1] + d, e);
        let mantisse1Binary = conversionMantisse(float1MantisseExpo[0], m);

        //Convetit le deuxième float en binaire
        let sign2Binary = findSign(+float2);
        let float2MantisseExpo = findMantisse(Math.abs(float2));
        let exposant2Binary = conversion(float2MantisseExpo[1] + d, e);    
        let mantisse2Binary = conversionMantisse(float2MantisseExpo[0], m);
        
        //Calcul le résultat
        result = addition([sign1Binary,exposant1Binary,mantisse1Binary],[sign2Binary, exposant2Binary, mantisse2Binary]);

        display("1", sign1Binary, exposant1Binary, mantisse1Binary, d, e);
        display("2", sign2Binary, exposant2Binary, mantisse2Binary, d, e);
        display("3", result[0], result[1], result[2]);
    }    
}

/**
 * Affiche les nombres flottants en binaire
 * Controle si les nombres flottant sont infini ou NaN
 */
 function display(nb, sign, exposant, mantisse, biais=0, e=0){
    if(biais == Math.pow(2, e+1)) {
        if(!mantisse.includes("1")){
            document.getElementById("floatB"+nb).innerHTML = "Infini";
        }else if(mantisse.includes("1")){
            document.getElementById("floatB"+nb).innerHTML = "NaN";
        }
    } else {
        let value = sign + " | " + exposant + " | " + mantisse;
        document.getElementById("floatB"+nb).innerHTML = value;
    }
}

/**
 * Fonction qui trouve et retourne E par rapport aux nombres de bits utilisés par la mantisse
 */
function findE(m){
    return Math.round(0.0001610394674 * Math.pow(m, 3) - 0.0167775333429 * Math.pow(m, 2) + 0.6485194756046 * m);
}

/**
 * Fonction qui calcule et retourne la valeur D (exposant biaisé) par rapport à E
 */
function findD(E){
    return Math.pow(2, E-1) - 1;
}

/**
 * Fonction qui retourne le signe de l'élément
 */
function findSign(float){
    return (float > 0) ? 0: 1;
}

/**
 * Fonction qui calcule la mantisse
 */
function findMantisse(float){
    let mantisse = float;
    let exposant = 0;
    while(mantisse >= 2 || mantisse < 1){
        if(float >= 2){
            exposant++;
            mantisse = mantisse / 2;
        }else if(float < 1){
            exposant--;
            mantisse = mantisse * 2;
        }
    }
    return [mantisse,exposant];
}

/**
 * Addition des deux nombres flottants
 */
function addition(nombre1, nombre2){
    let signRes = nombre1[0];
    let expoRes = nombre1[1];
    let mantisseRes = nombre1[2];


    // Ajustement sur l'exposant
    if(nombre1[1] != nombre2[1]){
        // Changement de l'exposant
        if (!whoIsBigger(nombre1[1], nombre2[1])){
            [nombre1, nombre2] = [nombre2, nombre1];
        }

        // Ajout des 1 pour le changement de l'exposant
        let counter = 0;
        while(nombre1[1] != nombre2[1]){
            nombre2[1] = additionBinary(nombre2[1],"1");
            counter++;
        }
        
        // Affectation de l'exposant à la réponse
        expoRes = nombre2[1];

        //Ajout du bit caché
        nombre1[2] = "1"+nombre1[2];
        nombre2[2] = "1"+nombre2[2];

        //Rotation de la mantisse selon les changements de l'exposant
        while(counter > 0){
            nombre2[2] = nombre2[2].substr(0,nombre2[2].length-1);
            nombre2[2] = "0" + nombre2[2];
            counter--;
        }

        //Addition des mantisses
        mantisseRes = additionBinary(nombre1[2], nombre2[2]);
        

        //Cas où l'addition des mantisses génère un bit supplémentaires
        if(mantisseRes.length != nombre1[2].length) {
            excedentary(mantisseRes);
            additionBinary(expoRes, "1");
        }

        //Normalise la mantisse
        mantisseRes = mantisseRes.substr(1, mantisseRes.length);
    }   

    //Retourne le nombre flottant
    return [signRes, expoRes, mantisseRes]
}

/**
 * Fonction qui additionne deux nombres binaires
 */
function additionBinary(string1, string2) {
    //Inverse les deux strings si la string1 est plus petite que la string2 en nombre de caractère
    if(string1.length < string2.length) {
        let tmp = string1;
        string1 = string2;
        string2 = tmp;
    }

    //augmente le nombre de caractère de la string2
    //Exemple : string1 = "011" string2 = "1"
    //string2 deviendra "001" pour qu'elle soit de la même taille que la string1
    let nombre1 = string1;
    let nombre2 = "";
    if(nombre1.length > string2.length){
        for(let i = 0; i < nombre1.length - string2.length; i++) {
            nombre2 += "0";
        }
        nombre2 += string2; 
    }else{
        nombre2 = string2;
    }
    
    //Addition binaire de droite a gauche pour prendre en compte la retenu
    let carry = "0";
    let resultat = "";
    for(let i = nombre1.length-1; i >= 0; i--){
        let temp = parseInt(nombre1[i]) + parseInt(nombre2[i]) + parseInt(carry);
        if(temp == 3){
            carry = "1";
            resultat += "1";
        }else if(temp == 2){
            carry = "1";
            resultat += "0";
        }else if(temp == 1){
            carry = "0";
            resultat += "1";
        }else{
            carry = "0";
            resultat += "0";
        }
    }
    //Ajout de la retenu au résultat
    resultat += (carry === "1") ? "1" : "";
    
    //Inversion de la string pour la mettre a l'endroit
    return reverseString(resultat);
}

/**
 * Convertit un nombre un binaire
 * Algorithme basique utilisant les modulos
 */
function conversion(number, nBits){    
    let bits = "";
    let index = 0;
    if(number < Math.pow(2, nBits)){
        while(index < nBits){
            let bit;
            if(number != 0){
                bit = number % 2;
                number = Math.floor(number/2);
            } else {
                bit = 0;
            }
            bits = bit.toString().concat(bits);
            index++;
        }
    } else {
        bits = "conversion impossible";
    }
    return bits;
}

/**
 * Convertit le nombre mantisse en binnaire
 */
function conversionMantisse(float, m){    
    let nbBit = m;
    let bits = "";
    float -= 1;
    while(nbBit > 0){
        float *= 2;
        if (float >= 1) {
            float -= 1;
            bits += "1";
        } else {
            bits += "0";           
        }        
        nbBit--;
    }
    return bits;
}

/**
 * Fonction qui renverse une string
 */
function reverseString(str) {
    return (str === '') ? '' : reverseString(str.substr(1)) + str.charAt(0);
}

/**
 * Fonction qui modifie la mantisse finale selon la règle du bit excédentaire
 */
function excedentary(mantisseRes) {
    excedent = mantisseRes.charAt(mantisseRes.length-1);
    prec = mantisseRes.charAt(mantisseRes.length-2);
    if((excedent == "0") || (excedent == "1" && prec == "0")) {
        mantisseRes = mantisseRes.substr(0,mantisseRes.length-1); 
    } else if(excedent == "1" && prec == "1") {
        mantisseRes = mantisseRes.substr(0,mantisseRes.length-1);
        additionBinary(mantisseRes, "1");
        excedentary(mantisseRes);
    }
    return mantisseRes;
}

/**
 * Fonction qui compare deux nombres binaires et retourne l'élément le plus petit
 * Prends en compte, que les nombres sont de la même taille
 */
function whoIsBigger(nombre1, nombre2){
    for(let i = 0; i < nombre1.length ; i++){
        if(nombre1[i] != nombre2[i]) {
            if(nombre1[i] == "1") {
                return true;
            }
            return false;
        }
    }
}