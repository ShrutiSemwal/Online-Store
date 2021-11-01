import axios from 'axios'
import {initAdmin} from './admin'
import AWN from "awesome-notifications"
import moment from 'moment'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
 
function updateCart(item){  
    axios.post('/update-cart',item).then(res => {
        cartCounter.innerText = res.data.totalQty
        let globalOptions =   {durations: {success: 0}}
        let notifier = new AWN(globalOptions)
       notifier.success('Your item is added to cart!', {durations: {success: 2000}})
    }).catch(err => {
       notifier.alert('Something went wrong!', {durations: {success: 2000}})
    })

}

addToCart.forEach((btn) => {
   btn.addEventListener('click', (e)=>{
       let item = JSON.parse(btn.dataset.store)
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

// Join
if(order){
    socket.emit('join', `order_${order._id}`) //order_sgjhfbvjhhhhm
}

let adminAreaPath =  window.location.pathname
if(adminAreaPath.includes('admin')) {
      initAdmin(socket)
      socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    let globalOptions =   {durations: {success: 0}}
    let notifier = new AWN(globalOptions)
    let nextCallOptions =  {durations:  {success: 1000}}
    notifier.success('Order status updated!', nextCallOptions)
    
})

