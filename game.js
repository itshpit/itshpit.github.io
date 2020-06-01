function createTable(){
    var table = '<h2>2. Введіть до таблиці значення виграшів та ймовірностей</h2>';
    var rows = document.getElementById("row-number").value;
    var сols = document.getElementById("col-number").value;
    
    table += '<tr><td rowspan="2" style = "border: 1px solid #000; padding: 5px;">Стратегії</td>';
    table += '<td colspan="' + сols.toString() + '" style = "border: 1px solid #000; padding: 5px;">Стани природи</td>';
    table += '<td rowspan="2" style = "border: 1px solid #000; padding: 5px;">Виграш</td></tr>';
    table += '<tr style ="text-align: center; border: 1px solid #000; padding: 5px;">';
    for(var c = 1; c <= сols; c++)
    {
        table += '<td style = "border: 1px solid #000; padding: 5px;">П<sub>' + c + '</sub></td>';
    }

    //table += '<\tr>';

    for(var r = 1; r <= rows; r++)
    {
        table += '<tr style ="text-align: center; border: 1px solid #000; padding: 5px;">';
        table += '<td style = "border: 1px solid #000; padding: 5px;">A<sub>' + r + '</sub></td>';
        for(var c = 1; c <= сols; c++)
        {
            table += '<td contenteditable="true" style = "border: 1px solid #000; padding: 5px;">' + c + r + '</td>';
        }
        table += '<td contenteditable="true" style = "border: 1px solid #000; padding: 5px;"></td>';
        table += '</tr>';
    }

    table += '<tr style ="text-align: center; border: 1px solid #000; padding: 5px;">';
    table += '<td style = "border: 1px solid #000; padding: 5px;">Ймовірність події</td>';
    for(var c = 1; c <= сols; c++)
    {
        table += '<td contenteditable="true" style = "border: 1px solid #000; padding: 5px;"></td>';
    }
    table += '<td style = "border: 1px solid #000; padding: 5px;"></td>';
    table += '</tr>';

    table = '<table id = "myTable" style = "border: 1px solid #000; border-spacing: 0;">' + table + '</table>';
    table += '<button onclick = "tableComplete()" style = "border: none; color: white; padding: 10px 25px; text-align: center; background-color: #636b6f; margin-top: 5px;">Таблиця заповнена</button>'
    document.getElementById("table").innerHTML = table;
}

function tableComplete(){
    var task = '<h2>3. Оберіть один, декілька чи всі критерії для визначення оптимальної стратегії</h2>';
    task += '<p><label><input type="checkbox" id="select-all"/> Обрати всі</label></p>';
    task += '<fieldset>';
    task += '<legend>Критерії</legend>';
    task += '<label><input type="checkbox" id="cbBayes"/>Байєса</label><br>';
    task += '<label><input type="checkbox" id="cbLaplas"/>Лапласа</label><br>';
    task += '<label><input type="checkbox" id="cbWald"/>Вальда</label><br>';
    task += '<label><input type="checkbox" id="cbSevidg"/>Севіджа</label><br>';
    task += '<label><input type="checkbox" id="cbGurvitz"/>Гурвіца</label><br>';
    task += '</fieldset>';

    task += '<button onclick = "getAnswer()" style = "border: none; color: white; padding: 10px 25px; text-align: center; background-color: #636b6f; margin-top: 5px;">Отримати результат</button>';

    document.getElementById("choose").innerHTML = task;

    document.getElementById('select-all').onclick = function() {
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        for (var checkbox of checkboxes) {
          checkbox.checked = this.checked;
        }
    }
}

