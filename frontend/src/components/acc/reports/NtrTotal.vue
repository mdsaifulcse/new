<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header card-info">
            <div class="card-btn pull-right">
              <div  v-if="info != '' ">
                <download-excel
                  class   = "btn btn-xs btn-success"
                  :data   = "json_data"
                  :fields = "json_fields"
                  :name    = "excelFileName">
                  <i class="fa fa-file-excel-o"></i> Excel
                </download-excel>
                <button class="btn btn-xs btn-primary" v-print="'#printThis'"><i class="fa fa-print"></i> Print</button>
              </div>
            </div>
            <h4 class="card-title">Find NTR</h4>
          </div>
          <div class="card-body table-responsive">
            <div id="printThis">
              <div v-if="info != '' ">
                <div class="text-center">
                  <print-header></print-header>
                  <h4> Budget Distribution {{info.name}} </h4>
                  <h6> Non Tax Revenue (NTR) </h6>
                </div>
                <div class="table-responsive">
                  <table id="datatable" class="table table-striped table-bordered min-padding-table">
                    <thead>
                    <tr>
                      <th width="5%">E. Code</th>
                      <th> Description </th>
                      <th v-for="(reg,ind) in regiments" :key="ind"> {{reg.short_name}} </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(data,index) in allData" :key="index">
                      <td>{{data.field_code}}</td>
                      <td>{{data.field_name}}</td>
                      <td v-for="(reg,ind) in data.regiments" :key="ind">{{reg.amount}}</td>
                    </tr>
                    <tr>
                      <th colspan="2" class="text-right"> Total </th>
                      <th v-for="(total,ind) in totalAmount" :key="ind">{{total.total_amount}}</th>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import PrintHeader from '@/components/pad/Header'
  import BudgetReportsService from '@/services/acc/reports/BudgetReportsService'
  export default {
    name: 'NtrFind',
    data () {
      return {
        allData: [],
        info: '',
        excelFileName: 'asdas',
        session: '',
        regiments: '',
        totalAmount: [],
        json_fields: {
          'Economic Code': 'code',
          'Description': 'name'
        },
        json_data: [],
        json_meta: [
          [
            {
              'key': 'charset',
              'value': 'utf-8'
            }
          ]
        ],
      }
    },
    components:{
      'print-header': PrintHeader
    },
    mounted () {
      this.getData()
      this.showData()
    },
    methods: {
      async getData () {
        let regiment = await BudgetReportsService.regiments()
        this.regiments = regiment.data
        let i;
        let preHead = {
          'Economic Code': 'code',
          'Description': 'name'
        }
        let regLength = Object.keys(this.regiments).length
        let regiHead = {}
        for(i=0;i<regLength;i++){
          let regName = this.regiments[i].name
          regiHead[regName]="regiment."+i
        }
        this.json_fields =  Object.assign({},preHead,regiHead)

      },
      async showData() {
        const showResult = await BudgetReportsService.ntrTotal()
        this.allData = showResult.data.allData
        this.info = showResult.data.info
        this.totalAmount = showResult.data.totalAmount
        let dataLength = Object.keys(this.allData).length
        let jsonData = []
        let j,i
        for(i=0;i<dataLength;i++){
          let regLength = Object.keys(this.allData[i].regiments).length
          let regAmount = []
          for(j=0;j<regLength;j++){
            regAmount.push(this.allData[i].regiments[j].amount)
          }
          jsonData.push({
            name: this.allData[i].field_name,
            code: this.allData[i].field_code,
            regiment: regAmount
          })
        }
        this.json_data = jsonData
        let a = this.info.name.replace(/ /g,"_").toLowerCase()
        this.excelFileName = 'ntr_'+a+'.xls'
      }

    }
  }
</script>
<style>
  .table.min-padding-table td, .table.min-padding-table th {
    font-size: 13px;
  }
  @page { size: landscape; }
</style>
