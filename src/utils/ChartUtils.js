import Chart from "chart.js/auto";

export function renderChart(ctx, chartData, chartInstance) {
    if (chartInstance) {
        chartInstance.destroy();
    }

    return new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: "Árfolyamok",
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Dátum",
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Árfolyam",
                    },
                },
            },
        },
    });
}
