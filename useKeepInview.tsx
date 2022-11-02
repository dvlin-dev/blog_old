import { useEffect } from "react";

function useKeepInView(parent:Element,child:Element) {
  
  useEffect(()=>{
   console.log(parent,child) 
  })
}