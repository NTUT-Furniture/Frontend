function showAccountSetting() {
    // 先清空 content 區域的內容
    document.getElementById('content').innerHTML = '';

    // 創建 form 元素
    const formElement = document.createElement('form');
    formElement.className = 'AccountSetting-form';
    formElement.action = ''; // 設置表單的 action 屬性
    formElement.method = 'POST'; // 設置表單的 method 屬性

    // 以下是 form 元素中的各個子元素
    const formGroups = [
        {
            label: 'E-mail',
            type: 'text',
            id: 'e-mail',
            name: 'e-mail',
            placeholder: 't110590028@ntut.org.tw',
        },
        {label: 'Account', type: 'text', id: 'username', name: 'username', placeholder: 'Garry1128'},
        {label: 'Password', type: 'password', id: 'password', name: 'password', placeholder: '***'},
        {label: 'Address', type: 'text', id: 'address', name: 'address', placeholder: '窩忘了'},
        {
            label: 'PhoneNumber',
            type: 'text',
            id: 'phonenumber',
            name: 'phonenumber',
            placeholder: '窩不知道'
        },
        {
            label: 'Birthday',
            type: 'date',
            id: 'birthday',
            name: 'birthday',
            placeholder: '2023/01/01'
        },
        {
            label: 'CredCard',
            type: 'text',
            id: 'credcard',
            name: 'credcard',
            placeholder: '123123123'
        },
    ];

    formGroups.forEach(function (group) {
        // 創建 form-group 元素
        const formGroupElement = document.createElement('div');
        formGroupElement.className = 'form-group';

        // 創建 label 元素
        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', group.id);
        labelElement.textContent = group.label;

        // 創建 input 元素
        const inputElement = document.createElement('input');
        inputElement.type = group.type;
        inputElement.id = group.id;
        inputElement.name = group.name;
        inputElement.placeholder = group.placeholder;
        inputElement.required = group.required;

        // 將 label 和 input 添加到 form-group 元素中
        formGroupElement.appendChild(labelElement);
        formGroupElement.appendChild(inputElement);

        // 將 form-group 元素添加到 form 元素中
        formElement.appendChild(formGroupElement);
    });

    // 創建 AccountSetting-Button 元素
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'AccountSetting-Button';

    // 創建 Modify 按鈕
    const modifyButton = document.createElement('button');
    modifyButton.id = 'Confirm';
    modifyButton.type = 'submit';
    modifyButton.textContent = 'Confirm';

    // 創建 Cancel 按鈕
    const cancelButton = document.createElement('button');
    cancelButton.id = 'Cancel';
    cancelButton.type = 'button'; // 如果是取消操作，使用 type="button"
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function() {
        showAccountSetting(); // 调用 showAccountSetting() 函数
    });

    // 將 Modify 和 Cancel 按鈕添加到 AccountSetting-Button 元素中
    buttonContainer.appendChild(modifyButton);
    buttonContainer.appendChild(cancelButton);

    // 將 AccountSetting-Button 元素添加到 form 元素中
    formElement.appendChild(buttonContainer);

    // 將 form 元素添加到 content 區域中
    document.getElementById('content').appendChild(formElement);
}

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
    document.getElementById('content').appendChild(container);
}

function toggleOpenDetail(detailId) {
    const detailRow = document.getElementById(detailId + '-detail');
    detailRow.style.display = (detailRow.style.display === 'none' || detailRow.style.display === '') ? 'table-row' : 'none';
}

function showShopSetting() {
    // 先清空 content 區域的內容
    document.getElementById('content').innerHTML = '';

    // 創建 form 元素
    const formElement = document.createElement('form');
    formElement.className = 'AccountSetting-form';
    formElement.action = ''; // 設置表單的 action 屬性
    formElement.method = 'POST'; // 設置表單的 method 屬性

    // Create "Create Banner" button
    const createBannerButton = document.createElement('button');
    createBannerButton.id = 'Banner';
    createBannerButton.type = 'submit';
    createBannerButton.textContent = 'Create Banner';

    // 創建 form-group 元素
    const shopNameFormGroup = document.createElement('div');
    shopNameFormGroup.className = 'form-group';

    // 創建 label 元素
    const nameLabelElement = document.createElement('label');
    nameLabelElement.setAttribute('for', 'shopname');
    nameLabelElement.textContent = 'Name';

    // 創建 input 元素
    const shopNameInput = document.createElement('input');
    shopNameInput.type = 'text';
    shopNameInput.id = 'shopname';
    shopNameInput.name = 'shopname';
    shopNameInput.placeholder = 'Garry1128';
    shopNameInput.required = true;

    // 將 label 和 input 添加到 form-group 元素中
    shopNameFormGroup.appendChild(nameLabelElement);
    shopNameFormGroup.appendChild(shopNameInput);

    // 創建 description form-group 元素
    const descriptionFormGroup = document.createElement('div');
    descriptionFormGroup.className = 'form-group';

    // 創建 label 元素
    const descriptionLabelElement = document.createElement('label');
    descriptionLabelElement.setAttribute('for', 'description');
    descriptionLabelElement.textContent = 'Description';

    // 創建 textarea 元素
    const descriptionTextarea = document.createElement('textarea');
    descriptionTextarea.type = 'text';
    descriptionTextarea.id = 'description';
    descriptionTextarea.name = 'description';
    descriptionTextarea.placeholder = '我的名字叫黃冠鈞，20歲。住在新北市汐止區金龍湖一帶，未婚。我在Sunbird服務。\
每天都要加班到晚上8點才能回家。我不抽菸，不喝酒。晚上11點半睡，每天要睡足8個小時。\
睡前，我一定喝一杯溫熱水，然後沒有做20分鐘的柔軟操，上了床，馬上熟睡。一覺到天亮，決不把疲勞和壓力，留到第二天。\
醫生都說我很正常。';
    descriptionTextarea.required = true;

    // 將 label 和 textarea 添加到 description form-group 元素中
    descriptionFormGroup.appendChild(descriptionLabelElement);
    descriptionFormGroup.appendChild(descriptionTextarea);

    // 創建 AccountSetting-Button 元素
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'AccountSetting-Button';

    // 創建 Confirm 按鈕
    const confirmButton = document.createElement('button');
    confirmButton.id = 'Confirm';
    confirmButton.type = 'submit';
    confirmButton.textContent = 'Confirm';

    // 創建 Cancel 按鈕
    const cancelButton = document.createElement('button');
    cancelButton.id = 'Cancel';
    cancelButton.type = 'button'; // 如果是取消操作，使用 type="button"
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function() {
        showShopSetting(); // 调用 showAccountSetting() 函数
    });

    // 將 Confirm 和 Cancel 按鈕添加到 AccountSetting-Button 元素中
    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);

    // 將 Create Banner 按鈕、Name 元素、Description 元素、及按鈕容器添加到 form 元素中
    formElement.appendChild(createBannerButton);
    formElement.appendChild(shopNameFormGroup);
    formElement.appendChild(descriptionFormGroup);
    formElement.appendChild(buttonContainer);

    // 將 form 元素添加到 content 區域中
    document.getElementById('content').appendChild(formElement);
}
