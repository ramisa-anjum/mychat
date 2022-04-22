import { combineReducers } from 'redux'
import { activeuser,groupmember } from '../action'
import * as actiontype from '../action/type'

const initialstate={
    id:null,
    name:null,
    loading:true
}
export const activeuser_reducer=(state=initialstate,action)=>{
     switch(action.type){
         case actiontype.ACTIVE_USER:
             return{
                 id:action.payload,
                 name:action.payload.name,
                 loading:false
             }
             default:
                 return state
     }
}

const memberstate={
    id:''
    
}
export const groupmember_reducer=(state=memberstate,action)=>{
    console.log(action)
    switch(action.type){
        case actiontype.GROUP_MENBER:
            return{
                id:action.payload,
                
            }
            default:
                 return state
    }
}
export const rootReducer = combineReducers({
    activeuserid:activeuser_reducer,
    groupcreateid:groupmember_reducer
})