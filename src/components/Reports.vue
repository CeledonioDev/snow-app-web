<template>
  <div>
    <div class>
      <h4>Consulta tus estadisticas</h4>
      <div class="row" style="width: 100%;">
        <div class="btn-group col-sm-4">
          <select v-model="currentReport" class="form-control">
            <option value="0">Seleccione el reporte</option>
            <option v-for="r in reports" :key="r.id" :value="r.id">{{ r.name }}</option>
          </select>
        </div>

        <!-- current report area -->
        <div v-if="currentReport == 1" class="col-sm-7 row">
          
             <div class="col-sm-2">
              <label>Mes:</label>
            </div>
            <div class="col-sm-8">
              <select v-model="ordersReportDetail.month" class="form-control">
                <option :value="7" selected>Julio</option>
              </select>
            </div>
            <div class="col-sm-2">
              <button
                class="btn btn-default report-refresh"
                style="padding: 5px;	margin-top: auto; "
              >
                <li class="fa fa-refresh fa-2x"></li>
              </button>
            </div>
        </div>
      </div>

         
      <div v-if="currentReport == 1" >
          <br />

          <canvas
            v-show="!loaders.ordersReport"
            id="orders-report-canvas"
            style="width: 100%; height: 100%;"
          ></canvas>
          <br />
          <div class="row" style="width: 100%;">
            <div class="col-sm-3 text-left">
              Total: RD$
              <b>{{ ordersReportDetail.total }}</b>
            </div>
          </div>        
      </div>
      <div v-else-if="currentReport == 2">
        <table class="table">
          <thead>
            <th>Producto</th>
            <th class="text-center">Cantidad vendida</th>
            <th class="text-center">Total vendido(RD$)</th>
          </thead>
          <tbody>
            <tr v-for="p in productsReport.products" :key="p.id">
              <td>{{ p.name }}</td>
              <td class="text-center">{{ p.totalQuantity }}</td>
              <td class="text-center">{{ $helpers.asMoney(p.totalSales) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import Chart from "chart.js";

export default {
  name: "Reports",
  data: function() {
    return {
      company: firebase.auth().currentUser.email,
      currentReport: 0,
      reports: [
        {
          name: "Ordenes mensuales",
          id: 1
        },
        {
          name: "Productos mas vendidos",
          id: 2
        }
      ],
      db: firebase.firestore(),
      ordersReportDetail: {
        total: 0,
        month: 7
      },
      productsReport: {
        products: []
      },
      loaders: {
        ordersReport: false
      }
    };
  },
  methods: {
    getCompanyOrders: async function() {
      return this.db
        .collection("Company")
        .doc(this.company)
        .collection("Orders")
        .get();
    },

    //===========================================
    //reporte de ordenes
    ordersReport: async function() {
      //funciones constructoras
      function YearReport() {
        this.months = {};
        this.total = 0;
      }
      function MonthReport() {
        this.total = 0;
        this.days = {};
        this.name = "";
      }

      this.loaders.ordersReport = true;
      this.ordersReportDetail.total = 0;
      const ORDERS = await this.getCompanyOrders();

      let report = {};
      let date = null;
      let currentTotal = 0;
      let obj = null;

      ORDERS.forEach(order => {
        date = this.getTimestampDetails(order.id);
        currentTotal = this.getRealTotalValue(order.data().total);
        if (order.data().service.length < 10) {
          return;
        }
        if (typeof report[date.year] === "undefined") {
          obj = new YearReport();
          obj.total += currentTotal;
          report[date.year] = obj;
          if (typeof report[date.year].months[date.month] === "undefined") {
            obj = new MonthReport();
            obj.total += currentTotal;
            obj.name = this.$helpers.getMonthName(date.month);
            report[date.year].months[date.month] = obj;
            if (
              typeof report[date.year].months[date.month].days[date.day] ===
              "undefined"
            ) {
              obj = new Object();
              obj.total = currentTotal;
              obj.name = this.$helpers.getDayName(date.day);
              report[date.year].months[date.month].days[date.day] = obj;
            } else {
              report[date.year].months[date.month].days[
                date.day
              ].total += currentTotal;
            }
          } else {
            report[date.year].months[date.month].total += currentTotal;
            if (
              typeof report[date.year].months[date.month].days[date.day] ===
              "undefined"
            ) {
              obj = new Object();
              obj.total = currentTotal;
              obj.name = this.$helpers.getDayName(date.day);
              report[date.year].months[date.month].days[date.day] = obj;
            } else {
              report[date.year].months[date.month].days[
                date.day
              ].total += currentTotal;
            }
          }
        } else {
          report[date.year].total += currentTotal;
          if (typeof report[date.year].months[date.month] === "undefined") {
            obj = new MonthReport();
            obj.total += currentTotal;
            obj.name = this.$helpers.getMonthName(date.month);
            report[date.year].months[date.month] = obj;
            if (
              typeof report[date.year].months[date.month].days[date.day] ===
              "undefined"
            ) {
              obj = new Object();
              obj.total = currentTotal;
              obj.name = this.$helpers.getDayName(date.day);
              report[date.year].months[date.month].days[date.day] = obj;
            } else {
              report[date.year].months[date.month].days[
                date.day
              ].total += currentTotal;
            }
          } else {
            report[date.year].months[date.month].total += currentTotal;
            if (
              typeof report[date.year].months[date.month].days[date.day] ===
              "undefined"
            ) {
              obj = new Object();
              obj.total = currentTotal;
              obj.name = this.$helpers.getDayName(date.day);
              report[date.year].months[date.month].days[date.day] = obj;
            } else {
              report[date.year].months[date.month].days[
                date.day
              ].total += currentTotal;
            }
          }
        }
      });
      //l('ordersReport >> ', report);
      this.processReportData(report);
    },

    processReportData: function(rawData) {
      //prueba con el mes de julio del 2019
      let data = {};
      let output = {};
      const MONTH = this.ordersReportDetail.month.toString();

      if (rawData["2019"]) {
        data = rawData["2019"].months;
        let monthName = "";
        for (let mes in data) {
          if (data.hasOwnProperty(mes) && mes !== "total") {
            monthName = data[mes].name;
          }
          for (let day in data[mes].days) {
            output[data[mes].days[day].name] = data[mes].days[day].total;
          }
        }
        this.ordersReportDetail.total = this.$helpers.asMoney(data[MONTH].total);
      }
      //l('output for july 2019 >> ',output);
      let labels = Object.keys(output);
      let values = Object.values(output);
      this.paintOrdersReport(labels, values);
      this.loaders.ordersReport = false;
    },

    getTimestampDetails: function(timestamp) {
      const date = new Date(parseInt(timestamp));
      return {
        day: this.addLeadingZero(date.getDay() + 1).toString(),
        month: this.addLeadingZero(date.getMonth() + 1).toString(),
        year: date.getFullYear().toString()
      };
    },

    addLeadingZero: function(val) {
      return val.length === 1 ? "0" + val : val;
    },

    getRealTotalValue: function(total) {
      total = String(total);
      let val = 0;
      if (total.includes("$")) val = total.replace("$", "");
      if (total.includes(",")) val = val.replace(",", "");

      return parseInt(val);
    },

    paintOrdersReport: function(labels, dataSet) {
      let self = this;
      var ctx = document
        .getElementById("orders-report-canvas")
        .getContext("2d");
      var myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Total (RD$) en ordenes",
              data: dataSet,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(155, 99, 32, 0.2)"
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 99, 32, 0.2)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
          tooltips: {
              enabled: true,
              mode: 'single',
              callbacks: {
                  label: function(tooltipItems, data) { 
                      return `RD$${self.$helpers.asMoney(tooltipItems.yLabel)}`;
                  }
              }
          },
        }
      });
    },
    //===========================================

    //===========================================
    // productos mas vendidos
    getProducts: async function(){
      this.productsReport.products = [];
      const P = await this.db
        .collection("Company")
        .doc(this.company)
        .collection("Products")
        .orderBy('name')
        .get();
      P.docs.forEach(p => {
        this.productsReport.products.push({
          id: p.id,
          name: p.data().name,
          price: p.data().price,
          totalQuantity: 0,
          totalSales: 0
        });
      });

      const orders = await this.getCompanyOrders();
      orders.docs.forEach(o => {
        this.countServiceInOrder(o.data().service);
      });
    },

    countServiceInOrder: function(order){
      let orderServices = JSON.parse(order);
      orderServices.forEach(s => {
        this.productsReport.products.forEach(p => {
          if(p.name == s.order.service){
            p.totalSales += parseInt(s.order.price) * parseInt(s.order.quantity);
            p.totalQuantity += parseInt(s.order.quantity);
          }
        });
      });
    }

    //===========================================
  },
  mounted: function() {},
  watch: {
    currentReport: function(value) {
      console.log("currentReport ", value);
      if (value == 1) {
        this.ordersReport();
      }else if(value == 2){
        this.getProducts();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.twrap {
  max-height: 300px;
  overflow-y: auto;
}
</style>
