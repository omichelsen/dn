var data = [];

$("#arrangementTable tr").each(function(index) {

  if(index === 0) return;

  var cols = $(this).find("td");

  data.push({
    dateFrom: $(cols[0]).find(".startDato").html().trim(),
    dateTo: $(cols[0]).find(".slutDato").html().trim(),
    time: $(cols[1]).html(),
    title: $(cols[2]).find("a").html(),
    type: $(cols[3]).html().trim(),
    zip: $(cols[4]).html().trim(),
    organizer: $(cols[5]).html().trim()
  });
});

console.log(JSON.stringify(data));