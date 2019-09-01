const readLine = require('readline');
const rl = readLine.createInterface({input : process.stdin,
                          output : process.stdout});

let a = Math.floor(Math.random()*10 + 1);
let b = Math.floor(Math.random()*10 + 1);
let ans = a+b;

rl.question(`What's ${a} + ${b} equal to ?? \n`,
(user_ip) => {
    if(user_ip.trim() == ans){console.log(user_ip+" : correct!"); rl.close();}
    else { 
           rl.setPrompt("Boo! ");
           rl.prompt();
         }
});

rl.on('close', ()=>{
    console.log('Closed');
})