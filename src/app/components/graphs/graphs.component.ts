import { Component, AfterViewInit } from '@angular/core';
import { GraphService, GraphDashboard, Graph } from '../../services/graph.service';
import { ChartData, ChartOptions, ChartType } from 'chart.js';  // optional for typing
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);


@Component({
  selector: 'app-graphs',
  standalone: false,
  templateUrl: './graphs.component.html',
  styleUrl: './graphs.component.scss'
})
export class GraphsComponent implements AfterViewInit {
  
     constructor(private graphService: GraphService) {}

  ngAfterViewInit(): void {
    this.graphService.getDashboard().subscribe((data: GraphDashboard) => {
      this.renderOutcomeChart(data.outcome);
      this.renderSepsisChart(data.sepsis);
      this.renderWeightChart(data.weight);
      this.renderHieGradesChart(data.hieGraph)
    });
  }

 renderOutcomeChart(outcome: any[]) {
  if (!outcome || outcome.length === 0) {
    console.warn('No outcome data available');
    return;
  }

  const total = outcome.reduce((sum, item) => sum + item.count, 0);
  const labels = outcome.map(item => item.label);
  const counts = outcome.map(item => item.count);
  const percentages = outcome.map(item => total > 0 ? Math.round((item.count / total) * 100) : 0);

  const canvas = document.getElementById('outcomeChart') as HTMLCanvasElement;
  const ctx = canvas?.getContext('2d');

  if (ctx) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Outcome Count',
          data: counts,
          backgroundColor: '#97c2dcff',
          borderColor: '#3e95cd',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Patient Outcomes'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.raw as number;
                const percentage = percentages[context.dataIndex];
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
}

renderSepsisChart(sepsis: any[]) {
  if (!sepsis || sepsis.length === 0) {
    console.warn('No sepsis data available');
    return;
  }

  const total = sepsis.reduce((sum, item) => sum + item.count, 0);
  const labels = sepsis.map(item => item.label);
  const counts = sepsis.map(item => item.count);
  const percentages = sepsis.map(item => total > 0 ? Math.round((item.count / total) * 100) : 0);

  const canvas = document.getElementById('sepsisChart') as HTMLCanvasElement;
  const ctx = canvas?.getContext('2d');

  if (ctx) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sepsis Cases',
          data: counts,
          backgroundColor: '#f3f197ff',
          borderColor: '#dfe47dff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Sepsis Distribution'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.raw as number;
                const percentage = percentages[context.dataIndex];
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
}

renderWeightChart(weight: any[]) {
  if (!weight || weight.length === 0) return;

  const lowWeight = weight.find(item => item.label === '< 1500g');
  const normalWeight = weight.find(item => item.label === '≥ 1500g');

  if (!lowWeight || !normalWeight) return;

  const total = lowWeight.count + normalWeight.count;
  const lowPercentage = total > 0 ? Math.round((lowWeight.count / total) * 100) : 0;
  const normalPercentage = total > 0 ? Math.round((normalWeight.count / total) * 100) : 0;

  const canvas = document.getElementById('weightChart') as HTMLCanvasElement;
  const ctx = canvas?.getContext('2d');

  if (ctx) {
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['< 1500g', '≥ 1500g'],
        datasets: [{
          data: [lowWeight.count, normalWeight.count],
          backgroundColor: ['#1e65bcff', '#a9bde3ff'],
          borderColor: ['#ffffff', '#ffffff'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Premature babies (<1500g)'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                const percentage = context.dataIndex === 0 ? lowPercentage : normalPercentage;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
}

renderHieGradesChart(hieGrades: any[]) {
  if (!hieGrades || hieGrades.length === 0) {
    console.warn('No HIE-related data available');
    return;
  }

  const canvas = document.getElementById('hieGradesChart') as HTMLCanvasElement;
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;

  const avgThomson = hieGrades.find(item => item.label === "Avg Thomson Score")?.count || 0;
  const avgBloodGas = hieGrades.find(item => item.label === "Avg Blood Gas Value")?.count || 0;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Avg Thomson Score', 'Avg Blood Gas Value'],
      datasets: [
        {
          label: 'Average Scores',
          data: [avgThomson, avgBloodGas],
          backgroundColor: ['#3498db', '#e74c3c'],
          borderColor: ['#2980b9', '#c0392b'],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }, // Only one dataset, so legend not really needed
        title: {
          display: true,
          text: 'HIE: Average Thomson Score & Blood Gas Value'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Average Value'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Metrics'
          }
        }
      }
    }
  });
}
}