//Виконується після натискання на кнопку "Отримати результат"
function getAnswer(){
    //Звертаємося до чекбоксів
    var cbBayes = document.getElementById("cbBayes");
    var cbLaplas = document.getElementById("cbLaplas");
    var cbWald = document.getElementById("cbWald");
    var cbSevidg = document.getElementById("cbSevidg");
    var cbGurvitz = document.getElementById("cbGurvitz");

    //Далі, в залежності від вибору користувача, виконуються певні функції
    if (cbBayes.checked == true){
        goBayes();
    }
    if (cbLaplas.checked == true){
        goLaplas();
    }
    if (cbWald.checked == true){
        goWald();
    }
    if (cbSevidg.checked == true){
        goSevidg();
    }
    if (cbGurvitz.checked == true){
        goGurvitz();
    }

    var btn = '<button onclick="saveFile() style = "border: none; color: white; padding: 10px 25px; text-align: center; background-color: #636b6f;"">Зберегти результат</button>';

    document.getElementById("save").innerHTML = btn;
}

function saveFile(str){
    var doc = new jsPDF();          
    doc.text(20, 20, str);

    // Save the PDF
    doc.save('result.pdf');
}

function goBayes(){
    var table = document.getElementById("myTable");
    var rows = table.rows.length;
    var cols = table.rows[3].cells.length;
    var printed = '<br><b>Критерій Байєса</b><br>';

    var arr = [];
    
    for (var r = 2; r < rows - 1; r++)
    {
        printed += 'a<sub>' + (r - 1).toString() + '</sub> = ';
        var opt = 0;
        for (var c = 1; c < cols - 1; c++)
        {
            opt += parseInt(table.rows[r].cells[c].innerText) * parseInt(table.rows[rows - 1].cells[c].innerText);
            printed += table.rows[r].cells[c].innerText.toString() + ' * ' + table.rows[rows - 1].cells[c].innerText.toString();
            if (c < cols - 2){
                printed += ' + ';
            }
        }
        printed += ' = ' + opt.toString() + '<br>';
        arr.push(opt);
    }
    
    printed = getMax(printed, arr);
    
    document.getElementById("Bayes").innerHTML = printed;
}

function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}

function getMax(str, arr){
    let max = Math.max.apply(Math, arr);
    
    str += 'a<sub>opt</sub> = max(';
    for (var i = 0; i < arr.length; i++)
    {
        str += arr[i].toString();
        if (i < arr.length - 1){
            str += '; ';
        }
    }
    str += ') = ' + max.toString() + '<br>'; 
    let strategy = getAllIndexes(arr, max);
    str += 'Рекомендована(-і) стратегія(-ії): ';
    for (var i = 0; i < strategy.length; i++)
    {
        str += 'A <sub>' + (strategy[i] + 1).toString() + '</sub>';
        if (i < strategy.length - 1)
            str += ', ';
    }

    return str;
}

function goLaplas(){
    var table = document.getElementById("myTable");
    var rows = table.rows.length;
    var cols = table.rows[3].cells.length;
    var printed = '<br><b>Критерій Лапласа</b><br>';

    var arr = [];

    for (var r = 2; r < rows - 1; r++)
    {
        printed += 'a<sub>' + (r - 1).toString() + '</sub> = ';
        printed += '1/' + (cols -2).toString() + ' * ('
        var opt = 0;
        for (var c = 1; c < cols - 1; c++)
        {
            opt += parseInt(table.rows[r].cells[c].innerText);
            printed += table.rows[r].cells[c].innerText.toString();
            if (c < cols - 2){
                printed += ' + ';
            }
        }
        opt *= 1/(cols -2);
        printed += ') = ' + opt.toString() + '<br>';
        arr.push(opt);
    }
    
    printed = getMax(printed, arr);
    document.getElementById("Laplas").innerHTML = printed;
}

function goWald(){
    var table = document.getElementById("myTable");
    var rows = table.rows.length; //get number of table rows
    var cols = table.rows[3].cells.length;
    var printed = '<br><b>Критерій Вальда</b><br>';

    var arr = [];
    var minArr = [];
    for (var r = 2; r < rows - 1; r++)
    {
        arr = [];

        printed += 'min a<sub>' + (r - 1).toString() + '</sub> = min(';        
        for (var c = 1; c < cols - 1; c++)
        {
            arr.push(parseInt(table.rows[r].cells[c].innerText));
            printed += arr[c - 1].toString();
            if (c < cols - 2)
                printed += '; '
        }
        minArr.push(Math.min.apply(Math, arr));
        printed += ') = ' + minArr[r - 2].toString() + '<br>';
    }
    
    printed = getMax(printed, minArr);
    
    document.getElementById("Wald").innerHTML = printed;
}

