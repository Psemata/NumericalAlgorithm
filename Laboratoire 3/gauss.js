//Class Matrix
class Matrix {
    constructor(jsonMatrix) {
        // Dimension of the matrix
        this.dim = jsonMatrix.n[0];
        
        // Squared matrix (dimXdim)
        this.matrix = new Array();
        for(let i = 0; i < this.dim; i++) {
            let line = new Array();
            for(let j = 0; j < this.dim; j++) {
                line.push(jsonMatrix.A[i*this.dim+j]);
            }
            // Last line which will receive the equation's answer vector in it
            line.push(jsonMatrix.B[i]);
            this.matrix.push(line);
        }
    }
      
    // Substract <c> times line one to line two
    subLines(c, lineOne, lineTwo) {
        for(let i = 0; i < this.dim+1; i++) {
            this.matrix[lineTwo][i] -= c*this.matrix[lineOne][i];
        }
    }
    
    // Multiply <c> times a line given
    multiplyLine(c, line) {
      for(let i = 0; i < this.dim+1; i++) {
        this.matrix[line][i] *= c;
      }
    }

    // Exchange two selected lines
    swapLines(lineOne, lineTwo) {
        let temp = this.matrix[lineTwo];
        this.matrix[lineTwo] = this.matrix[lineOne];
        this.matrix[lineOne] = temp;
    }
}

// Execute the process
function execute() {
    let json = document.getElementById('input').value;
    let jsonMatrix = JSON.parse(json);
    let matrix = new Matrix(jsonMatrix);
    gauss(matrix);
}

/**
 * Function created to swap lines if the next pivot is different of 0
 * @param {matrix}
 * @param {line}
 * @return {boolean} true if there is an error
 */
function swapWithPivot(matrix, line) {
    for (let i = line+1; i < matrix.dim ; i++) {
        if (matrix.matrix[i][line]!=0) {
            matrix.swapLines(i, line);
            return true;
        }
    }
    return false;
}
  
/**
 * Theorem of Gauss
 * @param {matrix}
 */
function gauss(matrix) {
    //Start Timer
    startTimer();
    for(let j = 0; j < matrix.dim; j++) {        
        //Check if the "Pivot" equals to 0
        if (matrix.matrix[j][j] == 0) {
            // If it can't swap line (meaning there isn't any other value different of 0) then return and show the error
            // If the swap is done, then all is good
            if(!swapWithPivot(matrix, j)) {
                showError();
                return;
            }
        }
        
        // Make so that the pivot is equal to 1
        matrix.multiplyLine(1/matrix.matrix[j][j],j);
        
        // Make so that the other element below the diagonal are equal to 0
        for(let i = j + 1; i < matrix.dim; i++) {
            let c = matrix.matrix[i][j] / matrix.matrix[j][j];
            matrix.subLines(c,j,i);
        }
    }

    aboveDiagonal(matrix);
    // Display Time
    getTime();
    // Display the result
    showResult(matrix);
}
  
/**
 * Put the element above the diagonal to 0 so that the remaining matrix is a triangular matrix at 1
 * @param {matrix}
 */
function aboveDiagonal(matrix) {
    for(let i = matrix.dim-1; i > 0 ; i--) {
        for(let j = i; j > 0; j--) {
            let c = matrix.matrix[j-1][i];
            matrix.subLines(c,i,j-1);
        }
    }
}

/**
 * Start the timer
 */
function startTimer() {
    startTime = new Date();
}

/**
 * Diplay the time in to the HTML
 * Take the current time minus startTime
 */
function getTime() {
    document.getElementById("chronotime").innerHTML = ((new Date()) - startTime) + "ms";
}

/**
 * Display the result in to the HTML
 * @param {matrix}
 */
function showResult(matrix) {
    let str = "";
    for(let i = 0; i < matrix.dim; i++) {
        str += "x<sub>" + (i+1) + "</sub> = " + matrix.matrix[i][matrix.dim].toFixed(6) + "<br>";
    }
    document.getElementById("result").innerHTML = str;
}
  
/**
 * Diplay an error in to the HTML 
*/
function showError() {
    document.getElementById("result").innerHTML = "Ce système d'équations ne possède pas un set de solutions constantes";
}
  