const API_BASE = 'http://localhost:50000/api';

let chartsInstances = {
  topCustomersChart: null,
  topProductsChart: null,
  timeSeriesChart: null,
  productLineChart: null
};

// ============ Tab Navigation ============
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active from all buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  document.getElementById(tabName).classList.add('active');

  // Add active to clicked button
  event.target.classList.add('active');

  // Load chart data if charts tab
  if (tabName === 'charts') {
    setTimeout(() => {
      loadAllCharts();
    }, 100);
  }
}

// ============ SEARCH FUNCTIONS ============
async function searchCustomers() {
  const keyword = document.getElementById('customerKeyword').value.trim();
  if (!keyword) {
    alert('Vui lòng nhập từ khóa tìm kiếm');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/search/customers?keyword=${encodeURIComponent(keyword)}`);
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      displayCustomerResults(result.data);
    } else {
      document.getElementById('customerResults').innerHTML = 
        '<div class="empty">Không tìm thấy khách hàng nào</div>';
    }
  } catch (error) {
    document.getElementById('customerResults').innerHTML = 
      `<div class="error">Lỗi: ${error.message}</div>`;
  }
}

async function searchProducts() {
  const keyword = document.getElementById('productKeyword').value.trim();
  if (!keyword) {
    alert('Vui lòng nhập từ khóa tìm kiếm');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/search/products?keyword=${encodeURIComponent(keyword)}`);
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      displayProductResults(result.data);
    } else {
      document.getElementById('productResults').innerHTML = 
        '<div class="empty">Không tìm thấy sản phẩm nào</div>';
    }
  } catch (error) {
    document.getElementById('productResults').innerHTML = 
      `<div class="error">Lỗi: ${error.message}</div>`;
  }
}