function goSevidg(){
    var table = document.getElementById("myTable");
    var rows = table.rows.length;
    var cols = table.rows[3].cells.length;
    var printed = '<br><b>Критерій Севіджа</b><br>';

    var arr = [];
    var arrB = [];
    for (c = 1; c < cols - 1; c++)
    {
        printed += '&beta;<sub>' + c.toString() + '</sub> = max(';        
        for (var r = 2; r < rows - 1; r++)
        {
            arr.push(parseInt(table.rows[r].cells[c].innerText));
            printed += table.rows[r].cells[c].innerText.toString();
            if (r < rows - 2)
                printed += '; '
        }
        arrB.push(Math.max.apply(Math, arr));
        printed += ') = ' + arrB[c - 1].toString() + '<br>';
    }

    var arrR = [];
    for (var r = 2; r < rows - 1; r++)
    {
        arr = [];
        printed += 'max r<sub>' + (r - 1).toString() + '</sub> = max(';        
        for (var c = 1; c < cols - 1; c++)
        {
            arr.push(arrB[c - 1] - parseInt(table.rows[r].cells[c].innerText));
            printed += arr[c - 1].toString();
            if (c < cols - 2)
                printed += '; '
        }
        arrR.push(Math.max.apply(Math, arr));
        printed += ') = ' + arrR[r - 2].toString() + '<br>';
    }

    let minR = Math.min.apply(Math, arrR);
    
    printed += 'a<sub>opt</sub> = min(';
    for (var i = 0; i < arrR.length; i++)
    {
        printed += arrR[i].toString();
        if (i < arrR.length - 1){
            printed += '; ';
        }
    }
    printed += ') = ' + minR.toString() + '<br>'; 
    let strategy = getAllIndexes(arrR, minR);

    printed += 'Рекомендована(-і) стратегія(-ії): ';
    for (var i = 0; i < strategy.length; i++)
    {
        printed += 'A <sub>' + (strategy[i] + 1).toString() + '</sub>';
        if (i < strategy.length - 1)
        printed += ', ';
    }

    document.getElementById("Sevidg").innerHTML = printed;   
}

function goGurvitz(){
    var table = document.getElementById("myTable");
    var rows = table.rows.length;
    var cols = table.rows[3].cells.length;
    var printed = '<br><b>Критерій Гурвіца</b><br>';
    
    let lambda = 0.6;
    var arr = [];
    var result = 0;
    var maxArr = [];
    for (var r = 2; r < rows - 1; r++)
    {
        arr = [];     
        for (var c = 1; c < cols - 1; c++)
            arr.push(parseInt(table.rows[r].cells[c].innerText));
        min = Math.min.apply(Math, arr);
        max = Math.max.apply(Math, arr);
        printed += 'A <sub>' + (r - 1).toString() + '</sub>: '
        result = lambda * min + (1 - lambda) * max;
        maxArr.push(result);
        printed += lambda.toString() + ' * ' + min.toString() + ' + (1 - ' + lambda.toString() + ') * ' + max.toString();
        printed += ' = ' + result.toString() + '<br>';
    }

    let opt = Math.max.apply(Math, maxArr);
    printed += 'a<sub>opt</sub> = max(';
    for (var i = 0; i < maxArr.length; i++)
    {
        printed += maxArr[i].toString();
        if (i < maxArr.length - 1){
            printed += '; ';
        }
    }
    printed += ') = ' + opt.toString() + '<br>'; 
    
    let strategy = getAllIndexes(maxArr, opt);
    printed += 'Рекомендована(-і) стратегія(-ії): ';
    for (var i = 0; i < strategy.length; i++)
    {
        printed += 'A <sub>' + (strategy[i] + 1).toString() + '</sub>';
        if (i < strategy.length - 1)
        printed += ', ';
    }

    document.getElementById("Gurvitz").innerHTML = printed;

}


