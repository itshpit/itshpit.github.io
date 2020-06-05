var toSave = '';

function createTable(){
    var task = '<h2>2. Введіть до таблиці значення виграшів та ймовірностей</h2>';
    var rows = document.getElementById("row-number").value;
    var сols = document.getElementById("col-number").value;
    
    var table = '<tr><td rowspan="2">Стратегії</td>';
    table += '<td colspan="' + сols.toString() + '">Стани природи</td>';
    table += '<td rowspan="2">Середній виграш</td></tr>';
    table += '<tr>';
    for(var c = 1; c <= сols; c++)
    {
        table += '<td>П<sub>' + c + '</sub></td>';
    }

    //table += '<\tr>';

    for(var r = 1; r <= rows; r++)
    {
        table += '<tr>';
        table += '<td>A<sub>' + r + '</sub></td>';
        for(var c = 1; c <= сols; c++)
        {
            table += '<td contenteditable="true" ></td>';
        }
        table += '<td contenteditable="true"></td>';
        table += '</tr>';
    }

    table += '<tr>';
    table += '<td>Ймовірність події</td>';
    for(var c = 1; c <= сols; c++)
    {
        table += '<td contenteditable="true"></td>';
    }
    table += '<td></td>';
    table += '</tr>';

    table = task + '<div class = "table-container"><table id = "myTable" class = "HTMLtoPDF">' + table + '</table></div>';
    table += '<button onclick = "tableComplete()">Таблиця заповнена</button>'
    document.getElementById("HTMLtoPDF").innerHTML = table;
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

    task += '<button onclick = "getAnswer()">Отримати результат</button>';

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

    var btn = '<button id = "saveBtn" onclick="save()">Зберегти результат</button>';

    document.getElementById("save").innerHTML = btn;
}

function save(){
    var blob = new Blob([toSave],
        {type: "text/plain; charset = utf-8"});
    
    saveAs(blob, "result.txt");
}

function goBayes(){
    var table = document.getElementById("myTable");
    var rows = table.rows.length;
    var cols = table.rows[3].cells.length;
    var printed = '<div><br><b>Критерій Байєса</b><br>';
    toSave += 'Критерій Байєса\n';

    var arr = [];
    
    for (var r = 2; r < rows - 1; r++)
    {
        printed += 'a<sub>' + (r - 1).toString() + '</sub> = ';
        toSave += 'a_' + (r - 1).toString() + ' = ';
        var opt = 0;
        for (var c = 1; c < cols - 1; c++)
        {
            opt += parseFloat(table.rows[r].cells[c].innerText) * parseFloat(table.rows[rows - 1].cells[c].innerText);
            printed += table.rows[r].cells[c].innerText.toString() + ' * ' + table.rows[rows - 1].cells[c].innerText.toString();
            toSave += table.rows[r].cells[c].innerText.toString() + ' * ' + table.rows[rows - 1].cells[c].innerText.toString();
            if (c < cols - 2){
                printed += ' + ';
                //toSave = ' + ';
            }
        }
        printed += ' = ' + opt.toString() + '<br>';
        toSave += ' = ' + opt.toString() + '\n';
        arr.push(opt);
        table.rows[r].cells[cols - 1].innerText = opt;
    }
    
    printed = getMax(printed, arr) + '</div>';
    
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
    toSave += 'a_opt = max(';
    for (var i = 0; i < arr.length; i++)
    {
        str += arr[i].toString();
        toSave += arr[i].toString();
        if (i < arr.length - 1){
            str += '; ';
            toSave += '; ';
        }
    }
    str += ') = ' + max.toString() + '<br>'; 
    toSave += ') = ' + max.toString() + '\n';
    let strategy = getAllIndexes(arr, max);
    str += 'Рекомендована(-і) стратегія(-ії): ';
    toSave += 'Рекомендована(-і) стратегія(-ії): ';
    for (var i = 0; i < strategy.length; i++)
    {
        str += 'A <sub>' + (strategy[i] + 1).toString() + '</sub>';
        toSave += 'A_' + (strategy[i] + 1).toString();
        if (i < strategy.length - 1){
            str += ', ';
            toSave += ', ';
        }
    }

    toSave += '\n\n';

    return str;
}

