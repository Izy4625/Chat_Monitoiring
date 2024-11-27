import { suspiciousWords } from "../utils/suspiciousWords";


export const messageCheck = (data: string):boolean =>{
      const arr: string[] = data.split(' ')
      console.log(arr);
      let flag: boolean = false
    arr.forEach((a)=>{
        if(suspiciousWords.includes(a)){
            flag = true
        }
    })
    return flag
} 