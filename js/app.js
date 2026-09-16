// Arreglo principal para almacenar las órdenes
let orders = [];

// Elementos del DOM
const orderForm = document.getElementById('orderForm');
const ordersTableBody = document.getElementById('ordersTableBody');

// Inicializar la aplicación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    renderOrders();
});

// Manejar el envío del formulario con validaciones robustas
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const clientName = document.getElementById('clientName').value.trim();
    const garmentType = document.getElementById('garmentType').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);

    // Validación lógica: Nombre solo texto y espacios
    const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(clientName)) {
        alert('Error: El nombre del cliente solo debe contener letras.');
        return;
    }

    // Validación lógica: Cantidad y precio mayores a 0
    if (quantity <= 0 || isNaN(quantity)) {
        alert('Error: La cantidad debe ser un número entero mayor a cero.');
        return;
    }

    if (price <= 0 || isNaN(price)) {
        alert('Error: El precio debe ser mayor a cero.');
        return;
    }

    // Cálculo automático del total
    const total = quantity * price;

    // Crear objeto de nueva orden
    const newOrder = {
        id: Date.now().toString().slice(-6), // ID único corto basado en tiempo
        client: clientName,
        garment: garmentType,
        quantity: quantity,
        price: price,
        total: total,
        status: 'Recibido' // Estado inicial obligatorio
    };

    // Agregar al arreglo y guardar
    orders.push(newOrder);
    saveToLocalStorage();
    renderOrders();

    // Limpiar formulario
    orderForm.reset();
});

// Guardar en localStorage usando JSON.stringify
function saveToLocalStorage() {
    localStorage.setItem('lavanderia_orders', JSON.stringify(orders));
}

// Cargar desde localStorage usando JSON.parse
function loadFromLocalStorage() {
    const storedData = localStorage.getItem('lavanderia_orders');
    if (storedData) {
        orders = JSON.parse(storedData);
    }
}

// Renderizar las órdenes en la tabla HTML
function renderOrders() {
    ordersTableBody.innerHTML = '';

    if (orders.length === 0) {
        ordersTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #64748b;">No hay órdenes registradas.</td></tr>`;
        return;
    }

    orders.forEach((order) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.client}</td>
            <td>${order.garment}</td>
            <td>${order.quantity}</td>
            <td>$${order.price.toFixed(2)}</td>
            <td><strong>$${order.total.toFixed(2)}</strong></td>
            <td>
                <select class="status-select" onchange="updateStatus('${order.id}', this.value)">
                    <option value="Recibido" ${order.status === 'Recibido' ? 'selected' : ''}>Recibido</option>
                    <option value="En proceso" ${order.status === 'En proceso' ? 'selected' : ''}>En proceso</option>
                    <option value="Listo para recoger" ${order.status === 'Listo para recoger' ? 'selected' : ''}>Listo para recoger</option>
                </select>
            </td>
            <td>
                <button class="btn-delete" onclick="deleteOrder('${order.id}')">Eliminar</button>
            </td>
        `;

        ordersTableBody.appendChild(row);
    });
}

// Función para cambiar el estado de la orden
function updateStatus(id, newStatus) {
    const order = orders.find(o => o.id === id);
    if (order) {
        order.status = newStatus;
        saveToLocalStorage();
    }
}

// Función para eliminar una orden
function deleteOrder(id) {
    if (confirm('¿Está seguro de eliminar esta orden?')) {
        orders = orders.filter(o => o.id !== id);
        saveToLocalStorage();
        renderOrders();
    }
}