async function searchOrdersByDate() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (!startDate || !endDate) {
    alert('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc');
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE}/search/orders?startDate=${startDate}&endDate=${endDate}`
    );
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      displayOrderResults(result.data);
    } else {
      document.getElementById('orderResults').innerHTML = 
        '<div class="empty">Không tìm thấy đơn hàng nào</div>';
    }
  } catch (error) {
    document.getElementById('orderResults').innerHTML = 
      `<div class="error">Lỗi: ${error.message}</div>`;
  }
}

// ============ GLOBAL SEARCH WITH CATEGORY FILTER ============
async function globalSearchWithCategory() {
  const keyword = document.getElementById('globalKeyword').value.trim();
  if (!keyword) {
    alert('Vui lòng nhập từ khóa tìm kiếm');
    return;
  }

  const searchCustomers = document.getElementById('searchCustomersCat').checked;
  const searchProducts = document.getElementById('searchProductsCat').checked;
  const searchOrders = document.getElementById('searchOrdersCat').checked;

  if (!searchCustomers && !searchProducts && !searchOrders) {
    alert('Vui lòng chọn ít nhất 1 danh mục');
    return;
  }

  let html = '<div style="display: grid; gap: 20px;">';

  try {
    // Search Customers
    if (searchCustomers) {
      const response = await fetch(`${API_BASE}/search/customers?keyword=${encodeURIComponent(keyword)}`);
      const result = await response.json();
      
      html += '<div>';
      html += '<h4 style="color: #667eea; margin-bottom: 10px;">👥 Kết quả Khách hàng (' + (result.data?.length || 0) + ')</h4>';
      if (result.success && result.data.length > 0) {
        html += '<table style="width: 100%;"><thead><tr><th>Mã</th><th>Tên</th><th>Thành phố</th><th>Quốc gia</th></tr></thead><tbody>';
        result.data.slice(0, 5).forEach(item => {
          html += `<tr><td>${item.customerNumber}</td><td>${item.customerName}</td><td>${item.city || '-'}</td><td>${item.country}</td></tr>`;
        });
        html += '</tbody></table>';
      } else {
        html += '<p style="color: #999;">Không tìm thấy</p>';
      }
      html += '</div>';
    }

    // Search Products
    if (searchProducts) {
      const response = await fetch(`${API_BASE}/search/products?keyword=${encodeURIComponent(keyword)}`);
      const result = await response.json();
      
      html += '<div>';
      html += '<h4 style="color: #667eea; margin-bottom: 10px;">📦 Kết quả Sản phẩm (' + (result.data?.length || 0) + ')</h4>';
      if (result.success && result.data.length > 0) {
        html += '<table style="width: 100%;"><thead><tr><th>Mã</th><th>Tên</th><th>Dòng</th><th>Giá</th></tr></thead><tbody>';
        result.data.slice(0, 5).forEach(item => {
          html += `<tr><td>${item.productCode}</td><td>${item.productName}</td><td>${item.productLine}</td><td>$${parseFloat(item.buyPrice).toFixed(2)}</td></tr>`;
        });
        html += '</tbody></table>';
      } else {
        html += '<p style="color: #999;">Không tìm thấy</p>';
      }
      html += '</div>';
    }

    // Search Orders
    if (searchOrders) {
      const response = await fetch(`${API_BASE}/search/orders?startDate=&endDate=`);
      const result = await response.json();
      
      // Filter orders by keyword in comment or customer name
      let filteredOrders = (result.data || []).filter(order => 
        (order.comments && order.comments.toLowerCase().includes(keyword.toLowerCase())) ||
        (order.customer && order.customer.customerName.toLowerCase().includes(keyword.toLowerCase()))
      ).slice(0, 5);

      html += '<div>';
      html += '<h4 style="color: #667eea; margin-bottom: 10px;">📋 Kết quả Đơn hàng (' + filteredOrders.length + ')</h4>';
      if (filteredOrders.length > 0) {
        html += '<table style="width: 100%;"><thead><tr><th>Số đơn</th><th>Khách</th><th>Ngày</th><th>Trạng thái</th></tr></thead><tbody>';
        filteredOrders.forEach(item => {
          html += `<tr><td>${item.orderNumber}</td><td>${item.customer.customerName}</td><td>${item.orderDate}</td><td>${item.status}</td></tr>`;
        });
        html += '</tbody></table>';
      } else {
        html += '<p style="color: #999;">Không tìm thấy</p>';
      }
      html += '</div>';
    }

    html += '</div>';
    document.getElementById('globalResults').innerHTML = html;

  } catch (error) {
    document.getElementById('globalResults').innerHTML = `<div class="error">Lỗi: ${error.message}</div>`;
  }
}

// ============ ADVANCED ORDER SEARCH ============
async function advancedSearchOrders() {
  const startDate = document.getElementById('advStartDate').value;
  const endDate = document.getElementById('advEndDate').value;
  const customerNumber = document.getElementById('advCustomerNumber').value;
  const status = document.getElementById('advStatus').value;
  const productCode = document.getElementById('advProductCode').value;

  if (!startDate && !endDate && !customerNumber && !status && !productCode) {
    alert('Vui lòng chọn ít nhất 1 bộ lọc');
    return;
  }

  try {
    let url = `${API_BASE}/search/orders?`;
    if (startDate) url += `startDate=${startDate}&`;
    if (endDate) url += `endDate=${endDate}&`;
    if (customerNumber) url += `customerNumber=${customerNumber}&`;
    if (status) url += `status=${encodeURIComponent(status)}&`;
    if (productCode) url += `productCode=${encodeURIComponent(productCode)}&`;

    const response = await fetch(url);
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      displayAdvancedOrderResults(result.data);
    } else {
      document.getElementById('advancedOrderResults').innerHTML = 
        '<div class="empty">Không tìm thấy đơn hàng phù hợp</div>';
    }
  } catch (error) {
    document.getElementById('advancedOrderResults').innerHTML = 
      `<div class="error">Lỗi: ${error.message}</div>`;
  }
}

function displayAdvancedOrderResults(data) {
  let html = '<table><thead><tr>' +
    '<th>Số đơn</th><th>Khách hàng</th><th>Ngày đặt</th><th>Trạng thái</th><th>Sản phẩm</th><th>Số lượng</th></tr></thead><tbody>';

  data.forEach(order => {
    const products = order.details?.map(d => `${d.product.productName} (${d.quantityOrdered})`).join(', ') || 'N/A';
    const totalQuantity = order.details?.reduce((sum, d) => sum + d.quantityOrdered, 0) || 0;
    
    html += `<tr>
      <td>${order.orderNumber}</td>
      <td>${order.customer?.customerName || 'N/A'}</td>
      <td>${order.orderDate}</td>
      <td><span style="background: ${getStatusColor(order.status)}; padding: 5px 10px; border-radius: 5px; color: white;">${order.status}</span></td>
      <td>${products}</td>
      <td>${totalQuantity}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  document.getElementById('advancedOrderResults').innerHTML = html;
}