function goLaplas(){
    var table = document.getElementById("myTable");
    var rows = table.rows.length;
    var cols = table.rows[3].cells.length;
    var printed = '<br><b>Критерій Лапласа</b><br>';
    toSave += 'Критерій Лапласа\n';

    var arr = [];

    for (var r = 2; r < rows - 1; r++)
    {
        printed += 'a<sub>' + (r - 1).toString() + '</sub> = ';
        toSave += 'a_' + (r - 1).toString() + ' = ';
        printed += '1/' + (cols -2).toString() + ' * (';
        toSave += '1/' + (cols -2).toString() + ' * (';
        var opt = 0;
        for (var c = 1; c < cols - 1; c++)
        {
            opt += parseFloat(table.rows[r].cells[c].innerText);
            printed += table.rows[r].cells[c].innerText.toString();
            toSave += table.rows[r].cells[c].innerText.toString();
            if (c < cols - 2){
                printed += ' + ';
                toSave += ' + ';
            }
        }
        opt *= 1/(cols -2);
        printed += ') = ' + opt.toString() + '<br>';
        toSave += ') = ' + opt.toString() + '\n';
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
    toSave += 'Критерій Вальда\n';

    var arr = [];
    var minArr = [];
    for (var r = 2; r < rows - 1; r++)
    {
        arr = [];

        printed += 'min a<sub>' + (r - 1).toString() + '</sub> = min(';        
        toSave += 'min a_' + (r - 1).toString() + ' = min(';   
        for (var c = 1; c < cols - 1; c++)
        {
            arr.push(parseFloat(table.rows[r].cells[c].innerText));
            printed += arr[c - 1].toString();
            toSave += arr[c - 1].toString();
            if (c < cols - 2){
                printed += '; ';
                toSave += '; ';
            }
        }
        minArr.push(Math.min.apply(Math, arr));
        printed += ') = ' + minArr[r - 2].toString() + '<br>';
        toSave += ') = ' + minArr[r - 2].toString() + '\n';
    }
    
    printed = getMax(printed, minArr);
    
    document.getElementById("Wald").innerHTML = printed;
}

function goSevidg(){
    var table = document.getElementById("myTable");
    var rows = table.rows.length;
    var cols = table.rows[3].cells.length;
    var printed = '<br><b>Критерій Севіджа</b><br>';
    toSave += 'Критерій Севіджа\n';

    var arr = [];
    var arrB = [];
    for (c = 1; c < cols - 1; c++)
    {
        printed += '&beta;<sub>' + c.toString() + '</sub> = max('; 
        toSave += 'beta_' + c.toString() + ' = max(';   
        for (var r = 2; r < rows - 1; r++)
        {
            arr.push(parseFloat(table.rows[r].cells[c].innerText));
            printed += table.rows[r].cells[c].innerText.toString();
            toSave += table.rows[r].cells[c].innerText.toString();
            if (r < rows - 2){
                printed += '; ';
                toSave += '; ';
            }
        }
        arrB.push(Math.max.apply(Math, arr));
        printed += ') = ' + arrB[c - 1].toString() + '<br>';
        toSave += ') = ' + arrB[c - 1].toString() + '\n';
    }

    var arrR = [];
    for (var r = 2; r < rows - 1; r++)
    {
        arr = [];
        printed += 'max r<sub>' + (r - 1).toString() + '</sub> = max(';     
        toSave += 'max r_' + (r - 1).toString() + ' = max(';  
        for (var c = 1; c < cols - 1; c++)
        {
            arr.push(arrB[c - 1] - parseFloat(table.rows[r].cells[c].innerText));
            printed += arr[c - 1].toString();
            toSave += arr[c - 1].toString();
            if (c < cols - 2){
                printed += '; ';
                toSave += '; ';
            }
                
        }
        arrR.push(Math.max.apply(Math, arr));
        printed += ') = ' + arrR[r - 2].toString() + '<br>';
        toSave += ') = ' + arrR[r - 2].toString() + '\n';
    }

    let minR = Math.min.apply(Math, arrR);
    
    printed += 'a<sub>opt</sub> = min(';
    toSave += 'a_opt = min(';
    for (var i = 0; i < arrR.length; i++)
    {
        printed += arrR[i].toString();
        toSave += arrR[i].toString();
        if (i < arrR.length - 1){
            printed += '; ';
            toSave += '; ';
        }
    }
    printed += ') = ' + minR.toString() + '<br>'; 
    toSave += ') = ' + minR.toString() + '\n'; 
    let strategy = getAllIndexes(arrR, minR);

    printed += 'Рекомендована(-і) стратегія(-ії): ';
    toSave += 'Рекомендована(-і) стратегія(-ії): ';
    for (var i = 0; i < strategy.length; i++)
    {
        printed += 'A<sub>' + (strategy[i] + 1).toString() + '</sub>';
        toSave += 'A_' + (strategy[i] + 1).toString();
        if (i < strategy.length - 1){
            printed += ', ';
            toSave += ', ';
        }
        
    }
    toSave += '\n\n';
    document.getElementById("Sevidg").innerHTML = printed;   
}

function goGurvitz(){
    var table = document.getElementById("myTable");
    var rows = table.rows.length;
    var cols = table.rows[3].cells.length;
    var printed = '<br><b>Критерій Гурвіца</b><br>';
    toSave += 'Критерій Гурвіца\n';
    
    let lambda = 0.6;
    var arr = [];
    var result = 0;
    var maxArr = [];
    for (var r = 2; r < rows - 1; r++)
    {
        arr = [];     
        for (var c = 1; c < cols - 1; c++)
            arr.push(parseFloat(table.rows[r].cells[c].innerText));
        min = Math.min.apply(Math, arr);
        max = Math.max.apply(Math, arr);
        printed += 'A <sub>' + (r - 1).toString() + '</sub>: ';
        toSave += 'A_' + (r - 1).toString() + ': ';
        result = lambda * min + (1 - lambda) * max;
        maxArr.push(result);
        printed += lambda.toString() + ' * ' + min.toString() + ' + (1 - ' + lambda.toString() + ') * ' + max.toString();
        toSave += lambda.toString() + ' * ' + min.toString() + ' + (1 - ' + lambda.toString() + ') * ' + max.toString();
        printed += ' = ' + result.toString() + '<br>';
        toSave += ' = ' + result.toString() + '\n';
    }

    let opt = Math.max.apply(Math, maxArr);
    printed += 'a<sub>opt</sub> = max(';
    toSave += 'a_opt = max(';
    for (var i = 0; i < maxArr.length; i++)
    {
        printed += maxArr[i].toString();
        toSave += maxArr[i].toString();
        if (i < maxArr.length - 1){
            printed += '; ';
            toSave += '; ';
        }
    }
    printed += ') = ' + opt.toString() + '<br>'; 
    toSave += ') = ' + opt.toString() + '\n'; 
    
    let strategy = getAllIndexes(maxArr, opt);
    printed += 'Рекомендована(-і) стратегія(-ії): ';
    toSave += 'Рекомендована(-і) стратегія(-ії): ';
    for (var i = 0; i < strategy.length; i++)
    {
        printed += 'A<sub>' + (strategy[i] + 1).toString() + '</sub>';
        toSave += 'A_' + (strategy[i] + 1).toString();
        if (i < strategy.length - 1){
            printed += ', ';
            toSave += ', ';
        }
    }
    toSave += '\n\n';

    document.getElementById("Gurvitz").innerHTML = printed;

}


