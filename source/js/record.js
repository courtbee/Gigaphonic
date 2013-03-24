(function () {
  $(document).ready(function () {
    $(".record").click(function () {
      $(this).parent().parent().find('td')
        .replaceWith("<td><form action='mix2.html'><h2 style='color:#8c0048'>Upload a new take</h2><input type='file' onchange='this.form.submit()'></input></form></td>");
      return false;
    });
  })
})();