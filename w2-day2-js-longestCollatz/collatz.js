function longestCollatz() {
  let obj={};
  let maxNum=0;
  let maxLen=0;
  for(let i=2;i<1000000;i++){
    let x=i;
    let arr=[x];
    while(x!==1&&!(x in obj)){
      if(x%2===0){
        x=x/2;
      }else{
        x=x*3+1;
      }
      arr.push(x);
    }
    let zincirUzunlugu=(x in obj)?obj[x]:1;
    for(let k=arr.length-1;k>=0;k--){
      obj[arr[k]] = zincirUzunlugu++;
    }
    if(obj[i]>maxLen){
      maxLen=obj[i];
      maxNum=i;
    }
  }
  console.log(`En uzun zincire sahip sayı: ${maxNum} (${maxLen} adım)`);
}
longestCollatz();