function getStatusColor(status) {
  const colors = {
    'Shipped': '#4CAF50',
    'Cancelled': '#f44336',
    'On Hold': '#FF9800',
    'Disputed': '#e91e63',
    'In Process': '#2196F3',
    'Resolved': '#009688'
  };
  return colors[status] || '#999';
}

function displayCustomerResults(data) {
  let html = '<table><thead><tr>' +
    '<th>Mã khách</th><th>Tên khách hàng</th><th>Thành phố</th>' +
    '<th>Quốc gia</th><th>Điện thoại</th></tr></thead><tbody>';

  data.forEach(customer => {
    html += `<tr>
      <td>${customer.customerNumber}</td>
      <td>${customer.customerName}</td>
      <td>${customer.city || '-'}</td>
      <td>${customer.country || '-'}</td>
      <td>${customer.phone || '-'}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  document.getElementById('customerResults').innerHTML = html;
}

function displayProductResults(data) {
  let html = '<table><thead><tr>' +
    '<th>Mã sản phẩm</th><th>Tên sản phẩm</th><th>Dòng</th>' +
    '<th>Giá mua</th><th>MSRP</th></tr></thead><tbody>';

  data.forEach(product => {
    html += `<tr>
      <td>${product.productCode}</td>
      <td>${product.productName}</td>
      <td>${product.productLine || '-'}</td>
      <td>${formatCurrency(product.buyPrice)}</td>
      <td>${formatCurrency(product.MSRP)}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  document.getElementById('productResults').innerHTML = html;
}

function displayOrderResults(data) {
  let html = '<table><thead><tr>' +
    '<th>Số đơn</th><th>Ngày đặt</th><th>Ngày giao</th>' +
    '<th>Trạng thái</th><th>Khách hàng</th></tr></thead><tbody>';

  data.forEach(order => {
    html += `<tr>
      <td>${order.orderNumber}</td>
      <td>${new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
      <td>${order.shippedDate ? new Date(order.shippedDate).toLocaleDateString('vi-VN') : '-'}</td>
      <td><span class="badge">${order.status}</span></td>
      <td>${order.customer ? order.customer.customerName : '-'}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  document.getElementById('orderResults').innerHTML = html;
}

// ============ STATISTICS FUNCTIONS ============
async function loadTopCustomers() {
  try {
    const response = await fetch(`${API_BASE}/statistics/top-customers?limit=10`);
    const result = await response.json();

    if (result.success) {
      displayTopCustomersTable(result.data);
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

async function loadTopProducts() {
  try {
    const response = await fetch(`${API_BASE}/statistics/top-products?limit=10`);
    const result = await response.json();

    if (result.success) {
      displayTopProductsTable(result.data);
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

async function loadStatsByCustomer() {
  try {
    const response = await fetch(`${API_BASE}/statistics/by-customer`);
    const result = await response.json();

    if (result.success) {
      displayStatsByCustomerTable(result.data);
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

async function loadStatsByTime() {
  try {
    const response = await fetch(`${API_BASE}/statistics/by-time`);
    const result = await response.json();

    if (result.success) {
      displayStatsByTimeTable(result.data);
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

async function loadStatsByProduct() {
  try {
    const response = await fetch(`${API_BASE}/statistics/by-product`);
    const result = await response.json();

    if (result.success) {
      displayStatsByProductTable(result.data);
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

function displayTopCustomersTable(data) {
  let html = '<table><thead><tr>' +
    '<th>Tên khách hàng</th><th>Quốc gia</th><th>Số đơn</th>' +
    '<th>Tổng doanh thu</th></tr></thead><tbody>';

  data.forEach(row => {
    html += `<tr>
      <td>${row.customerName}</td>
      <td>${row.country || '-'}</td>
      <td>${row.orderCount || 0}</td>
      <td>${formatCurrency(row.totalAmount)}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  document.getElementById('topCustomersTable').innerHTML = html;
}

function displayTopProductsTable(data) {
  let html = '<table><thead><tr>' +
    '<th>Tên sản phẩm</th><th>Số lượng bán</th>' +
    '<th>Doanh thu</th></tr></thead><tbody>';

  data.forEach(row => {
    html += `<tr>
      <td>${row.productName}</td>
      <td>${row.totalQuantity || 0}</td>
      <td>${formatCurrency(row.totalAmount)}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  document.getElementById('topProductsTable').innerHTML = html;
}

function displayStatsByCustomerTable(data) {
  let html = '<table><thead><tr>' +
    '<th>Tên khách hàng</th><th>Số đơn</th><th>Tổng doanh thu</th>' +
    '<th>Tổng số lượng</th></tr></thead><tbody>';

  data.slice(0, 15).forEach(row => {
    html += `<tr>
      <td>${row.customerName}</td>
      <td>${row.orderCount || 0}</td>
      <td>${formatCurrency(row.totalAmount)}</td>
      <td>${row.totalQuantity || 0}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  document.getElementById('statsByCustomerTable').innerHTML = html;
}

function displayStatsByTimeTable(data) {
  let html = '<table><thead><tr>' +
    '<th>Năm</th><th>Tháng</th><th>Số đơn</th><th>Doanh thu</th>' +
    '</tr></thead><tbody>';

  data.forEach(row => {
    const month = String(row.month).padStart(2, '0');
    html += `<tr>
      <td>${row.year}</td>
      <td>${month}</td>
      <td>${row.orderCount || 0}</td>
      <td>${formatCurrency(row.totalAmount)}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  document.getElementById('statsByTimeTable').innerHTML = html;
}

function displayStatsByProductTable(data) {
  let html = '<table><thead><tr>' +
    '<th>Tên sản phẩm</th><th>Dòng</th><th>Số đơn</th>' +
    '<th>Số lượng</th><th>Doanh thu</th></tr></thead><tbody>';

  data.slice(0, 15).forEach(row => {
    html += `<tr>
      <td>${row.productName}</td>
      <td>${row.productLine || '-'}</td>
      <td>${row.orderCount || 0}</td>
      <td>${row.totalQuantity || 0}</td>
      <td>${formatCurrency(row.totalAmount)}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  document.getElementById('statsByProductTable').innerHTML = html;
}

// ============ CHARTS FUNCTIONS ============
async function loadAllCharts() {
  await loadTopCustomersChart();
  await loadTopProductsChart();
  await loadTimeSeriesChart();
  await loadProductLineChart();
}

async function loadTopCustomersChart() {
  try {
    const response = await fetch(`${API_BASE}/statistics/top-customers?limit=10`);
    const result = await response.json();

    if (result.success) {
      const labels = result.data.map(r => r.customerName);
      const amounts = result.data.map(r => parseFloat(r.totalAmount) || 0);

      const ctx = document.getElementById('topCustomersChart').getContext('2d');
      
      if (chartsInstances.topCustomersChart) {
        chartsInstances.topCustomersChart.destroy();
      }

      chartsInstances.topCustomersChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Doanh thu ($)',
            data: amounts,
            backgroundColor: 'rgba(102, 126, 234, 0.6)',
            borderColor: 'rgba(102, 126, 234, 1)',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Error loading top customers chart:', error);
  }
}

async function loadTopProductsChart() {
  try {
    const response = await fetch(`${API_BASE}/statistics/top-products?limit=10`);
    const result = await response.json();

    if (result.success) {
      const labels = result.data.map(r => r.productName.substring(0, 20));
      const quantities = result.data.map(r => parseInt(r.totalQuantity) || 0);

      const ctx = document.getElementById('topProductsChart').getContext('2d');
      
      if (chartsInstances.topProductsChart) {
        chartsInstances.topProductsChart.destroy();
      }

      chartsInstances.topProductsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: quantities,
            backgroundColor: [
              'rgba(102, 126, 234, 0.8)',
              'rgba(118, 75, 162, 0.8)',
              'rgba(255, 107, 107, 0.8)',
              'rgba(66, 183, 245, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)',
              'rgba(255, 159, 64, 0.8)',
              'rgba(255, 205, 86, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(201, 203, 207, 0.8)'
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  } catch (error) {
    console.error('Error loading top products chart:', error);
  }
}

async function loadTimeSeriesChart() {
  try {
    const response = await fetch(`${API_BASE}/statistics/by-time`);
    const result = await response.json();

    if (result.success) {
      const sortedData = result.data.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });

      const labels = sortedData.map(r => 
        `${r.year}-${String(r.month).padStart(2, '0')}`
      );
      const amounts = sortedData.map(r => parseFloat(r.totalAmount) || 0);

      const ctx = document.getElementById('timeSeriesChart').getContext('2d');
      
      if (chartsInstances.timeSeriesChart) {
        chartsInstances.timeSeriesChart.destroy();
      }

      chartsInstances.timeSeriesChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Doanh thu theo tháng ($)',
            data: amounts,
            borderColor: 'rgba(102, 126, 234, 1)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(102, 126, 234, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Error loading time series chart:', error);
  }
}

async function loadProductLineChart() {
  try {
    const response = await fetch(`${API_BASE}/statistics/by-product`);
    const result = await response.json();

    if (result.success) {
      // Group by product line
      const groupedData = {};
      result.data.forEach(row => {
        const line = row.productLine || 'Unknown';
        if (!groupedData[line]) {
          groupedData[line] = 0;
        }
        groupedData[line] += parseFloat(row.totalAmount) || 0;
      });

      const labels = Object.keys(groupedData);
      const amounts = Object.values(groupedData);

      const ctx = document.getElementById('productLineChart').getContext('2d');
      
      if (chartsInstances.productLineChart) {
        chartsInstances.productLineChart.destroy();
      }

      chartsInstances.productLineChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: amounts,
            backgroundColor: [
              'rgba(102, 126, 234, 0.8)',
              'rgba(118, 75, 162, 0.8)',
              'rgba(255, 107, 107, 0.8)',
              'rgba(66, 183, 245, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)',
              'rgba(255, 159, 64, 0.8)'
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  } catch (error) {
    console.error('Error loading product line chart:', error);
  }
}

// ============ PIVOT FUNCTIONS ============
async function loadPivotData() {
  try {
    const response = await fetch(`${API_BASE}/statistics/pivot`);
    const result = await response.json();

    if (result.success) {
      displayPivotTable(result.data);
    }
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}

function displayPivotTable(data) {
  // Group data by customer and product line
  const pivotData = {};
  const customers = new Set();
  const productLines = new Set();

  data.forEach(row => {
    const customer = row.customerName;
    const line = row.productLine;
    customers.add(customer);
    productLines.add(line);

    if (!pivotData[customer]) {
      pivotData[customer] = {};
    }
    pivotData[customer][line] = parseFloat(row.totalAmount) || 0;
  });

  const customerArray = Array.from(customers).sort();
  const lineArray = Array.from(productLines).sort();

  // Build table
  let html = '<table><thead><tr><th>Khách hàng</th>';
  lineArray.forEach(line => {
    html += `<th>${line}</th>`;
  });
  html += '<th>Tổng cộng</th></tr></thead><tbody>';

  customerArray.forEach(customer => {
    html += `<tr><td><strong>${customer}</strong></td>`;
    let total = 0;

    lineArray.forEach(line => {
      const amount = pivotData[customer][line] || 0;
      total += amount;
      html += `<td>${formatCurrency(amount)}</td>`;
    });

    html += `<td><strong>${formatCurrency(total)}</strong></td></tr>`;
  });

  // Total row
  html += '<tr><td><strong>Tổng cộng</strong></td>';
  lineArray.forEach(line => {
    let lineTotal = 0;
    customerArray.forEach(customer => {
      lineTotal += pivotData[customer][line] || 0;
    });
    html += `<td><strong>${formatCurrency(lineTotal)}</strong></td>`;
  });

  let grandTotal = 0;
  Object.values(pivotData).forEach(customerData => {
    Object.values(customerData).forEach(amount => {
      grandTotal += amount;
    });
  });
  html += `<td><strong>${formatCurrency(grandTotal)}</strong></td></tr>`;

  html += '</tbody></table>';
  document.getElementById('pivotTable').innerHTML = html;
}

// ============ UTILITY FUNCTIONS ============
function formatCurrency(value) {
  if (!value || isNaN(value)) return '$0.00';
  return '$' + parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Check API connection on page load
window.addEventListener('load', () => {
  fetch(`${API_BASE}/health`)
    .catch(() => {
      console.warn('⚠️ API không kết nối. Vui lòng chạy backend server!');
    });
});
