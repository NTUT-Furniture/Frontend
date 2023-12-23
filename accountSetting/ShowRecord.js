function showOrderRecord() {
    // 获取目标容器
    const container = document.getElementById('content');

    // 创建table元素
    const table = document.createElement('table');

    // 创建thead元素并添加表头
    const thead = document.createElement('thead');
    thead.innerHTML = `
          <tr>
              <th>Order Date</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Detail</th>
          </tr>
      `;
    table.appendChild(thead);

    // 创建tbody元素
    const tbody = document.createElement('tbody');

    // 添加订单记录行
    tbody.innerHTML += `
          <tr>
              <td>2023-01-01</td>
              <td>Product A</td>
              <td>$100.00</td>
              <td>Shipped</td>
              <td>
                  <a href="javascript:void(0);" id="detail" type="button" onclick="toggleOpenDetail('OrderRecord')">Open</a>
              </td>            
          </tr>
          <tr id="OrderRecord-detail" style="display: none;">
              <td colspan="4">
                  <table>
                      <tr>
                          <td>2023-01-01</td>
                          <td>Laptop</td>
                          <td>$100.00</td>
                          <td>Shipped</td>
                      </tr>
                      <tr>
                          <td>2023-01-01</td>
                          <td>Desktop</td>
                          <td>$100.00</td>
                          <td>Shipped</td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td>2023-01-02</td>
              <td>Product B</td>
              <td>$200.00</td>
              <td>Shipped</td>
              <td>
                  <a href="javascript:void(0);" id="detail" type="button">Open</a>
              </td>            
          </tr>
          <tr>
              <td>2023-01-03</td>
              <td>Product C</td>
              <td>$47999.00</td>
              <td>Shipped</td>
              <td>
                  <a href="javascript:void(0);" id="detail" type="button">Open</a>
              </td>            
          </tr>
      `;

    // 将tbody添加到table
    table.appendChild(tbody);

    // 将table添加到容器
    container.innerHTML = '';
    container.appendChild(table);
    // document.getElementById('content').appendChild(container);
}

function toggleOpenDetail(detailId) {
    const detailRow = document.getElementById(detailId + '-detail');
    detailRow.style.display = (detailRow.style.display === 'none' || detailRow.style.display === '') ? 'table-row' : 'none';
}
