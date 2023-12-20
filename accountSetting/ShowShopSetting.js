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
