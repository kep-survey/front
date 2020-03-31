<script>
  //Importing Bar class from the vue-chartjs wrapper
  import { HorizontalBar } from 'vue-chartjs'
  //Exporting this so it can be used in other components
  export default {
    extends: HorizontalBar,
    props: {
        datacollection: {
            type: Object,
            default: null
        }
    },
    data () {
      return {
        //Chart.js options that controls the appearance of the chart
        options: {
          scales: {
            yAxes: [{  
                gridLines: {
                    display: false
                }
            }],
            xAxes: [ {
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                },
                gridLines: {
                    display: true
                }
            }]
          },
          legend: {
            display: true
          },
          responsive: true,
          maintainAspectRatio: false
        }
      }
    },
    mounted () {
      //renderChart function renders the chart with the datacollection and options object.
      this.renderChart(this.datacollection, this.options)
    }
  }
</script>