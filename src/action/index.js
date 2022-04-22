import * as actiontype from "./type"

export const activeuser = (id)=>{
    return{
        type:actiontype.ACTIVE_USER,
        payload:{
            activeuserid:id
        }
    }
}

export const activegroup= ()=>{
    return{
        type:actiontype.ACTIVE_GROUP
    }
}

export const groupmember=(memberid)=>{
    return{
        type:actiontype.GROUP_MENBER,
        payload:{
            groupmemberid:memberid
        }
    }
}