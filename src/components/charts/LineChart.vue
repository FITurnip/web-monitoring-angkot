<template>
    <canvas ref="lineChartRef"></canvas>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
    name: 'LineChart',
    props: {
        chartLabels: {
            type: Array,
            required: true,
        },
        chartData: {
            type: Array,
            required: true,
        },
        chartLabel: {
            type: String,
            default: 'Dataset',
        },
    },
    setup(props) {
        const lineChartRef = ref(null)
        let chartInstance = null

        const createChart = () => {
            if (chartInstance) chartInstance.destroy() // cleanup on re-render

            chartInstance = new Chart(lineChartRef.value, {
                type: 'line',
                data: {
                    labels: props.chartLabels,
                    datasets: [
                        {
                            label: props.chartLabel,
                            data: props.chartData,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.3,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            })
        }

        onMounted(() => {
            createChart()
        })

        // Optional: re-render chart when props change
        watch(() => [props.chartLabels, props.chartData], createChart)

        return {
            lineChartRef,
        }
    },
}
</script>