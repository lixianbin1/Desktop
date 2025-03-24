import { defineStore } from "pinia";
export const userStore = defineStore('user',()=>{
    const initname = ref('Book')
    const setName=(name:string)=>{
        initname.value = name
    }
    const getName=()=>initname.value
    return{
        Name:computed(getName),
        setName
    }
})
export default{
    userStore
}