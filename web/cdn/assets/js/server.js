let amount = [0, 0, 0, 0, 0, 0, 0];

tickets.sort((a, b) => {
  return new Date(b.created) - new Date(a.created);
});

let lastTickets = [];

tickets.forEach((t) => {
  let today = new Date();
  let created = new Date(t.created);
  let week = new Date(today);

  week.setDate(today.getDate() - 7);

  let difference = Math.round(
    (created.getTime() - week.getTime()) / (1000 * 3600 * 24)
  );
  if (difference < 0) return;

  lastTickets.push(t);
});

lastTickets.forEach((t) => {
  let today = new Date();
  let created = new Date(t.created);

  let difference = Math.round(
    (today.getTime() - created.getTime()) / (1000 * 3600 * 24)
  );

  if (difference == 0) {
    amount[6] += 1;
  } else if (difference == 1) {
    amount[5] += 1;
  } else if (difference == 2) {
    amount[4] += 1;
  } else if (difference == 3) {
    amount[3] += 1;
  } else if (difference == 4) {
    amount[2] += 1;
  } else if (difference == 5) {
    amount[1] += 1;
  } else if (difference == 6) {
    amount[0] += 1;
  }
});

function formatDate(date) {
  var dd = date.getDate();
  var mm = date.getMonth() + 1;
  var yyyy = date.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  date = mm + "." + dd + "." + yyyy;
  return date;
}

function getDates() {
  var today = new Date();
  var oneDayAgo = new Date(today);
  var twoDaysAgo = new Date(today);
  var threeDaysAgo = new Date(today);
  var fourDaysAgo = new Date(today);
  var fiveDaysAgo = new Date(today);
  var sixDaysAgo = new Date(today);

  oneDayAgo.setDate(today.getDate() - 1);
  twoDaysAgo.setDate(today.getDate() - 2);
  threeDaysAgo.setDate(today.getDate() - 3);
  fourDaysAgo.setDate(today.getDate() - 4);
  fiveDaysAgo.setDate(today.getDate() - 5);
  sixDaysAgo.setDate(today.getDate() - 6);

  var result0 = formatDate(today);
  result1 = formatDate(oneDayAgo);
  result2 = formatDate(twoDaysAgo);
  result3 = formatDate(threeDaysAgo);
  result4 = formatDate(fourDaysAgo);
  result5 = formatDate(fiveDaysAgo);
  result6 = formatDate(sixDaysAgo);

  return [result6, result5, result4, result3, result2, result1, result0];
}

const data = {
  labels: getDates(),
  datasets: [
    {
      label: "Tickets",
      data: amount,
      fill: false,
      borderColor: "rgb(255, 255, 255)",
      tension: 0,
    },
  ],
};

const config = {
  type: "line",
  data: data,
  options: {
    legend: {
        display: false
    },
    scales: {
      yAxes: [
        {
          id: "y-axis-1",
          type: "linear",
          display: true,
          position: "left",
          ticks: {
            beginAtZero: true,
            userCallback: function (label, index, labels) {
              if (Math.floor(label) === label) {
                return label;
              }
            },
          },
          gridLines: {
            color: "rgba(255, 255, 255, .1)",
          }  
        }
      ],
      xAxes: [
        {
          gridLines: {
            color: "rgba(255, 255, 255, .1)",
          }  
        }
      ]
    },
  },
};

const ticketChart = new Chart(document.getElementById("tickets"), config);
