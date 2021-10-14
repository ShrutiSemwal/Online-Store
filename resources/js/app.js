import axios from 'axios'
import AWN from "awesome-notifications"
import {initAdmin} from './admin'
import moment from 'moment'

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

//Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)  //converting string to object
let time = document.createElement('small')


function updateStatus(order){
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
       let stepCompleted = true;
       statuses.forEach((status)=> {
          let dataProp = status.dataset.status
          if(stepCompleted){
              status.classList.add('step-completed')
          }

          if(dataProp === order.status){
              stepCompleted = false;
              time.innerText = moment(order.updatedAt).format('hh:mm A')
              status.appendChild(time)
              if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
              }  
          }
       })

}

updateStatus(order);

//Socket
let socket = io()
initAdmin(socket)
// Join
if(order){
    socket.emit('join', `order_${order._id}`) //order_sgjhfbvjhhhhm
}

let adminAreaPath =  window.location.pathname
console.log(adminAreaPath)
if(adminAreaPath.includes('admin')) {
      socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    let nextCallOptions =  {durations:  {success: 1000}}
    notifier.success('Order status updated!', nextCallOptions)
    
})

