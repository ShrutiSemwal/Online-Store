import axios from 'axios'
import AWN from "awesome-notifications"
import {initAdmin} from './admin'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
 
// Set global options
let globalOptions =   {durations: {success: 0}}
// Initialize instance of AWN
let notifier = new AWN(globalOptions)

function updateCart(item){  
    axios.post('/update-cart',item).then(res => {
        cartCounter.innerText = res.data.totalQty
        // Set custom options for next call if needed, it will override globals
       let nextCallOptions =  {durations:  {success: 1000}}
       // Call one of available functions
       notifier.success('Your item is added to cart!', nextCallOptions)
    }).catch(err => {
        
       let nextCallOptions =  {durations:  {success: 1000}}
       notifier.alert('Something went wrong!', nextCallOptions)
    })

}

addToCart.forEach((btn) => {
   btn.addEventListener('click', (e)=>{
       console.log(e)
       let item = JSON.parse(btn.dataset.item)
       updateCart(item)
       
   } )
})

//Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove()
    }, 2000) //2 seconds
}

initAdmin()