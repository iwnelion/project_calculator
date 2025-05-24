let operatorOption='';
let nm1='';
let nm2='';
let expression='';              //for calculations inside of parentheses

const MaxDisplayLength=12;      //max num of chars in display

function add(n1, n2){
    return n1+n2;
}
function subtract(n1, n2){
    return n1-n2;
}
function multiply(n1, n2){
    return n1*n2;
}
function divide(n1, n2){
    if(n2!==0){
        return n1/n2;
    }else{
        return "Error: cannot divide by zero";
    }
}

function handleButton(value){
    const display=document.getElementById('display');

    if(value==='('){
        expression+='(';
        display.textContent+='(';
    }else if(value===')'){
        expression+=')';
        display.textContent+=')';
    }else if(isOperator(value)){
        if(nm1==='') return;    //prevents empty input
        if(operatorOption!==''){
            display.textContent=display.textContent.slice(0,-2)+' '+value+' ';      //uses the last operator that was clicked
        }else{
            operatorOption=value;
            display.textContent+=' '+value+' ';
        }
    }else if(value==='='){
        if(nm1==='' || nm2==='' || operatorOption==='') return;     //prevents calculation wo complete input
        let result=calc(parseFloat(nm1), operatorOption, parseFloat(nm2));
        if(typeof result==='string' && result.startsWith("Error:")){
            display.textContent=result;     //display error message
            nm1='';
            nm2='';
            operatorOption='';
        }else{
            display.textContent=formatResult(result);
            nm1=result;         //stores result for the next operation
            nm2='';             //clears nm2 for the next input
            operatorOption='';  //resets the operator
        }
    }else{
        if(value==='.'){
            //handle decimal point
            if(!operatorOption){
                if(!nm1.includes('.')){
                    nm1+=value;     //add decimal point to nm1 if it doesn't have one already
                    display.textContent+=value;
                }
            }else{
                if(!nm2.includes('.')){
                    nm2+=value;     //add decimal point to nm2 if it doesn't have one already
                    display.textContent+=value;
                }
            }
        }else{
            //handle number input
            if(!operatorOption){
                nm1+=value;     //concatenates digits for the first num
            }else{
                nm2+=value;     //concatenates digits for the second num
            }
            if(display.textContent.length<MaxDisplayLength){
                display.textContent+=value;     //updates display
            }
        }
    }
}

function formatResult(result){
    //converts the result to string and limits the length
    let resultStr=parseFloat(result).toFixed(2);        //for only 2 decimals
    if(resultStr.length>MaxDisplayLength){
        //"rounds" the result to fit the display
        resultStr=resultStr.slice(0,MaxDisplayLength);  //trim if it's still too big
    }
    return resultStr;
}

//checks if the given value is a valid operator
function isOperator(value){
    return ['+','-','*','/','^'].includes(value);
}

//calls the equivalent calculation function
function calc(nm1, operatorOption, nm2){
    switch(operatorOption){
        case '+':
            return add(nm1, nm2);
        case '-':
            return subtract(nm1, nm2);
        case '*':
            return multiply(nm1, nm2);
        case '/':
            return divide(nm1, nm2);
        case '^':
            return Math.pow(nm1, nm2);
        default:
            return 'Error: invalid operator';
    }
}

//handles all the buttons
let buttons=document.querySelectorAll('.num, .oper');
for(let i=0;i<buttons.length;i++){
    let button=buttons[i];
    button.addEventListener('click', ()=>{
        handleButton(button.textContent);
    });
}

//all clear button
const clear=document.getElementById('clr');
clear.addEventListener('click', ()=>{
    const display=document.getElementById('display');
    display.textContent='';
    nm1='';
    nm2='';
    operatorOption='';
    expression='';
});

//delete button
const del=document.getElementById('del');
del.addEventListener('click',delLastChar);
function delLastChar(){
    const display=document.getElementById('display');
    if(operatorOption===''){    //if there's no operator selected, it's changing nm1
        nm1=nm1.slice(0,-1);
        display.textContent=nm1;
    }else{                      //if an operator is selected, it's changing nm2
        if(nm2.length>0){
            nm2=nm2.slice(0,-1);
            display.textContent=nm1+' '+operatorOption+' '+nm2;
        }else{                  //if nm2 is empty, rm operator
            operatorOption='';
            display.textContent=nm1;
        }
    }
}

//square root button
const sqrtBtn=document.getElementById('sqrt');
sqrtBtn.addEventListener('click',getSqrt);
function getSqrt(){
    const display=document.getElementById('display');
    if(operatorOption===''){        //if no operator is selected, nm1 becomes sqrt of nm1
        if(nm1!==''){
            const numToBeSqrt=parseFloat(nm1);
            if(numToBeSqrt<=0){      //checks if input is negative or zero
                display.textContent='Error: square root of negative number';
                nm1='';
            }else{
                const result=Math.sqrt(numToBeSqrt);
                display.textContent=formatResult(result);
                nm1=result;
            }
        }
    }else{
        if(nm2!==''){               //if an operator is selected, nm2 becomes sqrt
            const numToBeSqrt=parseFloat(nm2);
            if(numToBeSqrt<=0){     //checks if input is negative or zero
                display.textContent='Error: square root of negative number';
                nm2='';
            }else{
                const result=Math.sqrt(numToBeSqrt);
                display.textContent=nm1+' '+operatorOption+' '+result;
                nm2=result;
            }
        }
    }
}

//random button
const randBtn=document.getElementById('rand');
randBtn.addEventListener('click',giveRandom);
function giveRandom(){
    const display=document.getElementById('display');
    const randNum=Math.floor(Math.random()*101);
    if(operatorOption===''){    //checks if operator is selected. if not, nm1 becomes the random num
        nm1=randNum.toString();
        display.textContent=randNum;
    }else{                      //otherwise, nm2 becomes the random
        nm2=randNum.toString();
        display.textContent=nm1+' '+operatorOption+' '+nm2;
    }
}

//factorial n! button
const factBtn=document.getElementById('factorial');
factBtn.addEventListener('click',givefactorial);
function givefactorial(){
    const display=document.getElementById('display');
    let n=parseInt(nm1);
    if(isNaN(n) || n<0){
        display.textContent="Error: factorial of negavite number";
    }else if(n>=452){
        display.textContent="Error: factorial too big";
    }else{
        let fact=factorial(n);
        nm1=fact.toString();
        display.textContent=nm1;
    }
}
function factorial(n){
    if(n===0 || n===1){
        return 1;
    }else{
        return n*factorial(n-1);    //recursion
    }
}

//sign +/- button
const sign=document.getElementById('sign');
sign.addEventListener('click',changeSign);
function changeSign(){
    const display=document.getElementById('display');
    if(operatorOption===''){    //if no operator is selected, change the sign of nm1
        nm1=(parseFloat(nm1)*-1),toString;  //convert to num, mult by -1, convert back to string
        display.textContent=nm1;
    }else{                      //if an operator is selected, change the sign of nm2
        nm2=(parseFloat(nm2)*-1),toString;
        display.textContent=nm1+' '+operatorOption+' '+nm2;
    }
}