function initiateTable() {
  let ret =
    "<table id='mail-table' class='styled-table'>" +
    "<thead>" +
    "<tr>" +
    "<th>Id</th>" +
    "<th>Source</th>" +
    "<th>Mail</th>" +
    "<th>User Agent</th>" +
    "<th>Timestamp</th>" +
    "<th>Delete</th>" +
    "</tr>" +
    "</thead>" +
    "<tbody>" +
    "</tbody>" +
    "</table>";
  return ret;
}

function emptyTable() {
  let ret =
    "<div id='empty-table' class='no-mail-box'>" +
    "<p>" +
    "There are no entries! Please add a new entry by using the form below!" +
    "</p>" +
    "</div>";
  return ret;
}

function mailList() {
  // Call Web API to get a list of mail
  $.ajax({
    url: "/api/mail/",
    type: "GET",
    dataType: "json",
    success: function (mails) {
      mailListSuccess(mails);
    },
    error: function (request, message, error) {
      handleException(request, message, error);
    }
  });
}

function mailListSuccess(mails) {
  $.each(mails, function (index, mail) {
    mailAddRow(mail, index + 1);
  });
}

function mailAddRow(mail, i) {
  $("#mail-table tbody").append(mailBuildTableRow(mail, i));
}

function mailBuildTableRow(mail, i) {
  var date = new Date(mail.timestamp);
  var ret =
    "<tr>" +
    "<td>" +
    i +
    "</td>" +
    "<td>" +
    mail.source +
    "</td>" +
    "<td>" +
    mail.email.substr(0, 60) +
    "..." +
    "</td>" +
    "<td>" +
    mail.userAgent +
    "</td>" +
    "<td>" +
    date.toLocaleString() +
    "</td>" +
    "<td class='td-del'>" +
    "<a href='javascript:;' class='icon-button' aria-label='Icon-only Button'>" +
    "<i class='gg-remove'></i>";
  "</a>" + "</td>" + "</tr>";
  return ret;
}

function handleException(request, message, error) {
  var msg = "";
  msg += "Code: " + request.status + "\n";
  msg += "Text: " + request.statusText + "\n";
  if (request.responseJSON != null) {
    msg += "Message" + request.responseJSON.Message + "\n";
  }
  alert(msg);
}

$(document).ready(function () {
  secret =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZ3Vlc3QiLCJpYXQiOjE2NzU2MTI3MjZ9.TusyJyuOsu9b2wT0M1SAvr4If8BJgEOPnCiUIBxAupc";
  localStorage.setItem("simpleAPItoken", secret);

  if (mails && mails.length > 0) {
    $("#app").append(initiateTable());
    mailListSuccess(mails);
  } else if (mails && mails.length == 0) {
    $("#app").append(emptyTable());
  } else {
  }

  $("#toggle-add").click(function () {
    $("#add-entry-form").toggle("slow");
  });

  $("#add-entry-form").submit(function (event) {
    event.preventDefault();
    var datajson = convertFormToJSON($(this));
    $.ajax({
      url: "/api/sex",
      type: "POST",
      data: datajson,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("simpleAPItoken")
      },
      success: function (data) {
        $("#alert-box").show("slow");
        $("#alert-box").html("Entry successfully added with id: " + data.id);
        $("#alert-box").removeClass("error").addClass("success");
      },
      error: function (req, status, error) {
        $("#alert-box").show("slow");
        $("#alert-box").html("Error: " + error);
        $("#alert-box").removeClass("success").addClass("error");
      }
    });
  });
});

function convertFormToJSON(form) {
  return $(form)
    .serializeArray()
    .reduce(function (json, { name, value }) {
      json[name] = value;
      return json;
    }, {});
}
