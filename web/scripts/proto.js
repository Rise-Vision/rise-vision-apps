//FAKE LOAD TABLE DATA WHEN READY
$(document).on('ready', function () {

  // SET UP ARRAYS
  var scheduleArray = [
    '<a href="https://apps.risevision.com/schedules/details/aa9e4cfb-8826-40e9-88de-8d57d09583a9" target="_blank"><span class="table-link ellipsis">Science Lab<button class="btn btn-default btn-xs add-left"><i class="fa fa-calendar"></i></button></span></a>',
    '<a href="https://apps.risevision.com/schedules/details/aa9e4cfb-8826-40e9-88de-8d57d09583a9" target="_blank"><span class="table-link ellipsis">Main Office<button class="btn btn-default btn-xs add-left"><i class="fa fa-calendar"></i></button></span></a>',
    '<a href="https://apps.risevision.com/schedules/details/aa9e4cfb-8826-40e9-88de-8d57d09583a9" target="_blank"><span class="table-link ellipsis">Accounting Room<button class="btn btn-default btn-xs add-left"><i class="fa fa-calendar"></i></button></span></a>',
    '<a href="https://apps.risevision.com/schedules/list" target="_blank"><button class="btn btn-xs btn-primary add-schedule"> Add To Schedule </button></a>',
    '<a class="ellipsis"><span class="text-muted ellipsis">  </span></a>'
  ]

  //INSERT PROTOTYPE SCHEDULES / STATUS
  function AddSchedulesStatuses() {
    $('td.display-schedule').each(function () {
      var randomNumber = Math.floor(Math.random() * scheduleArray.length);
      $(this).html(scheduleArray[randomNumber]);
      $(this).next('td').children('.pt-status').eq(randomNumber).show();
      randomNumber = '';
    });
  }

  //TIMED ACTIVATION
  setTimeout(function () {
    AddSchedulesStatuses();
  }, 15000);

  // $("#checkboxCompanyDetails").click(function(event) {
  //   if ($(this).is(":checked"))
  //     alert('yy');
  //     $("#formCompanyDetails").show();
  //   else
  //      alert('nn');
  //     $("#formCompanyDetails").hide();
  // });

 
});

 //CHECKBOX FIX COMPANY ADDRESS PROTOTYPE
// function toggleCompany(targetName, obj) {
//     var target = $(targetName);
//     var $input = $(obj);
//     if ($input.prop('checked')) $(target).hide();
//     else $(target).show();
// }

function valueChanged()
{
    if($('#checkboxCompanyDetails').is(":checked"))   
        $("#formCompanyDetails").hide();
    else
        $("#formCompanyDetails").show();
}

//FAKE 'ADD TO SCHEDULE' 
function protoAddToSchedule() {
  //alert("scheduleee added");
  $("#protoHideAddToSchedule").hide();
  $("#protoShowSchedule").show();
}

//LOOP THROUGH DISPLAY STATUS TYPES
function protoCycleStatus() {
  var showNext = $(".status:visible").next('.status');
  $('.status').hide();
  $(showNext).show();


  if ($('.status-not-installed').is(":visible")) {
    $('.proto-download').attr('disabled', 'disabled');
    $('.table-2 td').not('.proto-keep').empty().text('-');
  } 
  // else if ($('.status-not-online').is(":visible")) {
  //   $('.proto-download').attr('disabled', 'disabled');
  // }
}

//LOOP THROUGH SCREENSHOT STATUS TYPES
function cycleScreenshotState() {
  //ENABLE BUTTON
  if ( $(".proto-shot-state-not-installed").is(":visible") ) {
           var showNext = $(".proto-shot-state:visible").next('.proto-shot-state');
           $('.proto-shot-state').hide();
           $(showNext).show();
           $('#btnUpdateScreenshot').removeAttr('disabled');
  }
  //LOAD FAKE SCREENSHOT
  else if ( $(".proto-shot-state-ready").is(":visible") ) {
           $('.proto-shot-state').hide();
           $('.proto-shot-state-loading').show().delay(4000).queue(function () {
                 $('.proto-shot-state-loading').hide();
                 $('.proto-shot-state-loaded').show();
           });
  }
  else {
     var showNext = $(".proto-shot-state:visible").next('.proto-shot-state');
     $('.proto-shot-state').hide();
     $(showNext).show();
  }
}

//LOOP THROUGH SCREENSHOT STATUS TYPES MOBILE
function cycleScreenshotStateMobile() {
  //ENABLE BUTTON
  if ( $(".proto-shot-state-mobile-not-installed").is(":visible") ) {
           var showNext = $(".proto-shot-state-mobile:visible").next('.proto-shot-state-mobile');
           $('.proto-shot-state-mobile').hide();
           $(showNext).show();
           $('#btnUpdateScreenshotMobile').removeAttr('disabled');
  }
  //LOAD FAKE SCREENSHOT
  else if ( $(".proto-shot-state-mobile-ready").is(":visible") ) {
           $('.proto-shot-state-mobile').hide();
           $('.proto-shot-state-mobile-loading').show().delay(4000).queue(function () {
                 $('.proto-shot-state-mobile-loading').hide();
                 $('.proto-shot-state-mobile-loaded').show();
           });
  }
  else {
     var showNext = $(".proto-shot-state-mobile:visible").next('.proto-shot-state-mobile');
     $('.proto-shot-state-mobile').hide();
     $(showNext).show();
  }
}

//LOAD FAKE SCREENSHOT
function activateScreenshot() {
  // $('.proto-shot-state').hide();
  // $('.proto-shot-state-loading').show().delay(4000).queue(function () {
  //   $('.proto-shot-state-loading').hide();
  //   $('.proto-shot-state-loaded').show();
  // });
}

//LOAD FAKE SCREENSHOT MOBILE
function activateScreenshotMobile() {
  $('.proto-shot-state-mobile').hide();
  //timeout
  $('.proto-shot-state-loading-mobile').show().delay(4000).queue(function () {
    $('.proto-shot-state-loading-mobile').hide();
    $('.proto-shot-state-loaded-mobile').show();
  });
}