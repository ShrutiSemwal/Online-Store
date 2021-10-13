import axios from 'axios'
import moment from 'moment'
import AWN from "awesome-notifications"

function initAdmin(){
    const orderTableBody = document.querySelector('#orderTableBody')
    let orders = []

    let markup 

    axios.get('/admin/orders', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data
        markup = generateMarkup(orders)
        orderTableBody.innerHTML = markup
    }).catch(err => {
        console.log(err)
    })

    function renderItems(objects) {
        let parsedItems = Object.values(objects)
        return parsedItems.map((storeItem) => {
            return `
            <p> ${storeItem.object.name} - ${storeItem.qty} items </p>
            `
        }).join('')
    }

    function generateMarkup(orders){
        return orders.map(order => {
            return `
            <tr>
            <td class="border px-4 py-2 text-green-900">
            <p> ${order._id}</p>
            <div> ${ renderItems(order.objects)}</div>
            </td>
            <td class="border px-4 py-2"> ${order.customerId.name} </td>
            <td class="border px-4 py-2"> ${order.customerId.phone} </td>
            <td class="border px-4 py-2"> ${order.address}</td>
            <td class="border px-4 py-2">
            <div class ="inline-block relative w-64">
               <form action="/admin/order/status" method="POST">
                 <input type="hidden" name="orderId" value="${order._id}">
                 <select name="status" onchange="this.form.submit()"
                    class="block appearance-none w-full bg-white border
                    border-gray-400 hover:border-gray-500 px-4 py-2 pr-8
                    rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                    <option value="order_placed"
                      ${order.status === 'order_placed' ? 'selected': ''}>
                      Placed</option>
                    <option value="confirmed"
                      ${order.status === 'confirmed' ? 'selected': ''}>
                      Confirmed</option>
                    <option value="prepared"
                      ${order.status === 'prepared' ? 'selected': ''}>
                      Prepared</option>
                    <option value="delivered"
                      ${order.status === 'delivered' ? 'selected': ''}>
                      Delivered</option>
                    <option value="completed"
                      ${order.status === 'completed' ? 'selected': ''}>
                      Completed</option>
                </select>
            </form>

            <div class="relative inline-block text-left">
      <div>
    <button type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="menu-button" aria-expanded="true" aria-haspopup="true">
      Options
      <!-- Heroicon name: solid/chevron-down -->
      <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
  </div>
  </td>
  <td class="border px-4 py-2">
     ${moment(order.createdAt), format('hh:mm A')}
</td>
</tr>
            `
        })
    }
}

module.exports = initAdmin