export default {
  asMoney,
  getDayName,
  getMonthName,
  getTime
}

function asMoney(amount) {
  try {
    amount = String(amount).replace('$','').replace(',','');
    let decimalCount = 2;
    let decimal = ".";
    let thousands = ",";
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
}

function getDayName(day) {
  //console.log('getDayName ', day);
  let name = "N/D";
  day = String(day);
  switch (day) {
    case "0":
      name = "Domingo";
      break;
    case "1":
      name = "Lunes";
      break;
    case "2":
      name = "Martes";
      break;
    case "3":
      name = "Miercoles";
      break;
    case "4":
      name = "Jueves";
      break;
    case "5":
      name = "Viernes";
      break;
    case "6":
      name = "Sabado";
      break;
  }
  return name;
}

function getMonthName(month) {
  let name = "N/D";
  month = String(month);
  switch (month) {
    case "1":
      name = "Enero";
      break;
    case "2":
      name = "Febrero";
      break;
    case "3":
      name = "Marzo";
      break;
    case "4":
      name = "Abril";
      break;
    case "5":
      name = "Mayo";
      break;
    case "6":
      name = "Junio";
      break;
    case "7":
      name = "Julio";
      break;
    case "8":
      name = "Agosto";
      break;
    case "9":
      name = "Septiembre";
      break;
    case "10":
      name = "Octubre";
      break;
    case "11":
      name = "Noviembre";
      break;
    case "12":
      name = "Diciembre";
      break;
  }
  return name;
}

function getTime(timestamp){
  let d =null;
  if(typeof timestamp !== 'undefined'){
    d = new Date(parseInt(timestamp)) 
  }else{
    d = new Date();
  }
  let meridian = d.getHours() > 12 ? 'PM' : 'AM';
  let seconds = String(d.getSeconds()).length === 1 ? '0'+d.getSeconds() : d.getSeconds();
  let minute = String(d.getMinutes()).length === 1 ? '0'+d.getMinutes() : d.getMinutes();
  let hour = d.getHours() > 12 ? Math.abs(d.getHours() - 12) : d.getHours();

  hour =  String(hour).length === 1 
            ? '0'+hour
            : hour; 

  if(timestamp){
    return `${hour}:${minute}:${seconds} ${meridian}`; 
  }else{
    return `${hour}:${minute} ${meridian}`;
  } 
}